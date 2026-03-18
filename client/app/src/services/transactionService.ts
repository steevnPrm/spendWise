import { from, of, Observable } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'
import { UserModel } from '../utils/userMapper'
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';

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
    private readonly USERS_KEY = 'users';
    private readonly HISTORY_KEY = 'transactions';

    constructor(n1: number, n2: number) {
        super(n1, n2);
    }

    public getUpdatedUser$(userId: string, amountToAdd: number): Observable<number | null> {
        return from(kv.get<UserModel[]>(this.USERS_KEY)).pipe(
            map((users) => {
                const allUsers = users || [];
                const user = allUsers.find((u: UserModel) => u.id === userId);
                if (!user) throw new Error("Utilisateur introuvable");
                return { allUsers, targetUser: user };
            }),
            map(({ allUsers, targetUser }) => {
                const previousBalance = Number(targetUser.amount);
                const transactionAmount = Number(amountToAdd);

                if (isNaN(previousBalance) || isNaN(transactionAmount)) {
                    throw new Error(`Calcul avorté : Valeurs non numériques`);
                }

                targetUser.amount = Number((previousBalance + transactionAmount).toFixed(2));
                targetUser.lastUpdate = new Date().toISOString();

                return allUsers;
            }),
            switchMap((updatedUsers: UserModel[]) =>
                from(kv.set(this.USERS_KEY, updatedUsers)).pipe(
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
            userId,
            amount: amountToAdd,
            currency: "EUR",
            type: amountToAdd > 0 ? "transaction" : "retrait",
            date: new Date().toISOString(),
        }

        try {
            const history = await kv.get<TransactionModel[]>(this.HISTORY_KEY) || [];
            history.push(transaction);
            await kv.set(this.HISTORY_KEY, history);
        } catch (error) {
            console.error("Erreur historique KV :", error);
        }
    }

    async transferBetweenUsers(fromId: string, toId: string, amount: number) {
        const users = await kv.get<UserModel[]>(this.USERS_KEY) || [];

        const sender = users.find(u => u.id === fromId);
        const receiver = users.find(u => u.id === toId);

        if (!sender || !receiver) throw new Error("Utilisateur introuvable.");
        if (sender.amount < amount) throw new Error("Solde insuffisant.");

        sender.amount = Number((Number(sender.amount) - amount).toFixed(2));
        receiver.amount = Number((Number(receiver.amount) + amount).toFixed(2));

        const now = new Date().toISOString();
        sender.lastUpdate = receiver.lastUpdate = now;

        await kv.set(this.USERS_KEY, users);

        await this.toHistory(fromId, -amount);
        await this.toHistory(toId, amount);

        return { senderBalance: sender.amount, receiverBalance: receiver.amount };
    }
}