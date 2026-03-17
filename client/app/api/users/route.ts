import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'app', 'src', 'mockData', 'users.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(fileContent);
        return NextResponse.json(users);

    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return NextResponse.json(
            { error: "Impossible de charger les utilisateurs" },
            { status: 500 }
        );
    }
}