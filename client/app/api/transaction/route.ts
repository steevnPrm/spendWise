import { CalculateService } from "@/app/src/services/transactionService";

// app/api/transaction/route.ts
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { senderId, receiverId, amount } = body;

        const service = new CalculateService(0, 0);

        const result = await service.transferBetweenUsers(
            senderId,
            receiverId,
            amount
        );

        return Response.json({ success: true, result });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}