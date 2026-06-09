'use client';

import { useState, useEffect } from 'react';

interface Card {
    id: string;
    name: string;
    role: string;
    company?: string;
    avatarUrl?: string;
}

export default function AdminPanel() {
    const [cards, setCards] = useState<Card[]>([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        creci: '',
        company: '',
        bio: '',
        phone: '',
        email: '',
        instagram: '',
        website: '',
        linkedin: '',
        avatarUrl: '', // Armazenará o Base64 da imagem
    });

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        const res = await fetch('/api/cards');
        if (res.ok) {
            const data = await res.json();
            setCards(data);
        }
    };

    // Função mágica para converter o arquivo de imagem em texto Base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validação básica de tamanho (limitar a 2MB para não estourar o limite do documento MongoDB)
        if (file.size > 2 * 1024 * 1024) {
            alert('A imagem é muito pesada! Escolha uma foto de até 2MB.');
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData({ ...formData, avatarUrl: reader.result as String | any });
            setUploading(false);
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setFormData({
                name: '',
                role: '',
                creci: '',
                company: '',
                bio: '',
                phone: '',
                email: '',
                instagram: '',
                website: '',
                linkedin: '',
                avatarUrl: '',
            });
            // Limpa o campo de arquivo visualmente
            const fileInput = document.getElementById('avatar-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            fetchCards();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Formulário */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-xl font-bold mb-4 text-amber-500">Cadastrar Novo Cartão NFC</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* SEÇÃO DE UPLOAD DA FOTO */}
                        <div className="bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-700 flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-slate-500">Sem Foto</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Foto de Perfil</label>
                                <input
                                    id="avatar-file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Formatos aceitos: JPG, PNG. Máx: 2MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nome Completo *</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Cargo / Profissão *</label>
                                <input type="text" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">CRECI (Opcional)</label>
                                <input type="text" value={formData.creci} onChange={e => setFormData({ ...formData, creci: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Empresa / Imobiliária</label>
                                <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">WhatsApp (Com DDD) *</label>
                                <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">E-mail Oficial *</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Slogan / Biografia Curta</label>
                            <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instagram (@)</label>
                                <input type="text" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Site / Catálogo</label>
                                <input type="text" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LinkedIn URL</label>
                                <input type="text" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Processando foto...' : 'Salvar e Gerar Link NFC'}
                        </button>
                    </form>
                </div>

                {/* Listagem */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-slate-300">Cartões Ativos</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {cards.map(card => {
                            const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${card.id}` : '';
                            return (
                                <div key={card.id} className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-600">
                                            {card.avatarUrl ? (
                                                <img src={card.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                                                    {card.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{card.name}</h3>
                                            <p className="text-xs text-slate-400">{card.role} {card.company ? `• ${card.company}` : ''}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { navigator.clipboard.writeText(fullUrl); alert('Link copiado!'); }} className="bg-slate-700 hover:bg-slate-600 text-xs font-semibold py-2 px-4 rounded-lg transition-all text-amber-400 border border-slate-600 cursor-pointer">
                                        Copiar Link
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}