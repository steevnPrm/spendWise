import { promises as fs } from 'fs';
import path from 'path';
import { from, of, Observable } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'
import { UserModel } from '../utils/userMapper'
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
    constructor(
        protected readonly val1: number,
        protected readonly val2: number,
    ) {
        this.validate(val1);
        this.validate(val2);
    }

    protected validate(value: number): number {
        if (value < 0) throw new Error("Value must be positive");
        return value;
    }
}

export interface TransactionModel {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    type: string;
    date: string;
}

export class CalculateService extends TransactionService {
    private readonly filePath = path.join(process.cwd(), 'app', 'src', 'mockData', 'users.json');
    private readonly historyPath = path.join(process.cwd(), 'app', 'src', 'mockData', 'transactions.json');

    constructor(n1: number, n2: number) {
        super(n1, n2);
    }

    public getUpdatedUser$(userId: string, amountToAdd: number): Observable<number | null> {
        return from(fs.readFile(this.filePath, 'utf8')).pipe(

            map((content: string) => JSON.parse(content) as UserModel[]),


            map((users: UserModel[]) => {
                const user = users.find((u: UserModel) => u.id === userId);
                if (!user) throw new Error("Utilisateur introuvable");
                return { allUsers: users, targetUser: user };
            }),


            map(({ allUsers, targetUser }: { allUsers: UserModel[], targetUser: UserModel }) => {
                const previousBalance = Number(targetUser.amount);
                const transactionAmount = Number(amountToAdd);

                if (isNaN(previousBalance) || isNaN(transactionAmount)) {
                    throw new Error(`Calcul avorté : Valeurs non numériques détectées (Solde: ${targetUser.amount}, Ajout: ${amountToAdd})`);
                }

                const newBalance = previousBalance + transactionAmount;
                targetUser.amount = Number(newBalance.toFixed(2));

                targetUser.lastUpdate = new Date().toISOString();

                console.log("Ancien solde :", previousBalance);
                console.log("Montant ajouté :", transactionAmount);
                console.log("Nouveau solde (sécurisé) :", targetUser.amount);

                return allUsers;
            }),


            switchMap((updatedUsers: UserModel[]) =>
                from(fs.writeFile(this.filePath, JSON.stringify(updatedUsers, null, 2))).pipe(
                    map(() => {
                        const user = updatedUsers.find((u: UserModel) => u.id === userId);
                        return user ? user.amount : null;
                    })
                )
            ),

            catchError((err: Error) => {
                console.error("Erreur flux financier:", err.message);
                return of(null);
            })
        );
    }

    public async toHistory(userId: string, amountToAdd: number) {
        const transaction: TransactionModel = {
            id: uuidv4(),
            userId: userId,
            amount: amountToAdd,
            currency: "EUR",
            type: amountToAdd > 0 ? "transaction" : "retrait",
            date: new Date().toISOString(),
        }

        try {
            const content = await fs.readFile(this.historyPath, 'utf8');
            const history = content.trim() ? JSON.parse(content) : [];
            history.push(transaction);
            await fs.writeFile(this.historyPath, JSON.stringify(history, null, 2));
        } catch (error) {
            console.error("Erreur lors de l'écriture de l'historique :", error);
        }

    }


    async transferBetweenUsers(fromId: string, toId: string, amount: number) {
        const rawData = await fs.readFile(this.filePath, 'utf8');
        const users: UserModel[] = JSON.parse(rawData);

        const sender = users.find(u => u.id === fromId);
        const receiver = users.find(u => u.id === toId);

        if (!sender || !receiver) {
            throw new Error("L'expéditeur ou le destinataire est introuvable.");
        }
        if (sender.amount < amount) {
            throw new Error("Solde insuffisant pour effectuer ce virement.");
        }
        sender.amount = Number((Number(sender.amount) - amount).toFixed(2));
        receiver.amount = Number((Number(receiver.amount) + amount).toFixed(2));

        const now = new Date().toISOString();
        sender.lastUpdate = now;
        receiver.lastUpdate = now;
        await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
        await this.toHistory(fromId, -amount);
        await this.toHistory(toId, amount);

        return { senderBalance: sender.amount, receiverBalance: receiver.amount };
    }
}