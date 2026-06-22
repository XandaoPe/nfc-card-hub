'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, X } from 'lucide-react';

interface Card {
    id: string;
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
    facebook?: string; // Adicionado campo opcional na Interface
    avatarUrl?: string;
}

export default function AdminPanel() {
    const [cards, setCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        facebook: '', // Inicializado no estado do formulário
        avatarUrl: '',
    });

    useEffect(() => {
        fetchCards();
    }, []);

    useEffect(() => {
        // Filtrar cards baseado no termo de busca
        const filtered = cards.filter(card =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (card.company && card.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.email && card.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.phone && card.phone.includes(searchTerm))
        );
        setFilteredCards(filtered);
    }, [searchTerm, cards]);

    const fetchCards = async () => {
        try {
            const res = await fetch('/api/cards');
            if (res.ok) {
                const data = await res.json();
                setCards(data);
            }
        } catch (err) {
            console.error("Erro ao buscar cartões:", err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setFormData({ ...formData, avatarUrl: compressedBase64 });
                }
                setUploading(false);
            };
        };

        reader.onerror = () => {
            alert("Erro ao ler arquivo.");
            setUploading(false);
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingCard ? `/api/cards/${editingCard.id}` : '/api/cards';
            const method = editingCard ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                resetForm();
                alert(editingCard ? 'Cartão atualizado com sucesso!' : 'Cartão cadastrado com sucesso!');
                fetchCards();
                setIsModalOpen(false);
                setEditingCard(null);
            } else {
                const errData = await res.json();
                alert(`Erro: ${errData.error || 'Não foi possível salvar.'}`);
            }
        } catch (err) {
            alert('Erro na conexão com o servidor.');
        }
    };

    const handleEdit = (card: Card) => {
        setEditingCard(card);
        setFormData({
            name: card.name,
            role: card.role,
            creci: card.creci || '',
            company: card.company || '',
            bio: card.bio || '',
            phone: card.phone,
            email: card.email,
            instagram: card.instagram || '',
            website: card.website || '',
            linkedin: card.linkedin || '',
            facebook: card.facebook || '', // Atribuído na edição
            avatarUrl: card.avatarUrl || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este cartão?')) return;

        try {
            const res = await fetch(`/api/cards/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Cartão deletado com sucesso!');
                fetchCards();
            } else {
                alert('Erro ao deletar cartão.');
            }
        } catch (err) {
            alert('Erro na conexão com o servidor.');
        }
    };

    const resetForm = () => {
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
            facebook: '', // Limpo no reset
            avatarUrl: '',
        });
        const fileInput = document.getElementById('avatar-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header com título e busca */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-amber-500">Gerenciar Cartões NFC</h1>

                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, cargo, empresa, email ou telefone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Formulário de Cadastro */}
                    <div className="lg:col-span-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
                        <h2 className="text-xl font-bold mb-4 text-amber-500">Cadastrar Novo Cartão</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Upload da foto */}
                            <div className="bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-700">
                                <div className="flex items-center gap-4">
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
                                    </div>
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
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">CRECI</label>
                                    <input type="text" value={formData.creci} onChange={e => setFormData({ ...formData, creci: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Empresa</label>
                                    <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">WhatsApp *</label>
                                    <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">E-mail *</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Bio</label>
                                <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            

                            {/* Grid Redes Sociais Atualizado para 4 Colunas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instagram</label>
                                    <input type="text" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Website</label>
                                    <input type="text" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LinkedIn</label>
                                    <input type="text" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Facebook</label>
                                    <input type="text" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" placeholder="URL do Facebook" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-3 rounded-xl transition-all"
                            >
                                {uploading ? 'Otimizando imagem...' : 'Salvar Cartão'}
                            </button>
                        </form>
                    </div>

                    {/* Listagem de Cartões com Edição */}
                    <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-xl font-bold mb-4 text-slate-300">
                            Cartões Ativos ({filteredCards.length})
                        </h2>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {filteredCards.map(card => {
                                const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${card.id}` : '';
                                return (
                                    <div key={card.id} className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                                                    {card.avatarUrl ? (
                                                        <img src={card.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                                                            {card.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-sm">{card.name}</h3>
                                                    <p className="text-xs text-slate-400">
                                                        {card.role} {card.company ? `• ${card.company}` : ''}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">{card.email} | {card.phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(card)}
                                                    className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white p-2 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(card.id)}
                                                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-lg transition-all"
                                                    title="Deletar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { navigator.clipboard.writeText(fullUrl); alert('Link copiado!'); }}
                                                    className="bg-slate-700 hover:bg-slate-600 text-xs font-semibold py-2 px-4 rounded-lg transition-all text-amber-400"
                                                >
                                                    Copiar Link
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredCards.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    Nenhum cartão encontrado
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-amber-500">Editar Cartão</h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCard(null);
                                    resetForm();
                                }}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Upload da foto dentro do modal */}
                                <div className="bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-700">
                                    <div className="flex items-center gap-4">
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
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer"
                                            />
                                        </div>
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
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">CRECI</label>
                                        <input type="text" value={formData.creci} onChange={e => setFormData({ ...formData, creci: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Empresa</label>
                                        <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">WhatsApp *</label>
                                        <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">E-mail *</label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Bio</label>
                                    <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500" />
                                </div>

                                {/* Grid Redes Sociais no Modal Atualizado para 4 Colunas */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instagram</label>
                                        <input type="text" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Website</label>
                                        <input type="text" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LinkedIn</label>
                                        <input type="text" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Facebook</label>
                                        <input type="text" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" placeholder="URL do Facebook" />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold py-3 rounded-xl transition-all"
                                    >
                                        {uploading ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingCard(null);
                                            resetForm();
                                        }}
                                        className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}