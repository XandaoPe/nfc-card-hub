import type { Metadata } from "next";
import "./globals.css"; // Certifique-se de que o globals.css existe nesta pasta ou ajuste o caminho

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
            <body>
                {children}
            </body>
        </html>
    );
}