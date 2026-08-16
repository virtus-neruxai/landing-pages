# AGENTS.md — Virtus Landing

## 1. Propósito y alcance

Este directorio contiene la landing pública y estática de Virtus. Es un proyecto independiente de la aplicación principal y no necesita backend para funcionar.

- Framework: Astro 7 con salida estática.
- Interactividad puntual: React 19 mediante islands.
- Lenguaje visible: español.
- Gestor de paquetes: pnpm 9.
- Node.js: 22.12 o superior.
- Rutas actuales: `/`, `/estudiante` y `/rendimiento`.
- Fuera de alcance: backend, autenticación, pagos, infraestructura y despliegue.

Para cambios limitados a esta landing no es necesario leer el código de otros servicios del monorepo.

## 2. Comandos esenciales

Ejecutar desde `landing-pages/`:

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
```

Antes de entregar cualquier cambio de código, ejecutar como mínimo:

```bash
pnpm check
pnpm build
```

No existe actualmente una suite de tests automatizados propia. Los cambios visuales o interactivos requieren además una comprobación manual en navegador.

## 3. Arquitectura rápida

| Ruta | Composición | Identidad |
|---|---|---|
| `/` | `src/pages/index.astro` + componentes globales en `src/components/` | NeruxAI como marca principal, Virtus como producto |
| `/estudiante` | `src/pages/estudiante.astro` + compartidos de `zones/` + `zones/student/` | Virtus principal; oro/pizarra y Bitter |
| `/rendimiento` | `src/pages/rendimiento.astro` + compartidos de `zones/` + `zones/performance/` | Virtus principal; naranja/óxido y Montserrat |

Astro es la opción por defecto. Usar React solo cuando se necesite estado o interacción en cliente. Las islands existentes son:

- `HeroDemo.tsx`, hidratada con `client:visible`.
- `SituationSelector.tsx`, hidratada con `client:load` para resolver la campaña inmediatamente.
- `ZoneDemo.tsx`, hidratada con `client:visible` para no cargar JavaScript antes de necesitarlo.

No introducir un store global ni llamadas de red para resolver cambios que encajen en estos componentes.

## 4. Mapa de ownership

- `src/layouts/BaseLayout.astro`
  - Importa fuentes y estilos globales.
  - Define SEO básico.
  - Captura/persiste campaña.
  - Decora enlaces hacia la app.
  - Emite eventos genéricos de clic y visibilidad de secciones.
- `src/components/Header.astro`
  - Contrato estable: `variant: 'global' | 'zone'` y `activeZone?: 'student' | 'performance'`.
  - La variante global y la jerarquía de marca de las zonas son deliberadamente distintas.
- `src/components/Hero.astro`, `CenterFormula.astro` y `MissionDemoSection.astro`
  - El hero global presenta la secuencia práctica de «Mi centro», inspirada en Euler y siempre rotulada como metáfora creativa.
  - `HeroDemo` vive en `MissionDemoSection`, inmediatamente después del hero; conservar `#prueba-tu-mision` y `client:visible`.
- `src/components/CenterPreview.astro`
  - Presentación estática de «Mi centro» en la landing global; enlaza a `/mentor` sin consultar la API ni simular una medición real.
  - Mantiene visible que es una lectura reflexiva y no un diagnóstico o una valoración objetiva.
- `src/styles/tokens.css`
  - Fuente de verdad para tokens globales, tipografías, escala, radios y sombras.
- `src/styles/global.css`
  - Reset, utilidades compartidas, botones, foco y reducción de movimiento.
- `src/styles/zones.css`
  - Variables y patrones comunes de las dos zonas.
- `src/components/zones/zoneContent.ts`
  - Fuente única de tipos, situaciones, aliases UTM, ejemplos y respuestas de las demos segmentadas.
  - No duplicar estos datos en páginas o componentes.
- `src/components/zones/SituationSelector.tsx`
  - Selección, persistencia, comunicación con la demo, analítica y scroll/foco.
- `src/components/zones/ZoneDemo.tsx`
  - Flujo local editar → generar → resultado → continuar.
- `src/components/zones/zoneAnalytics.ts`
  - Enriquece y emite eventos interactivos de las zonas.
- `src/components/zones/ZoneInteractive.css`
  - Estilos de selector y demo para ambos perfiles.
- `src/components/zones/ZoneHero.astro`, `ZoneDemoSection.astro`, `ZoneFinalCta.astro`, `ZoneFooter.astro`, `ZoneStickyCta.astro`
  - Estructura compartida de las zonas.
- `src/components/zones/student/` y `src/components/zones/performance/`
  - Secciones exclusivas de cada perfil.

Para cambiar orden, SEO o copy de primer nivel, empezar por la página de la ruta. Para cambiar una situación o resultado, empezar por `zoneContent.ts`.

## 5. Contratos que no se deben romper

### Demo y selección de zonas

- La demo es local y determinista; no usa `PUBLIC_AGENT_DEMO_ENDPOINT`.
- El resultado completo debe aparecer antes de pedir registro.
- Cada perfil tiene cinco situaciones y cada resultado tiene tres bloques.
- El textarea admite como máximo 500 caracteres.
- Evento interno entre selector y demo: `virtus:zone-situation`.
- Persistencia de situación: `virtus:zone-situation:<profile>` en `sessionStorage`.
- `ZoneDemoSection` tiene `tabindex="-1"` intencionadamente: el selector mueve allí el foco después del scroll.

La prioridad de resolución es deliberada:

- Selector: `utm_content` de la URL → situación persistida → campaña persistida → primera situación.
- Demo: selección en memoria de la página → `utm_content` de la URL → situación persistida → campaña persistida → primera situación.

No reordenar estas prioridades sin probar el caso: campaña A → usuario elige chip B → la demo se hidrata después. La selección B debe prevalecer. También debe prevalecer una campaña nueva frente a una selección antigua al entrar directamente en `#zone-demo`.

### Campaña y enlaces

Parámetros soportados:

- `utm_source` → `source`
- `utm_medium` → `medium`
- `utm_campaign` → `campaign`
- `utm_content` → `content`
- `influencer_id` → `influencer_id`

La campaña se guarda como JSON en `sessionStorage` bajo `virtus:campaign`.

- Todo enlace hacia la aplicación debe llevar `data-app-link`.
- `BaseLayout` añade campaña, `profile` y, dentro de una zona, `selected_situation`.
- El CTA de guardado de `ZoneDemo` construye además su URL desde el estado React actual.
- El funcionamiento debe degradar suavemente si `sessionStorage` está bloqueado o contiene JSON inválido.

### Analítica

La landing no integra un proveedor. Expone eventos mediante `CustomEvent('virtus:analytics')` para que el consumidor los conecte al proveedor elegido.

Eventos del funnel implementados aquí:

- `profile_landing_view`
- `profile_situation_selected`
- `profile_demo_started`
- `profile_demo_completed`
- `profile_plan_generated`
- `profile_plan_save_clicked`
- `center_cta_clicked`

Los eventos posteriores al salto a la app —registro, primera misión y retención— pertenecen a la aplicación, no a este repositorio.

Convenciones declarativas:

- `data-track="evento"` y `data-track-location="ubicacion"` para clics.
- `data-track-section="seccion"` para `landing_section_view`.
- No añadir `data-track` a un elemento que ya emite el mismo evento desde React: produciría conteo doble.

## 6. Sistema visual

La landing usa la dirección clara “Flujo + Raíz”:

- Base cálida: `hsl(36 30% 96%)`.
- Casi negro solo para texto, no como gran superficie.
- Landing global: azul `#2F80ED`, verde `#2F6B4F` y CTA azul→verde.
- Estudiante: oro `#D8B56D`, pizarra `#5D78A6`, tipografía Bitter.
- Rendimiento: naranja `#E0702F`, óxido `#9C3F1B`, tipografía Montserrat.
- Display global: Spectral cursiva 500. Cuerpo: Inter.

Los colores identitarios claros se usan en fondos, líneas y decoración. Para texto pequeño o botones con texto blanco se usan variantes más oscuras (`#4D668F` en Estudiante y `#8B3519` en Rendimiento) para conservar contraste AA.

Mantener estas invariantes:

- Superficies claras, capas suaves, curvas, blobs y motivos orgánicos.
- Sin fondos negros, grids técnicos, órbitas, coordenadas, compases, estética hustle o etiquetas monoespaciadas.
- Sin tracking negativo en titulares.
- Los estados `hover` y `focus-visible` deben seguir siendo perceptibles.
- Todo movimiento decorativo debe respetar `prefers-reduced-motion`.
- No introducir clichés visuales de estudiante o rendimiento.

Si el documento de zonas y el blueprint principal difieren visualmente, aplicar esta precedencia:

1. `../infra/virtus/docs/landing-page/virtus-landing-page-blueprint.md` define sistema visual, tipografías y colores actuales.
2. `../infra/virtus/docs/landing-page/virtus-landing-zones-segmentadas.md` define contenido, estructura y comportamiento específicos de las zonas.

## 7. Convenciones de implementación

- Mantener TypeScript estricto; no usar `any` sin una razón documentada.
- Preferir componentes `.astro` estáticos y CSS encapsulado.
- Reutilizar tokens; no crear colores o fuentes alternativos sin requisito de diseño.
- Mantener el copy visible en español y el código/tipos coherentes con los nombres actuales en inglés.
- Los IDs de situación son contratos de analítica y URLs: deben ser estables, únicos y sin acentos.
- Al añadir una situación, incluir `id`, `label`, `demoVariant`, aliases de campaña, `exampleInput` y tres bloques de resultado.
- Los aliases pasan por normalización de acentos, mayúsculas y separadores; aun así deben representar explícitamente los ángulos reales de campaña.
- Normalizar `PUBLIC_APP_URL` eliminando barras finales, como hacen las páginas actuales.
- No añadir backend, SDK de analítica, cookies o dependencias nuevas sin petición explícita.
- Preservar accesibilidad semántica: landmarks, `aria-labelledby`, estados `aria-pressed`, regiones vivas y orden de foco.

## 8. Verificación manual mínima

Para cambios de UI o interacción, comprobar:

1. `/`, `/estudiante` y `/rendimiento` cargan sin errores de consola.
2. No existe overflow horizontal a 390 px ni a 1440 px.
3. Header fijo, pestaña activa y jerarquía de marca son correctos.
4. Un `utm_content` conocido preselecciona el chip esperado.
5. Elegir otro chip actualiza la demo, persiste la selección, hace scroll y mueve el foco.
6. La demo completa generación, enseña tres bloques y no exige registro antes del resultado.
7. Login y guardado conservan UTM, perfil y situación.
8. El CTA sticky aparece después del hero en móvil, no aparece en escritorio y se oculta al llegar al CTA final.
9. Con `prefers-reduced-motion: reduce`, las animaciones decorativas quedan estáticas.
10. Los controles son utilizables con teclado y mantienen foco visible.

Aliases útiles para smoke test:

- `/estudiante?utm_content=estudio%20por%20inercia` → “Voy por inercia”.
- `/rendimiento?utm_content=demasiados%20proyectos` → “Demasiados frentes abiertos”.

## 9. Archivos generados y seguridad del worktree

- `src/` es la fuente de verdad. No editar manualmente `dist/` ni `.astro/`.
- Este repositorio mantiene actualmente `dist/` y parte de `.astro/` bajo control de versiones.
- `pnpm check` puede regenerar `.astro/types.d.ts`.
- `pnpm build` regenera `dist/` y cambia hashes de assets; que desaparezca el hash anterior y aparezca uno nuevo es normal.
- Revisar `git status` antes de empezar y al terminar. No revertir cambios previos del usuario ni archivos generados ajenos al trabajo actual.
- No realizar despliegues ni modificar servicios vecinos salvo petición explícita.
