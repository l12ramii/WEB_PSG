# 📋 ESPECIFICACIÓN TÉCNICA (SPECS.md)
## Proyecto: Web Oficial PSG - Equipo de Fútbol 7

---

## 1. Visión General del Proyecto

### 1.1. Propósito
Desarrollo de una plataforma web moderna, rápida e intuitiva para el equipo de barrio **PSG** (Fútbol 7). La plataforma servirá como escaparate público oficial del club (mostrando la plantilla, estadísticas individuales, resultados y calendario) y contará con un panel de administración ultra-simplificado para que el Community Manager (CM), sin conocimientos técnicos, pueda gestionar rivales, partidos, actas y estadísticas de los jugadores.

### 1.2. Identidad Visual y Estilo
- **Nombre del Club:** PSG (Fútbol 7).
- **Colores Principales:**
  - **Azul Oscuro / Marino Profundo:** `#0A1128` / `#001F54` (Fondo y estructura principal).
  - **Blanco Puro:** `#FFFFFF` (Tipografía principal, detalles, contrastes).
  - **Acentos:** Tonos azul eléctrico / cian sutiles para interacciones y estados activos.
- **Elementos Representativos:**
  - Ave Fénix blanca (emblema de resurgimiento y fuerza).
  - Zarpazo de tigre (marca de garra integrada en detalles gráficos / fondos).
- **Tema Visual:** **Dark Theme Deportivo** de alto contraste, moderno, con estética competitiva y tipografía nítida y deportiva.

---

## 2. Alcance Funcional

### 2.1. Portal Público (Visitantes / Aficionados)
1. **Página de Inicio (Home):**
   - Hero banner con identidad del club (escudo, fénix, lema, colores).
   - Widget de **Próximo Partido** (cuenta atrás, rival, fecha, hora, competición).
   - Widget de **Último Resultado** (marcador final contra el último rival).
   - Destacados rápidos (máximo goleador, máximo asistente, racha).
2. **Plantilla de Jugadores (Fútbol 7):**
   - Agrupación por 4 posiciones:
     - **Porteros** (Estadísticas: Partidos, Porterías a Cero, Goles encajados, Tarjetas).
     - **Defensas** (Estadísticas: Partidos, Goles, Asistencias, Tarjetas Amarillas/Rojas).
     - **Centrocampistas / Medios** (Estadísticas: Partidos, Goles, Asistencias, Tarjetas).
     - **Delanteros** (Estadísticas: Partidos, Goles, Asistencias, Tarjetas).
   - Ficha individual de jugador (modal o vista dedicada):
     - Foto oficial, dorsal, apodo/nombre, posición.
     - Desglose estadístico acumulado de la temporada.
3. **Calendario y Resultados:**
   - Listado de partidos divididos en **Finalizados (Resultados)** y **Próximos**.
   - Tarjetas de partido con:
     - Escudo y nombre del rival.
     - Condición de Local / Visitante.
     - Fecha y hora del encuentro.
     - Competición (Liga, Copa, Amistoso).
     - Marcador final (en partidos terminados).

---

### 2.2. Panel de Administración (Backoffice para el CM)
> **Principio de Diseño:** Interfaz ultra-intuitiva, con botones grandes, textos claros y sin tecnicismos. Diseñado específicamente para un usuario sin experiencia informática.

1. **Autenticación Segura:**
   - Acceso privado vía email y contraseña para el CM.
   - Sesión persistente y protegida.
2. **Gestión de Rivales (Directorio Reutilizable):**
   - Base de datos de equipos rivales.
   - Creación rápida de nuevo rival (Nombre + Subida de Escudo).
   - Los rivales quedan guardados para seleccionarse automáticamente en futuros partidos sin volver a subirlos.
3. **Gestión de Partidos y Actas de Partido:**
   - **Crear/Programar Partido:** Selección de rival (desplegable con buscador), condición (Local/Visitante), fecha/hora y competición.
   - **Rellenar/Editar Acta de Partido:**
     - Introducir marcador final (Goles PSG vs Goles Rival).
     - Selección de jugadores que participaron en el partido.
     - Asignación rápida de eventos por jugador:
       - Goles marcados.
       - Asistencias.
       - Tarjetas amarillas y rojas.
       - Para porteros: Cálculo/Marcado de portería a cero si no se encajaron goles.
     - **Edición a posteriori:** El CM puede modificar cualquier acta en cualquier momento si hubo una corrección.
4. **Gestión de Jugadores:**
   - Alta/Edición de jugador: Nombre, Apodo, Dorsal, Posición (Portero, Defensa, Medio, Delantero) y subida de foto.
   - Activar / Desactivar jugador (en caso de baja temporal).

---

## 3. Arquitectura Técnica y Stack Tecnológico

```
┌──────────────────────────────────────────────────────────┐
│                   VERCEL (Hosting & Edge)                │
│  ┌────────────────────────────────────────────────────┐  │
│  │             Next.js (App Router + TS)              │  │
│  │  - Web Pública (SSR / ISR para carga ultrarrápida) │  │
│  │  - Panel Admin (React Server Components / Actions) │  │
│  │  - Tailwind CSS + Lucide Icons + Shadcn UI         │  │
│  └────────────────────────┬───────────────────────────┘  │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTPS / API Client
┌───────────────────────────▼──────────────────────────────┐
│                    SUPABASE (Backend BaaS)               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│  │   PostgreSQL    │ │  Supabase Auth  │ │   Storage   │ │
│  │ (Datos & Vistas)│ │  (Login del CM) │ │ (Imágenes)  │ │
│  └─────────────────┘ └─────────────────┘ └─────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 3.1. Frontend & Framework
- **Framework:** Next.js (App Router) con TypeScript.
- **Estilos:** Tailwind CSS con configuración de paleta personalizada (Azul Marino PSG, Blanco, acentos).
- **Componentes UI:** Shadcn UI / Radix Primitives para componentes accesibles, minimalistas y robustos.
- **Iconografía:** Lucide React.
- **Manejo de Formularios & Validación:** React Hook Form + Zod (validaciones amigables en español).

### 3.2. Backend, Base de Datos y Almacenamiento (Supabase)
- **Base de Datos:** PostgreSQL en Supabase.
- **Autenticación:** Supabase Auth (Email / Password) con Row Level Security (RLS).
- **Storage:** Supabase Storage (Buckets públicos con subida autenticada para fotos de jugadores y escudos de rivales).
- **Optimización de Estadísticas:**
  - Vistas PostgreSQL (`player_season_stats`) para agregar automáticamente partidos, goles, asistencias, tarjetas y porterías a cero en tiempo real sin descuadres.

### 3.3. Infraestructura y Despliegue
- **Hosting Web:** Vercel (Capa Gratuita / Hobby).
- **Base de Datos & Storage:** Supabase (Capa Gratuita).
- **Dominio:** Preparado para vincular dominio personalizado propio en fases posteriores.

---

## 4. Modelo de Datos (Esquema Relacional PostgreSQL)

### 4.1. Tablas Principales

```sql
-- 1. Enum de Posiciones de Fútbol 7
CREATE TYPE player_position AS ENUM ('portero', 'defensa', 'medio', 'delantero');

-- 2. Enum de Competiciones
CREATE TYPE competition_type AS ENUM ('liga', 'copa', 'amistoso');

-- 3. Tabla de Jugadores
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT,
    nickname TEXT NOT NULL,
    dorsal INTEGER NOT NULL,
    position player_position NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Rivales (Directorio reutilizable)
CREATE TABLE rivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    shield_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de Partidos
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rival_id UUID NOT NULL REFERENCES rivals(id) ON DELETE RESTRICT,
    is_home BOOLEAN NOT NULL DEFAULT true, -- true: Local, false: Visitante
    match_date TIMESTAMPTZ NOT NULL,
    competition competition_type NOT NULL DEFAULT 'liga',
    psg_score INTEGER DEFAULT NULL,
    rival_score INTEGER DEFAULT NULL,
    is_finished BOOLEAN GENERATED ALWAYS AS (psg_score IS NOT NULL AND rival_score IS NOT NULL) STORED,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabla de Actas / Estadísticas por Jugador por Partido
CREATE TABLE match_player_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    played BOOLEAN DEFAULT true,
    goals INTEGER DEFAULT 0 CHECK (goals >= 0),
    assists INTEGER DEFAULT 0 CHECK (assists >= 0),
    yellow_cards INTEGER DEFAULT 0 CHECK (yellow_cards >= 0 AND yellow_cards <= 2),
    red_cards INTEGER DEFAULT 0 CHECK (red_cards >= 0 AND red_cards <= 1),
    clean_sheet BOOLEAN DEFAULT false, -- Solo relevante si es portero y rival_score = 0
    UNIQUE(match_id, player_id)
);
```

### 4.2. Vista de Estadísticas Acumuladas (Calculada Automáticamente)

```sql
CREATE OR REPLACE VIEW player_stats_summary AS
SELECT 
    p.id AS player_id,
    p.nickname,
    p.dorsal,
    p.position,
    p.photo_url,
    p.is_active,
    COUNT(mps.id) FILTER (WHERE mps.played = true) AS matches_played,
    COALESCE(SUM(mps.goals), 0) AS total_goals,
    COALESCE(SUM(mps.assists), 0) AS total_assists,
    COALESCE(SUM(mps.yellow_cards), 0) AS total_yellow_cards,
    COALESCE(SUM(mps.red_cards), 0) AS total_red_cards,
    COUNT(mps.id) FILTER (WHERE mps.clean_sheet = true AND p.position = 'portero') AS total_clean_sheets
FROM players p
LEFT JOIN match_player_stats mps ON p.id = mps.player_id
LEFT JOIN matches m ON mps.match_id = m.id AND m.psg_score IS NOT NULL
GROUP BY p.id;
```

---

## 5. Estructura de Rutas y Páginas

```
src/
├── app/
│   ├── (public)/                 # Layout y páginas públicas
│   │   ├── page.tsx              # Home (Hero, próximo partido, último resultado, destacados)
│   │   ├── plantilla/
│   │   │   ├── page.tsx          # Plantilla F7 (agrupada por Porteros, Defensas, Medios, Delanteros)
│   │   │   └── [id]/page.tsx     # Ficha detallada del jugador
│   │   └── partidos/
│   │       └── page.tsx          # Calendario y Resultados con filtros
│   │
│   ├── admin/                    # Panel de administración protegido
│   │   ├── login/page.tsx        # Login para el CM
│   │   ├── layout.tsx            # Shell de navegación admin
│   │   ├── page.tsx              # Dashboard resumen (accesos directos)
│   │   ├── partidos/
│   │   │   ├── page.tsx          # Lista de partidos con botón "Rellenar Acta"
│   │   │   ├── nuevo/page.tsx    # Programar nuevo partido
│   │   │   └── [id]/acta/page.tsx# Acta de partido interactiva y modificable
│   │   ├── jugadores/
│   │   │   ├── page.tsx          # Lista de jugadores
│   │   │   └── nuevo/page.tsx    # Alta / Edición de jugador
│   │   └── rivales/
│   │       └── page.tsx          # Directorio de rivales y escudos
│   │
│   └── api/                      # Handlers de subida de imágenes y webhooks
├── components/
│   ├── public/                   # Navbar, Footer, PlayerCard, MatchCard, StatsTable
│   ├── admin/                    # MatchSheetForm, PlayerForm, RivalSelectModal, ImageUploader
│   └── ui/                       # Botones, Modales, Inputs, Badges (Shadcn/Tailwind)
├── lib/
│   ├── supabase/                 # Cliente Supabase (Browser, Server y Middleware de Auth)
│   └── utils.ts                  # Formateo de fechas, posiciones, etc.
```

---

## 6. Seguridad y Políticas de Acceso (RLS)

- **Lectura Pública (`anon`):**
  - Cualquier visitante puede leer `players`, `rivals`, `matches` y la vista `player_stats_summary`.
  - Acceso de lectura pública a los buckets de almacenamiento de imágenes.
- **Escritura Protegida (`authenticated`):**
  - Solo el usuario autenticado (el CM) tiene permisos de inserción, actualización y eliminación (`INSERT`, `UPDATE`, `DELETE`) en todas las tablas y buckets de Supabase.

---

## 7. Plan de Implementación por Fases

| Fase | Título | Entregables Clave |
| :--- | :--- | :--- |
| **Fase 1** | **Setup e Infraestructura** | Configuración de Next.js, Tailwind, Supabase (tablas, RLS, Storage) y Vercel. |
| **Fase 2** | **Panel del CM & Backoffice** | Autenticación del CM, CRUD de rivales con escudos, CRUD de jugadores y formulario de actas de partido. |
| **Fase 3** | **UI/UX y Maquetación por Capas** | 1. Configuración tokens/Tailwind según DESIGN_SYSTEM. 2. Componentes atómicos base (Buttons, Inputs, Cards). 3. Montaje de layouts y vistas (Portal Público completo). |
| **Fase 4** | **Testing, Responsive & Despliegue** | Pruebas de usabilidad en móvil para el CM, optimización de imágenes y despliegue final en producción en Vercel. |
