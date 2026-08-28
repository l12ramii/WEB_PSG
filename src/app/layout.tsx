import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSG Fútbol 7 | Sitio Web Oficial",
  description:
    "Web oficial del club de fútbol 7 PSG. Plantilla oficial, resultados en directo, calendario de partidos y estadísticas individuales de los jugadores.",
  keywords: [
    "PSG",
    "Fútbol 7",
    "F7",
    "Equipo de Fútbol",
    "Plantilla",
    "Resultados",
    "Liga",
    "Estadísticas",
  ],
  openGraph: {
    title: "PSG Fútbol 7 | Web Oficial",
    description:
      "Ave Fénix y Garra. Consulta la plantilla, resultados y actas oficiales.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050814",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="text-primary flex min-h-screen flex-col bg-background font-sans antialiased selection:bg-accent-cyan/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
