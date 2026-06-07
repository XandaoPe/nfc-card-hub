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
                creci: body.creci,
                phone: body.phone,
                email: body.email,
                instagram: body.instagram,
                linkedin: body.linkedin,
                website: body.website,
                company: body.company,
                bio: body.bio,
            },
        });
        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
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
        return NextResponse.json({ error: 'Erro ao buscar cartões.' }, { status: 500 });
    }
}