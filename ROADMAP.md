# 🗺️ Hoja de Ruta (ROADMAP) - Web PSG

Este documento detalla las tareas paso a paso para completar el desarrollo de la web del equipo PSG, basándose en las especificaciones técnicas (`SPECS.md`).

## Fase 1: Setup e Infraestructura
- [ ] **Inicialización del Proyecto Frontend**
  - [ ] Crear el proyecto base con Next.js (App Router, TypeScript).
  - [ ] Configurar Tailwind CSS y paleta de colores del club (Azul oscuro, Blanco).
  - [ ] Instalar e inicializar Shadcn UI y Lucide Icons.
- [ ] **Configuración del Backend (Supabase)**
  - [ ] Crear el proyecto en Supabase.
  - [ ] Ejecutar el script SQL del esquema (Enums, Tablas: `players`, `rivals`, `matches`, `match_player_stats`).
  - [ ] Crear la Vista SQL `player_stats_summary` para cálculo automático de estadísticas.
  - [ ] Configurar los Buckets de Storage (`player-photos` y `rival-crests`).
  - [ ] Configurar las políticas de seguridad (RLS) para lectura pública y escritura solo para administradores.
- [ ] **Integración**
  - [ ] Configurar variables de entorno (`.env.local`) con las claves de Supabase.
  - [ ] Crear los clientes de Supabase (browser y server) en Next.js.

## Fase 2: Panel de Administración (Backoffice)
- [ ] **Autenticación**
  - [ ] Crear la página de Login (`/admin/login`).
  - [ ] Configurar middleware para proteger las rutas `/admin/*`.
- [ ] **Layout y Dashboard Admin**
  - [ ] Crear el layout del panel con barra de navegación lateral/superior.
  - [ ] Crear la página principal del dashboard con accesos rápidos.
- [ ] **Módulo de Jugadores**
  - [ ] Vista de listado de jugadores (`/admin/jugadores`).
  - [ ] Formulario de creación/edición de jugador.
  - [ ] Implementar la subida de fotos del jugador al bucket de Supabase.
- [ ] **Módulo de Rivales**
  - [ ] Vista de directorio de rivales (`/admin/rivales`).
  - [ ] Formulario para añadir rivales y subir su escudo.
- [ ] **Módulo de Partidos y Actas**
  - [ ] Vista de listado de partidos (programados y jugados).
  - [ ] Formulario para programar un nuevo partido (fecha, hora, local/visitante, competición, rival).
  - [ ] **Formulario de Acta de Partido (`/admin/partidos/[id]/acta`):**
    - [ ] Interfaz para introducir marcador final.
    - [ ] Interfaz para marcar jugadores convocados.
    - [ ] Asignación de goles, asistencias y tarjetas por jugador.
    - [ ] Lógica para guardar porterías a cero en porteros.

## Fase 3: Portal Público (UI/UX)
- [ ] **Diseño Base**
  - [ ] Crear el Layout público (Navbar transparente/Dark, Footer con info del club).
  - [ ] Implementar la tipografía y estilos del Dark Theme Deportivo.
- [ ] **Página de Inicio (Home)**
  - [ ] Hero Banner con el escudo, nombre y lema del club.
  - [ ] Widget dinámico: Próximo partido (cuenta atrás).
  - [ ] Widget dinámico: Último resultado.
- [ ] **Página de Plantilla**
  - [ ] Obtener datos de la vista `player_stats_summary`.
  - [ ] Agrupar y renderizar jugadores por posición (Porteros, Defensas, Medios, Delanteros).
  - [ ] Crear la tarjeta individual de jugador (PlayerCard).
- [ ] **Página de Calendario y Resultados**
  - [ ] Obtener listado de partidos.
  - [ ] Diseñar las tarjetas de partidos (MatchCard) diferenciando los próximos de los ya finalizados (mostrando marcador).

## Fase 4: Testing, Refinamiento y Despliegue
- [ ] **Testing y Ajustes UX**
  - [ ] Verificar que la creación del acta actualice correctamente las estadísticas de la plantilla.
  - [ ] Revisión de usabilidad (Responsive) en dispositivos móviles, especialmente para el panel del CM.
- [ ] **Despliegue**
  - [ ] Subir el repositorio a GitHub.
  - [ ] Conectar el repositorio con Vercel para despliegue automático.
  - [ ] Configurar variables de entorno de producción en Vercel.
- [ ] **Dominio (Futuro)**
  - [ ] Adquirir dominio personalizado y configurar DNS en Vercel.
