# 🗺️ Hoja de Ruta (ROADMAP) - Web PSG

Este documento detalla las tareas paso a paso para completar el desarrollo de la web del equipo PSG, basándose en las especificaciones técnicas (`SPECS.md`).

## Fase 1: Setup e Infraestructura
- [x] **Inicialización del Proyecto Frontend**
  - [x] Crear el proyecto base con Next.js (App Router, TypeScript).
  - [x] Configurar Tailwind CSS y paleta de colores del club (Azul oscuro, Blanco).
  - [x] Instalar e inicializar Shadcn UI y Lucide Icons.
- [x] **Configuración del Backend (Supabase)**
  - [x] Crear el proyecto en Supabase.
  - [x] Ejecutar el script SQL del esquema (Enums, Tablas: `players`, `rivals`, `matches`, `match_player_stats`).
  - [x] Crear la Vista SQL `player_stats_summary` para cálculo automático de estadísticas.
  - [x] Configurar los Buckets de Storage (`player-photos` y `rival-crests`).
  - [x] Configurar las políticas de seguridad (RLS) para lectura pública y escritura solo para administradores.
- [x] **Integración**
  - [x] Configurar variables de entorno (`.env.local`) con las claves de Supabase.
  - [x] Crear los clientes de Supabase (browser y server) en Next.js.

## Fase 2: Panel de Administración (Backoffice)
- [x] **Autenticación**
  - [x] Crear la página de Login (`/admin/login`).
  - [x] Configurar middleware para proteger las rutas `/admin/*`.
- [x] **Layout y Dashboard Admin**
  - [x] Crear el layout del panel con barra de navegación lateral/superior.
  - [x] Crear la página principal del dashboard con accesos rápidos.
- [x] **Módulo de Jugadores**
  - [x] Vista de listado de jugadores (`/admin/jugadores`).
  - [x] Formulario de creación/edición de jugador.
  - [x] Implementar la subida de fotos del jugador al bucket de Supabase.
- [x] **Módulo de Rivales**
  - [x] Vista de directorio de rivales (`/admin/rivales`).
  - [x] Formulario para añadir rivales y subir su escudo.
- [x] **Módulo de Partidos y Actas**
  - [x] Vista de listado de partidos (programados y jugados).
  - [x] Formulario para programar un nuevo partido (fecha, hora, local/visitante, competición, rival).
  - [x] **Formulario de Acta de Partido (`/admin/partidos/[id]/acta`):**
    - [x] Interfaz para introducir marcador final.
    - [x] Interfaz para marcar jugadores convocados.
    - [x] Asignación de goles, asistencias y tarjetas por jugador.
    - [x] Lógica para guardar porterías a cero en porteros.

## Fase 3: Portal Público (UI/UX)
- [x] **Diseño Base**
  - [x] Crear el Layout público (Navbar transparente/Dark, Footer con info del club).
  - [x] Implementar la tipografía y estilos del Dark Theme Deportivo.
- [x] **Página de Inicio (Home)**
  - [x] Hero Banner con el escudo, nombre y lema del club.
  - [x] Widget dinámico: Próximo partido (cuenta atrás).
  - [x] Widget dinámico: Último resultado.
- [x] **Página de Plantilla**
  - [x] Obtener datos de la vista `player_stats_summary`.
  - [x] Agrupar y renderizar jugadores por posición (Porteros, Defensas, Medios, Delanteros).
  - [x] Crear la tarjeta individual de jugador (PlayerCard).
- [x] **Página de Calendario y Resultados**
  - [x] Obtener listado de partidos.
  - [x] Diseñar las tarjetas de partidos (MatchCard) diferenciando los próximos de los ya finalizados (mostrando marcador).

## Fase 4: Testing, Refinamiento y Despliegue
- [x] **Testing y Ajustes UX**
  - [x] Verificar que la creación del acta actualice correctamente las estadísticas de la plantilla.
  - [x] Revisión de usabilidad (Responsive) en dispositivos móviles, especialmente para el panel del CM.
- [x] **Despliegue**
  - [x] Subir el repositorio a GitHub.
  - [ ] Conectar el repositorio con Vercel para despliegue automático.
  - [ ] Configurar variables de entorno de producción en Vercel.
- [ ] **Dominio (Futuro)**
  - [ ] Adquirir dominio personalizado y configurar DNS en Vercel.
