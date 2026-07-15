import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-pixel"
});

export const metadata: Metadata = {
  title: "Snake AI",
  description: "Treinamento de IAs jogando Snake",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${pixelFont.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
      
    </html>
  );
}