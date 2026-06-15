import { prisma } from '@/src/lib/prisma';
import { NextResponse } from 'next/server';

// Atualizar um cartão específico
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedCard = await prisma.card.update({
            where: { id },
            data: {
                name: body.name,
                role: body.role,
                creci: body.creci || null,
                phone: body.phone,
                email: body.email,
                instagram: body.instagram || null,
                facebook: body.facebook || null,
                linkedin: body.linkedin || null,
                website: body.website || null,
                company: body.company || null,
                bio: body.bio || null,
                avatarUrl: body.avatarUrl || null,
            },
        });

        return NextResponse.json(updatedCard);
    } catch (error) {
        console.error("Erro ao atualizar cartão:", error);
        return NextResponse.json({ error: 'Erro ao atualizar cartão.' }, { status: 500 });
    }
}

// Deletar um cartão
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.card.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Cartão deletado com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar cartão:", error);
        return NextResponse.json({ error: 'Erro ao deletar cartão.' }, { status: 500 });
    }
}

// Buscar um cartão específico (opcional)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const card = await prisma.card.findUnique({
            where: { id },
        });

        if (!card) {
            return NextResponse.json({ error: 'Cartão não encontrado' }, { status: 404 });
        }

        return NextResponse.json(card);
    } catch (error) {
        console.error("Erro ao buscar cartão:", error);
        return NextResponse.json({ error: 'Erro ao buscar cartão.' }, { status: 500 });
    }
}