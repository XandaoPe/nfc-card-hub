// import { notFound } from 'next/navigation';
// import { Phone, Mail, Globe, Instagram, Linkedin, Award, Building2 } from 'lucide-react';
// import { prisma } from '@/src/lib/prisma';
// import VCardButton from '../../components/VCardButton';

// interface PageProps {
//     params: Promise<{ id: string }>;
// }

// export default async function ViewCard({ params }: PageProps) {
//     const { id } = await params;

//     const card = await prisma.card.findUnique({
//         where: { id },
//     });

//     if (!card) {
//         notFound();
//     }

//     const whatsappUrl = `https://wa.me/${card.phone.replace(/\D/g, '')}`;

//     return (
//         <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 antialiased text-slate-100">
//             <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-auto">

//                 {/* Banner Superior Executivo */}
//                 <div className="h-32 bg-gradient-to-tr from-amber-600 to-amber-800 relative flex items-end justify-center pb-4">
//                     {/* Avatar com a Inicial */}
//                     {/* Avatar - Mostra foto se existir, senão mostra a inicial */}
//                     <div className="absolute -bottom-12 bg-slate-900 p-1.5 rounded-full shadow-xl">
//                         {card.avatarUrl ? (
//                             <img
//                                 src={card. avatarUrl}
//                                 alt={card.name}
//                                 className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/30"
//                             />
//                         ) : (
//                             <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl font-extrabold text-white tracking-wider border border-amber-400/30">
//                                 {card.name.charAt(0).toUpperCase()}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Corpo do Cartão */}
//                 <div className="pt-16 pb-8 px-6 text-center">

//                     {/* Nome e Cargo */}
//                     <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
//                         {card.name}
//                     </h1>
//                     <p className="text-amber-400 text-sm font-semibold tracking-wide uppercase">
//                         {card.role}
//                     </p>

//                     {/* Crachá do CRECI */}
//                     {card.creci && (
//                         <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700 shadow-inner">
//                             <Award size={14} className="text-amber-500" />
//                             <span>CRECI {card.creci}</span>
//                         </div>
//                     )}

//                     {/* Imobiliária / Empresa */}
//                     {card.company && (
//                         <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
//                             <Building2 size={14} className="text-amber-500/70" />
//                             <span>{card.company}</span>
//                         </p>
//                     )}

//                     {/* Slogan / Bio */}
//                     {card.bio && (
//                         <div className="mt-5 px-4">
//                             <p className="text-sm text-slate-300 italic bg-slate-800/40 py-2.5 px-4 rounded-xl border-l-4 border-amber-500/60 text-center leading-relaxed">
//                                 "{card.bio}"
//                             </p>
//                         </div>
//                     )}

//                     {/* Botão de Ação Principal (WhatsApp Call-to-Action) */}
//                     <div className="mt-6 space-y-3 px-2">
//                         {/* WhatsApp */}
//                         <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/50 transform active:scale-95 text-base tracking-wide">
//                             <Phone size={18} />
//                             Falar no WhatsApp
//                         </a>

//                         {/* Botão Salvar Contato */}
//                         <VCardButton card={card} />
//                     </div>

//                     <div className="relative my-6">
//                         <div className="absolute inset-0 flex items-center" aria-hidden="true">
//                             <div className="w-full border-t border-slate-800"></div>
//                         </div>
//                         <div className="relative flex justify-center text-xs uppercase">
//                             <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-widest">Canais de Contato</span>
//                         </div>
//                     </div>

//                     {/* Lista de Links Sociais */}
//                     <div className="space-y-3 text-left">

//                         {/* E-mail */}
//                         <a href={`mailto:${card.email}`} className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
//                             <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
//                                 <Mail size={18} />
//                             </div>
//                             <div className="truncate">
//                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail Oficial</p>
//                                 <p className="text-sm text-slate-200 font-medium truncate">{card.email}</p>
//                             </div>
//                         </a>

//                         {/* Instagram */}
//                         {card.instagram && (
//                             <a href={`https://instagram.com/${card.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
//                                 <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
//                                     <Instagram size={18} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instagram</p>
//                                     <p className="text-sm text-slate-200 font-medium">@{card.instagram.replace('@', '')}</p>
//                                 </div>
//                             </a>
//                         )}

//                         {/* Website / Catálogo de Imóveis */}
//                         {card.website && (
//                             <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
//                                 <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
//                                     <Globe size={18} />
//                                 </div>
//                                 <div className="truncate">
//                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website / Catálogo</p>
//                                     <p className="text-sm text-slate-200 font-medium truncate">{card.website.replace(/^https?:\/\/(www\.)?/, '')}</p>
//                                 </div>
//                             </a>
//                         )}

//                         {/* LinkedIn (Opcional) */}
//                         {card.linkedin && (
//                             <a
//                                 href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group"
//                             >
//                                 <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
//                                     <Linkedin size={18} />
//                                 </div>
//                                 <div className="truncate">
//                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn Profissional</p>
//                                     <p className="text-sm text-slate-200 font-medium truncate">
//                                         {card.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
//                                     </p>
//                                 </div>
//                             </a>
//                         )}

//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }

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
                    // Procura o cartão específico pelo ID
                    const selectedCard = data.find((c: any) => c.id === id);
                    if (selectedCard) setCard(selectedCard);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    // 1. Função para Baixar o Contato Direto para a Agenda do Celular (com a URL)
    const handleSaveToContacts = () => {
        if (!card) return;

        const currentUrl = window.location.href;

        // Monta a estrutura do arquivo VCF (Virtual Card)
        const vcard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${card.name}`,
            `ORG:${card.company || ''}`,
            `TITLE:${card.role} ${card.creci ? `(CRECI ${card.creci})` : ''}`,
            `TEL;TYPE=CELL;TYPE=PREF:${card.phone}`,
            `EMAIL;TYPE=INTERNET:${card.email}`,
            `URL:${currentUrl}`, // <--- GRAVA A URL DO CARTÃO NA AGENDA DO CELULAR!
            `NOTE:Biografia: ${card.bio || ''}`,
            'END:VCARD'
        ].join('\r\n');

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${card.name.split(' ')[0]}_contato.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 2. Função de Compartilhar Nativo (Abre WhatsApp buscando na agenda do celular)
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
            // Fallback para navegadores de desktop que não suportam a gaveta nativa
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

                {/* 🚀 BOTÕES DE AÇÃO PRINCIPAL (SALVAR E COMPARTILHAR) */}
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

                    <a href={`https://wa.me/55${card.phone}`} target="_blank" className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold p-3 rounded-xl flex items-center justify-between text-sm transition-all">
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