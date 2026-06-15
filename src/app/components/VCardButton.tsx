'use client';

interface VCardButtonProps {
    card: {
        name: string;
        role: string;
        phone: string;
        email: string;
        company?: string | null;
        bio?: string | null;
        instagram?: string | null;
        facebook?: string | null; // <--- ADICIONADO AQUI
        linkedin?: string | null;
        website?: string | null;
    };
}

export default function VCardButton({ card }: VCardButtonProps) {
    const generateVCard = () => {
        const vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${card.name}`,
            `TITLE:${card.role}`,
            `ORG:${card.company || ''}`,
            `TEL;TYPE=WORK,CELL:${card.phone}`,
            `EMAIL:${card.email}`,
            card.instagram ? `URL;TYPE=Instagram:https://instagram.com/${card.instagram.replace('@', '')}` : '',
            card.facebook ? `URL;TYPE=Facebook:${card.facebook.startsWith('http') ? card.facebook : `https://facebook.com/${card.facebook}`}` : '', // <--- ADICIONADO AQUI
            card.linkedin ? `URL;TYPE=LinkedIn:${card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}` : '',
            card.website ? `URL;TYPE=Website:${card.website.startsWith('http') ? card.website : `https://${card.website}`}` : '',
            card.bio ? `NOTE:${card.bio}` : '',
            'END:VCARD'
        ].filter(line => line).join('\n');

        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${card.name.replace(/\s/g, '_')}_contato.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={generateVCard}
            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all duration-200 border border-slate-700"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Salvar Contato (VCard)
        </button>
    );
}