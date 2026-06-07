import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "NFC Card Hub - Mota Carvalho",
    description: "Gerenciador de Cartões de Visita NFC",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className="bg-slate-950 text-slate-100 antialiased">
                {children}
            </body>
        </html>
    );
}