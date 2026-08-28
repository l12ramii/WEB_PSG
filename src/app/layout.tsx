import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSG Fútbol 7 | Web Oficial",
  description:
    "Sitio web oficial del club de fútbol 7 PSG. Plantilla, calendario, resultados y estadísticas oficiales.",
  keywords: [
    "PSG",
    "Fútbol 7",
    "F7",
    "Equipo",
    "Plantilla",
    "Resultados",
    "Liga",
    "Estadísticas",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="text-foreground bg-background antialiased selection:bg-accent-cyan/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
