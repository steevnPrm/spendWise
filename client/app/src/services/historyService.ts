import { kv } from '@vercel/kv';

export class HistoryService {
    private readonly HISTORY_KEY = 'transactions';

    async getHistory() {
        try {
            const history = await kv.get<any[]>(this.HISTORY_KEY);
            return history || [];
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique KV:", error);
            return [];
        }
    }
}