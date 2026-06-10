import { notFound } from 'next/navigation';
import { Phone, Mail, Globe, Instagram, Linkedin, Award, Building2 } from 'lucide-react';
import { prisma } from '@/src/lib/prisma';
import VCardButton from '../../components/VCardButton';

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

    const whatsappUrl = `https://wa.me/${card.phone.replace(/\D/g, '')}`;

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 antialiased text-slate-100">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-auto">

                {/* Banner Superior Executivo */}
                <div className="h-32 bg-gradient-to-tr from-amber-600 to-amber-800 relative flex items-end justify-center pb-4">
                    {/* Avatar com a Inicial */}
                    {/* Avatar - Mostra foto se existir, senão mostra a inicial */}
                    <div className="absolute -bottom-12 bg-slate-900 p-1.5 rounded-full shadow-xl">
                        {card.avatarUrl ? (
                            <img
                                src={card. avatarUrl}
                                alt={card.name}
                                className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/30"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl font-extrabold text-white tracking-wider border border-amber-400/30">
                                {card.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Corpo do Cartão */}
                <div className="pt-16 pb-8 px-6 text-center">

                    {/* Nome e Cargo */}
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                        {card.name}
                    </h1>
                    <p className="text-amber-400 text-sm font-semibold tracking-wide uppercase">
                        {card.role}
                    </p>

                    {/* Crachá do CRECI */}
                    {card.creci && (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700 shadow-inner">
                            <Award size={14} className="text-amber-500" />
                            <span>CRECI {card.creci}</span>
                        </div>
                    )}

                    {/* Imobiliária / Empresa */}
                    {card.company && (
                        <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
                            <Building2 size={14} className="text-amber-500/70" />
                            <span>{card.company}</span>
                        </p>
                    )}

                    {/* Slogan / Bio */}
                    {card.bio && (
                        <div className="mt-5 px-4">
                            <p className="text-sm text-slate-300 italic bg-slate-800/40 py-2.5 px-4 rounded-xl border-l-4 border-amber-500/60 text-center leading-relaxed">
                                "{card.bio}"
                            </p>
                        </div>
                    )}

                    {/* Botão de Ação Principal (WhatsApp Call-to-Action) */}
                    <div className="mt-6 space-y-3 px-2">
                        {/* WhatsApp */}
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/50 transform active:scale-95 text-base tracking-wide">
                            <Phone size={18} />
                            Falar no WhatsApp
                        </a>

                        {/* Botão Salvar Contato */}
                        <VCardButton card={card} />
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-widest">Canais de Contato</span>
                        </div>
                    </div>

                    {/* Lista de Links Sociais */}
                    <div className="space-y-3 text-left">

                        {/* E-mail */}
                        <a href={`mailto:${card.email}`} className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
                            <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                                <Mail size={18} />
                            </div>
                            <div className="truncate">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail Oficial</p>
                                <p className="text-sm text-slate-200 font-medium truncate">{card.email}</p>
                            </div>
                        </a>

                        {/* Instagram */}
                        {card.instagram && (
                            <a href={`https://instagram.com/${card.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
                                <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                                    <Instagram size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instagram</p>
                                    <p className="text-sm text-slate-200 font-medium">@{card.instagram.replace('@', '')}</p>
                                </div>
                            </a>
                        )}

                        {/* Website / Catálogo de Imóveis */}
                        {card.website && (
                            <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group">
                                <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                                    <Globe size={18} />
                                </div>
                                <div className="truncate">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website / Catálogo</p>
                                    <p className="text-sm text-slate-200 font-medium truncate">{card.website.replace(/^https?:\/\/(www\.)?/, '')}</p>
                                </div>
                            </a>
                        )}

                        {/* LinkedIn (Opcional) */}
                        {card.linkedin && (
                            <a
                                href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3.5 p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 group"
                            >
                                <div className="p-2 bg-slate-700/60 rounded-lg text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                                    <Linkedin size={18} />
                                </div>
                                <div className="truncate">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn Profissional</p>
                                    <p className="text-sm text-slate-200 font-medium truncate">
                                        {card.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                    </p>
                                </div>
                            </a>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}