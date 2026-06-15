'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface CardData {
    name: string;
    role: string;
    creci?: string;
    company?: string;
    bio?: string;
    phone: string;
    email: string;
    instagram?: string;
    facebook?: string; // <--- ADICIONADO NA INTERFACE
    website?: string;
    linkedin?: string;
    avatarUrl?: string;
}

export default function ClientCardPage() {
    const params = useParams();
    const id = params?.id as string;

    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/cards`)
                .then((res) => res.json())
                .then((data) => {
                    const selectedCard = data.find((c: any) => c.id === id);
                    if (selectedCard) setCard(selectedCard);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    // 1. Função para Baixar o Contato com a URL do cartão e Redes Sociais inclusas
    const handleSaveToContacts = () => {
        if (!card) return;

        const currentUrl = window.location.href;

        const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${card.name}`,
            `ORG:${card.company || ''}`,
            `TITLE:${card.role} ${card.creci ? `(CRECI ${card.creci})` : ''}`,
            `TEL;TYPE=CELL;TYPE=PREF:${card.phone}`,
            `EMAIL;TYPE=INTERNET:${card.email}`,
            `URL:${currentUrl}`,
            card.instagram ? `URL;TYPE=Instagram:https://instagram.com/${card.instagram.replace('@', '')}` : '',
            card.facebook ? `URL;TYPE=Facebook:${card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`}` : '',
            card.linkedin ? `URL;TYPE=LinkedIn:${card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}` : '',
            `NOTE:Biografia: ${card.bio || ''}`,
            'END:VCARD'
        ].filter(line => line).join('\r\n');

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${card.name.split(' ')[0]}_contato.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 2. Função de Compartilhar Nativo via Celular
    const handleShare = async () => {
        if (!card) return;

        const shareData = {
            title: card.name,
            text: `Olá! Segue o cartão de visitas digital de ${card.name} (${card.role}). Clique no link para ver os contatos:`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Compartilhamento cancelado');
            }
        } else {
            const text = encodeURIComponent(`${shareData.text} ${shareData.url}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                Carregando cartão interativo...
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-rose-400 font-semibold">
                Cartão não encontrado ou link inválido.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4">
            <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl mt-8 relative overflow-hidden backdrop-blur-xl">

                {/* Foto de Perfil Premium */}
                <div className="flex flex-col items-center text-center mt-4">
                    <div className="w-28 h-28 rounded-full border-4 border-amber-500/30 p-1 bg-slate-950 shadow-xl shadow-amber-500/5 overflow-hidden">
                        {card.avatarUrl ? (
                            <img src={card.avatarUrl} alt={card.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-amber-500">
                                {card.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-white mt-4 tracking-tight uppercase">{card.name}</h1>
                    <p className="text-amber-500 font-medium text-sm tracking-wide mt-1 uppercase">{card.role}</p>

                    {card.creci && (
                        <span className="mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                            CRECI {card.creci}
                        </span>
                    )}

                    {card.company && (
                        <p className="text-slate-400 text-xs mt-3 font-semibold uppercase tracking-wider">{card.company}</p>
                    )}

                    {card.bio && (
                        <p className="text-slate-400 text-sm mt-4 italic max-w-xs text-center border-t border-slate-800/60 pt-4">
                            "{card.bio}"
                        </p>
                    )}
                </div>

                {/* BotõesPrincipais */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        onClick={handleSaveToContacts}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/10 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        📥 Salvar na Agenda
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold py-3 px-4 rounded-xl border border-slate-700/60 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                        🔗 Compartilhar
                    </button>
                </div>

                {/* Canais de Contato Rápidos */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Canais de Contato</p>

                    <a href={`https://wa.me/55${card.phone.replace(/\D/g, '')}`} target="_blank" className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold p-3 rounded-xl flex items-center justify-between text-sm transition-all">
                        <span>Falar no WhatsApp</span>
                        <span>➔</span>
                    </a>

                    <a href={`mailto:${card.email}`} className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 p-3 rounded-xl flex items-center justify-between text-sm transition-all">
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-500">E-mail</span>
                            <span className="text-xs truncate max-w-[240px]">{card.email}</span>
                        </div>
                        <span>➔</span>
                    </a>

                    {card.instagram && (
                        <a href={`https://instagram.com/${card.instagram.replace('@', '')}`} target="_blank" className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 p-3 rounded-xl flex items-center justify-between text-sm transition-all">
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Instagram</span>
                                <span className="text-xs">@{card.instagram.replace('@', '')}</span>
                            </div>
                            <span>➔</span>
                        </a>
                    )}

                    {/* 🔵 BOTÃO DO FACEBOOK ADICIONADO */}
                    {card.facebook && (
                        <a href={card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`} target="_blank" className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 p-3 rounded-xl flex items-center justify-between text-sm transition-all">
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Facebook</span>
                                <span className="text-xs truncate max-w-[240px]">{card.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}</span>
                            </div>
                            <span>➔</span>
                        </a>
                    )}

                    {card.website && (
                        <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 p-3 rounded-xl flex items-center justify-between text-sm transition-all">
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Site / Catálogo</span>
                                <span className="text-xs truncate max-w-[240px]">{card.website}</span>
                            </div>
                            <span>➔</span>
                        </a>
                    )}
                </div>

            </div>
        </div>
    );
}