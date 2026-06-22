// src/components/QRCodeDisplay.tsx
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy } from 'lucide-react';
import { useState } from 'react';

interface QRCodeDisplayProps {
    url: string;
    size?: number;
    showDownload?: boolean;
}

export default function QRCodeDisplay({
    url,
    size = 200,
    showDownload = true
}: QRCodeDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode-cartao.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar link:', err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-xl">
            {/* Título */}
            <div className="text-center">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    📱 QR Code do Cartão
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Escaneie com a câmera do celular
                </p>
            </div>

            {/* QR Code */}
            <div className="relative p-3 bg-white rounded-xl border-2 border-gray-200">
                <QRCodeSVG
                    id="qr-code-svg"
                    value={url}
                    size={size}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#1a1a1a"
                />
                {/* Canvas oculto para download */}
                <canvas
                    id="qr-code-canvas"
                    style={{ display: 'none' }}
                    width={size}
                    height={size}
                />
            </div>

            {/* URL do cartão */}
            <div className="w-full bg-gray-50 rounded-lg p-2 border border-gray-200">
                <p className="text-xs text-gray-600 truncate text-center font-mono">
                    {url}
                </p>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 w-full">
                {showDownload && (
                    <button
                        onClick={handleDownloadQR}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Download size={16} />
                        Baixar QR Code
                    </button>
                )}

                <button
                    onClick={handleCopyLink}
                    className={`flex-1 border-2 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${copied
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-500'
                        }`}
                >
                    <Copy size={16} />
                    {copied ? 'Copiado!' : 'Copiar Link'}
                </button>
            </div>
        </div>
    );
}