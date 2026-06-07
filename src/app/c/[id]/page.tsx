import { notFound } from 'next/navigation';
import { Phone, Mail, Globe, Award, Building2, Linkedin, Instagram } from 'lucide-react';
import { prisma } from '@/src/lib/prisma';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewCard({ params }: PageProps) {
    const { id } = await params;

    const card = await prisma.card.findUnique({
        where: { id },
    });

    if (!card) {
        notFound();
    }

    // Formata o link do WhatsApp de forma limpa
    const whatsappUrl = `https://wa.me/${card.phone.replace(/\D/g, '')}`;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">

                {/* Header Decorativo */}
                <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-700 relative flex items-end justify-center pb-4">
                    <div className="absolute -bottom-10 bg-slate-700 p-1.5 rounded-full border-4 border-slate-800">
                        <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-3xl font-black text-white">
                            {card.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Informações Principais */}
                <div className="pt-14 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">{card.name}</h1>
                    <p className="text-amber-400 text-sm font-medium mt-1">{card.role}</p>

                    {card.creci && (
                        <div className="inline-flex items-center gap-1 bg-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-300 mt-2 border border-slate-600">
                            <Award size={14} className="text-amber-500" />
                            <span>CRECI {card.creci}</span>
                        </div>
                    )}

                    {card.company && (
                        <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                            <Building2 size={14} /> {card.company}
                        </p>
                    )}

                    {card.bio && (
                        <p className="text-sm text-slate-300 italic mt-4 px-4 border-l-2 border-amber-500/50">
                            "{card.bio}"
                        </p>
                    )}

                    {/* Botão de Ação Principal (Chamar no Zap) */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-900/40 transform active:scale-95"
                    >
                        Falar no WhatsApp
                    </a>

                    {/* Lista de Contatos/Redes */}
                    <div className="mt-6 space-y-3 text-left">
                        <a href={`mailto:${card.email}`} className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl transition group">
                            <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-amber-600 transition"><Mail size={18} /></div>
                            <div className="truncate"><p className="text-xs text-slate-400">E-mail</p><p className="text-sm truncate">{card.email}</p></div>
                        </a>

                        {card.instagram && (
                            <a href={`https://instagram.com/${card.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl transition group">
                                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-amber-600 transition"><Instagram size={18} /></div>
                                <div><p className="text-xs text-slate-400">Instagram</p><p className="text-sm">@{card.instagram}</p></div>
                            </a>
                        )}

                        {card.linkedin && (
                            <a href={card.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl transition group">
                                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-amber-600 transition"><Linkedin size={18} /></div>
                                <div className="truncate"><p className="text-xs text-slate-400">LinkedIn</p><p className="text-sm truncate">Ver perfil</p></div>
                            </a>
                        )}

                        {card.website && (
                            <a href={card.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl transition group">
                                <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-amber-600 transition"><Globe size={18} /></div>
                                <div className="truncate"><p className="text-xs text-slate-400">Website / Catálogo</p><p className="text-sm truncate">{card.website.replace(/^https?:\/\//, '')}</p></div>
                            </a>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}