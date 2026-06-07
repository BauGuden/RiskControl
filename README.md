# DGBM Risk Control

Calculadora de riesgo para Spot y Futures. Calcula tamaño de posición, fees, margen estimado y objetivos RR 1:1 a 1:5.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Validación

```bash
pnpm test
pnpm build
```

## Deploy

Netlify publica desde `main` usando:

- Build command: `pnpm run build`
- Publish directory: `dist`
- Node: `22`
