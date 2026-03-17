import { promises as fs } from 'fs';
import path from 'path';


export class HistoryService {
    private readonly historyPath = path.join(process.cwd(), 'app', 'src', 'mockData', 'transactions.json');
    async getHistory() {
        const content = await fs.readFile(this.historyPath, 'utf8');
        const history: any[] = JSON.parse(content);
        return history;
    }
}