'use client';

import { useState, useEffect } from 'react';
import { QrCode, Plus, Link2 } from 'lucide-react';

interface Card {
    id: string;
    name: string;
    role: string;
    creci: string;
    company: string;
}

export default function AdminPanel() {
    const [cards, setCards] = useState<Card[]>([]);
    const [baseUrl, setBaseUrl] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: 'Corretor de Imóveis',
        creci: '',
        phone: '',
        email: '',
        instagram: '',
        linkedin: '',
        website: '',
        company: 'Mota Carvalho',
        bio: '',
    });

    useEffect(() => {
        setBaseUrl(window.location.origin);
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const res = await fetch('/api/cards');
            const data = await res.json();
            if (Array.isArray(data)) setCards(data);
        } catch (error) {
            console.error('Erro ao buscar cartões:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Cartão criado com sucesso!');
                setFormData({
                    name: '',
                    role: 'Corretor de Imóveis',
                    creci: '',
                    phone: '',
                    email: '',
                    instagram: '',
                    linkedin: '',
                    website: '',
                    company: 'Mota Carvalho',
                    bio: '',
                });
                fetchCards();
            } else {
                alert('Erro ao salvar o cartão. Verifique a conexão com o banco.');
            }
        } catch (error) {
            alert('Erro interno ao enviar dados.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-850 flex items-center gap-2">
                        <Plus size={22} className="text-blue-600" /> Novo Cartão de Visitas
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Nome Completo *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Cargo</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">CRECI</label>
                                <input
                                    type="text"
                                    value={formData.creci}
                                    onChange={e => setFormData({ ...formData, creci: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">WhatsApp/Fone *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: 5518999999999"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">E-mail *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Instagram (Usuário)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: fulano.imoveis"
                                    value={formData.instagram}
                                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Empresa/Imobiliária</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Website (URL Completa)</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.website}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Pequena Bio / Slogan</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full border border-gray-300 p-2 rounded-lg h-20 text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm">
                            Salvar e Gerar Link NFC
                        </button>
                    </form>
                </div>

                {/* Listagem de Cartões Gerados */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <QrCode size={22} className="text-green-600" /> Seus Cartões / Gravar na TAG
                    </h2>
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                        {cards.length === 0 ? (
                            <p className="text-gray-400 text-sm">Nenhum cartão cadastrado ainda.</p>
                        ) : (
                            cards.map(card => {
                                const nfcUrl = `${baseUrl}/c/${card.id}`;
                                return (
                                    <div key={card.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition relative group bg-white">
                                        <h3 className="font-bold text-gray-800">{card.name}</h3>
                                        <p className="text-xs text-gray-500">{card.role} {card.creci && `• CRECI: ${card.creci}`}</p>
                                        <p className="text-xs text-blue-600 font-semibold mt-1">{card.company}</p>

                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={nfcUrl}
                                                className="bg-gray-100 text-xs p-2 rounded flex-1 text-gray-600 select-all font-mono border border-gray-200"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(nfcUrl);
                                                    alert('Link copiado! Pronto para colar no app de gravação NFC ou no Ngrok.');
                                                }}
                                                className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-2 rounded-md transition flex items-center gap-1 shrink-0 font-medium"
                                            >
                                                <Link2 size={14} /> Copiar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
