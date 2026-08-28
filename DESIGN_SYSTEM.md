# 🎨 Sistema de Diseño Normativo - PSG F7 (Dark Theme Deportivo)

Este documento establece las normativas estrictas de UI/UX para el portal web y panel de administración del equipo PSG (Fútbol 7). El objetivo es mantener una interfaz coherente, deportiva, moderna y altamente accesible, optimizada para Next.js + Tailwind CSS + Shadcn UI.

---

## 1. Tokens y Paleta de Color

Se rechaza el uso de degradados morados/azules genéricos ("Vercel default"). En su lugar, utilizamos fondos neutros reales, fríos y profundos, garantizando un contraste WCAG AA/AAA para la legibilidad.

### 1.1. Fondos y Superficies (Dark Neutrals)
*En Dark Mode, la profundidad no se logra con sombras, sino con la luminosidad del fondo. Cuanto más cerca del usuario, más claro es el fondo.*

- **`background`** (`#050814`): Fondo base de la aplicación (Main body). Negro azulado muy profundo. Absorbe la luz y hace resaltar las tarjetas.
- **`surface`** (`#0A1128`): Fondo para Tarjetas (Cards), contenedores principales y modales.
- **`surface-elevated`** (`#111A3A`): Fondo para elementos flotantes (Dropdowns, Tooltips, Popovers) o estados `hover` de filas.

### 1.2. Tipografía (Contraste WCAG)
- **`text-primary`** (`#FFFFFF`): Títulos, cifras destacadas (goles, resultados) y texto principal. Contraste máximo.
- **`text-secondary`** (`#94A3B8` - *Slate 400*): Subtítulos, etiquetas, y descripciones. Cumple WCAG sobre `background` y `surface`.
- **`text-muted`** (`#475569` - *Slate 600*): Placeholders, texto deshabilitado, bordes muy sutiles.

### 1.3. Acentos Semánticos y Branding
- **`brand-primary`** (`#001F54`): Azul Marino institucional (uso en escudos o banners grandes).
- **`accent-cyan`** (`#00E5FF`): Cian eléctrico. **Color de acción principal**. Se usa para CTAs, indicadores de estado activo y delineado de focus.
- **`accent-blue`** (`#3B82F6` - *Blue 500*): Apoyo para gradientes muy sutiles de fondo (ej. detrás del Ave Fénix).

### 1.4. Estados (Feedback)
- **`success`** (`#10B981`): Victorias, porterías a cero, notificaciones de éxito.
- **`warning`** (`#F59E0B`): Tarjetas amarillas, alertas del sistema.
- **`danger`** (`#EF4444`): Derrotas, tarjetas rojas, acciones destructivas (Eliminar jugador).

---

## 2. Tipografía y Espaciado

Implementamos una jerarquía de doble fuente para dar un aspecto "Deportivo/Competitivo" en los títulos y una legibilidad impecable en los datos.

### 2.1. Familias Tipográficas
- **Display / Titulares:** `Oswald` (o alternativamente `Tungsten` / `Teko`). Sans-serif condensada, mayúsculas pesadas. Da sensación de fuerza y dinamismo.
- **UI / Datos:** `Inter`. Tipografía geométrica y neutra. Perfecta para tablas de estadísticas, nombres largos y menús.

### 2.2. Escala Tipográfica (Rem-based)
- **`text-xs`** (12px / 16px LH): Metadatos, fechas de partidos, etiquetas pequeñas.
- **`text-sm`** (14px / 20px LH): Texto secundario, descripciones de tarjetas.
- **`text-base`** (16px / 24px LH): Cuerpo de texto estándar, inputs de formularios.
- **`text-lg`** (18px / 28px LH): Nombres de jugadores en tarjetas, resultados menores.
- **`text-2xl`** (24px / 32px LH): Subtítulos de sección (ej. "Defensas", "Próximos Partidos").
- **`text-4xl`** (36px / 40px LH): Títulos de página.
- **`text-6xl`** (60px / 1 LH): Marcadores de partidos (`3 - 1`), Hero Text.

### 2.3. Sistema de Espaciado (Regla Estricta de 4px/8px)
Todo margen (`m`, `mt`, `mb`) y padding (`p`, `px`, `py`) debe ser múltiplo de 4 u 8. **No se permiten valores arbitrarios.**

- **`4px` (p-1 / gap-1):** Separación micro (ej. entre un icono de tarjeta amarilla y el número).
- **`8px` (p-2 / gap-2):** Espaciado interno de botones o chips.
- **`16px` (p-4 / gap-4):** Padding estándar de Tarjetas y separación entre filas de una tabla.
- **`24px` (p-6 / gap-6):** Separación entre una sección y su titular.
- **`32px` (p-8 / mb-8):** Separación entre bloques principales (ej. Entre "Último Resultado" y "Plantilla").
- **`64px` (py-16):** Padding vertical general de las vistas de página (separación con header/footer).

---

## 3. Componentes Clave y Microinteracciones

En interfaces oscuras, los detalles marcan la diferencia. No usamos grandes sombras difusas; usamos **bordes precisos y luces internas**.

### 3.1. Tratamiento de Profundidad (Bordes y Sombras)
- **Tarjetas Base:** 
  - Fondo: `bg-surface`.
  - Borde: `border border-white/10` (Reemplaza a la sombra externa).
  - Radio: `rounded-xl` (Suavidad moderna).
- **Efecto Glass/Glow (Hero o Destacados):**
  - Glow sutil: `box-shadow: 0 0 40px -10px rgba(0, 229, 255, 0.1)`.
  - Inner light: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`.

### 3.2. Estados Interactivos (Mouse / Touch)

#### Botones y Tarjetas Clickables (Hover)
- **Transformación:** Traslación sutil hacia arriba `hover:-translate-y-1`.
- **Transición:** Rápida para entrada, suave para salida (`transition-all duration-200 ease-out`).
- **Glow:** El borde cambia de `border-white/10` a `border-accent-cyan/50`.

#### Accesibilidad (Focus Visible)
- Todo elemento interactivo debe tener un estado de foco claro para navegación por teclado (vital en el panel de administración).
- **Clase Tailwind:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background`.

#### Estados de Carga (Loading)
- **Pantallas enteras / Tablas:** Uso de *Skeleton Loaders*. Cajas grises con animación estandarizada: `animate-pulse bg-surface-elevated rounded-md`.
- **Botones (ej. Guardar Acta):** El texto "Guardar" se desvanece, reemplazado por un icono de `Lucide` (ej. `Loader2`) con la clase `animate-spin`. El botón recibe `opacity-70` y `cursor-not-allowed`.

#### Estados Vacíos (Empty States)
Cuando no hay datos (ej. "No hay próximos partidos" o "Aún no has registrado rivales"):
- Contenedor centrado (`flex flex-col items-center justify-center py-12`).
- Icono grande (48px) de Lucide en color `text-muted` (ej. `CalendarX`, `ShieldOff`).
- Título en `text-lg text-primary` y subtítulo en `text-sm text-secondary`.
- En el admin: Siempre incluir un botón CTA primario (`+ Añadir Rival`) debajo del texto.

### 3.3. Elementos Gráficos Identitarios (Motivos F7)
- **El Zarpazo de Tigre:** En componentes grandes (Hero o tarjetas de jugador detalladas), se incluirá un SVG estilizado de un zarpazo o marca de garra posicionado de forma absoluta (`absolute -right-4 -top-4 opacity-5`).
- **Renderizado de Jugadores:** Las fotos oficiales en las tarjetas deben estar recortadas en un contenedor con `aspect-[3/4]`, fondo en gradiente radial desde `surface-elevated` hasta transparente, y con efecto `grayscale` que pasa a todo color (`grayscale-0`) al hacer hover.

