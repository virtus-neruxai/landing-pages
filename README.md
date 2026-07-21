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

- Implementada únicamente la landing global `/`.
- Las rutas futuras `/estudiante` y `/rendimiento` están declaradas en los botones de perfil como “Próximamente”, pero no navegan ni tienen página todavía.
- No incluye infraestructura, Docker, Kubernetes ni integración de pagos.
