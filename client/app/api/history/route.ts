import { HistoryService } from "@/app/src/services/historyService";

export async function GET() {
    try {
        const service = new HistoryService();
        const history = await service.getHistory();
        return Response.json({ success: true, history });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}