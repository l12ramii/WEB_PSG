# ⚽ Web Oficial PSG - Equipo de Fútbol 7

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Plataforma web oficial para el equipo de barrio **PSG (Fútbol 7)**. Diseñada bajo un estilo *Dark Theme Deportivo*, la web sirve como escaparate para los aficionados y jugadores, mostrando información del equipo, estadísticas individuales, y el calendario de partidos.

Además, cuenta con un **Panel de Administración privado y simplificado** para que el Community Manager (CM) del equipo pueda gestionar fácilmente todo el contenido sin necesidad de conocimientos técnicos.

## ✨ Características Principales

### 🏟️ Portal Público
- **Página de Inicio:** Visión rápida del estado del equipo, cuenta atrás para el próximo partido y resultados recientes.
- **Plantilla:** Fichas de jugadores organizadas por posición (Porteros, Defensas, Medios, Delanteros).
- **Estadísticas Avanzadas:** Seguimiento en tiempo real de partidos jugados, goles, asistencias, tarjetas y *porterías a cero* (para porteros).
- **Calendario:** Histórico de resultados y próximos enfrentamientos con información de fecha, hora y competición.
- **Diseño Responsive:** Perfectamente adaptable a móviles, tablets y escritorio.

### ⚙️ Panel de Administración (Backoffice)
- **Login Seguro:** Acceso restringido para el CM mediante Supabase Auth.
- **Actas de Partido Digitales:** Interfaz intuitiva para registrar el resultado, jugadores convocados, goleadores, asistentes y tarjetas al finalizar cada encuentro. Las estadísticas generales se actualizan automáticamente.
- **Directorio de Rivales:** Base de datos de equipos contrarios con sus escudos para reutilizarlos en cada jornada.
- **Gestión de Plantilla:** Altas, bajas y edición de la información y fotos de los jugadores.

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js](https://nextjs.org/) (App Router) + TypeScript.
- **Estilos & UI:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) y [Lucide Icons](https://lucide.dev/).
- **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Autenticación:** Supabase Auth.
- **Almacenamiento (Archivos):** Supabase Storage (Fotos y escudos).
- **Hosting:** [Vercel](https://vercel.com/).

## 🚀 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js (v18 o superior)
- Una cuenta en Supabase
- pnpm, npm o yarn

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/psg-f7-web.git
   cd psg-f7-web
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y añade tus credenciales de Supabase:
   ```bash
   cp .env.example .env.local
   ```
   *(Necesitarás `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`)*

4. **Configurar la Base de Datos:**
   Ejecuta el script SQL incluido en `SPECS.md` en el editor SQL de tu proyecto de Supabase para crear las tablas, enums y vistas necesarias.

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) para ver la web pública, y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel de administración.

## 📄 Estructura del Proyecto

```text
src/
├── app/
│   ├── (public)/      # Rutas de la web pública (Home, Plantilla, Partidos)
│   ├── admin/         # Rutas protegidas del Backoffice (Login, Actas, Jugadores)
├── components/        # Componentes React reutilizables (UI, Admin, Public)
├── lib/               # Utilidades, configuración de Supabase y Types
```

## 📜 Licencia

Este proyecto es de uso privativo para el equipo PSG F7. Todos los derechos reservados.
