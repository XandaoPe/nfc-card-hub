import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

// Criar um novo cartão
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newCard = await prisma.card.create({
            data: {
                name: body.name,
                role: body.role,
                creci: body.creci || null,
                phone: body.phone,
                email: body.email,
                instagram: body.instagram || null,
                linkedin: body.linkedin || null,
                website: body.website || null,
                company: body.company || null,
                bio: body.bio || null,
                avatarUrl: body.avatarUrl || null,
            },
        });

        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
        console.error("Erro no Prisma ao criar cartão:", error);
        return NextResponse.json({ error: 'Erro ao criar cartão.' }, { status: 500 });
    }
}

// Listar todos os cartões cadastrados
export async function GET() {
    try {
        const cards = await prisma.card.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(cards);
    } catch (error) {
        console.error("Erro no Prisma ao buscar cartões:", error);
        return NextResponse.json({ error: 'Erro ao buscar cartões.' }, { status: 500 });
    }
}