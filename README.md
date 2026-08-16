# Virtus Landing

Landing global de NeruxAI para Virtus. Es un proyecto Astro estático e independiente de la aplicación principal.

## Desarrollo local

Requiere Node.js 22.12 o superior y pnpm.

```bash
pnpm install
pnpm dev
```

Astro mostrará la URL local, normalmente `http://localhost:4321`.

## Verificación

```bash
pnpm check
pnpm build
pnpm preview
```

## Configuración

Copia `.env.example` a `.env` si necesitas cambiar el destino de los enlaces a la app:

```bash
PUBLIC_APP_URL=http://localhost:3000
```

Sin esta variable, los enlaces usan `https://virtus.neruxai.com` como fallback. La demo de misión es local y determinista: no necesita backend ni credenciales.

## Alcance actual

- Landing global disponible en `/`.
- Zonas segmentadas disponibles en `/estoico`, `/espiritual`, `/calma`, `/estudiante` y `/rendimiento`, con selector de situación y demo local específica para cada perfil.
- Los parámetros UTM se conservan en `sessionStorage` y se propagan a los enlaces hacia la app.
- No incluye infraestructura, Docker, Kubernetes ni integración de pagos.
