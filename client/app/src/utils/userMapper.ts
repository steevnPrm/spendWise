export interface UserModel {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    amount: number;
    currency: string;
    isPremium: boolean;
    lastUpdate: string;
}


export async function JsonToUser(json: UserModel): Promise<UserModel> {
    const user: UserModel = {
        id: json.id,
        username: json.username,
        password: json.password,
        firstName: json.firstName,
        lastName: json.lastName,
        amount: json.amount,
        currency: json.currency,
        isPremium: json.isPremium,
        lastUpdate: json.lastUpdate,
    }
    return user;
}
