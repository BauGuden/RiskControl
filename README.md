# DGBM Risk Control

Calculadora de riesgo para Spot y Futures. Calcula tamaño de posición, fees, margen estimado y objetivos RR 1:1 a 1:5. Incluye un asistente conectado a Gemini mediante una Netlify Function.

## Requisitos

- Node.js 22 o superior.
- pnpm 10.24 o superior.
- Una cuenta de Netlify.
- Una clave activa de Gemini API.

## Instalación

```powershell
pnpm install
Copy-Item .env.example .env
```

Completa `.env`:

```dotenv
GEMINI_API_KEY=tu_clave_privada
GEMINI_MODEL=gemini-3.1-flash-lite
```

Nunca subas `.env` ni compartas la clave. El archivo ya está ignorado por Git.

## Desarrollo local

Para ejecutar la web junto con la función de Gemini:

```powershell
pnpm exec netlify dev
```

`pnpm dev` ejecuta solamente Vite. En ese modo la Netlify Function no está disponible y el chat utilizará el intérprete local de respaldo.

## Arquitectura del frontend

La página está organizada para que el contenido y las herramientas puedan crecer por separado:

```text
src/
  components/
    landing/      Secciones editoriales, navegación y footer
    tool/         Composición de herramientas interactivas
    calculator/   Formulario de riesgo
    chat/         Asistente conversacional
    results/      Presentación de resultados
    ui/           Controles reutilizables
  content/        Copy y colecciones de contenido de la landing
  data/           Presets de fees, símbolos y pares
  features/       Estado y casos de uso por dominio
  lib/            Cálculos deterministas y utilidades
```

Para añadir una nueva sección editorial, crea el componente dentro de `components/landing` y guarda sus datos repetibles en `content/landing.ts`. Las nuevas calculadoras deben vivir como features independientes y ensamblarse desde `components/tool`.

## Perfiles de comisiones

Las tarifas fueron verificadas el 20 de septiembre de 2026 y se modelan por ruta de ejecución:

- Estándar/VIP 0 para Binance, Bybit, MEXC, Bitget y Bitunix.
- Binance con descuento BNB y Bitget Spot con descuento BGB.
- MEXC 0-Fee Fest, referencias especiales BTCUSDT/ETHUSDT y Futures API.
- MEXC Futures API usa 0.060% maker / 0.080% taker y no hereda promociones 0-fee.

Las promociones dependen del par, la cuenta y la región. Antes de operar, confirma siempre la tarifa mostrada por el exchange. Funding, spread y slippage no forman parte de estos presets.

## Validación

Antes de publicar:

```powershell
pnpm test
pnpm build
```

Ambos comandos deben terminar sin errores.

## Subir a producción en Netlify

### 1. Subir el proyecto a Git

Confirma que `.env` no aparezca entre los archivos que se enviarán:

```powershell
git status
git add .
git commit -m "Prepare production deploy"
git push origin main
```

### 2. Crear el sitio

1. Entra a Netlify.
2. Selecciona **Add new project** y luego **Import an existing project**.
3. Conecta el repositorio de GitHub.
4. Selecciona la rama `main`.
5. Netlify leerá automáticamente `netlify.toml`.

La configuración esperada es:

- Build command: `pnpm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Node.js: `22`
- pnpm: `10.24.0`

### 3. Configurar Gemini

En Netlify abre **Site configuration → Environment variables** y crea:

- `GEMINI_API_KEY`: la clave privada de Gemini.
- `GEMINI_MODEL`: `gemini-3.1-flash-lite`.

Si Netlify permite seleccionar alcance, habilita la variable para **Functions**. No agregues la clave dentro de `netlify.toml`, React, GitHub ni ningún archivo público.

El archivo `.env` local no se publica; las variables de producción deben configurarse directamente en Netlify.

### 4. Publicar

Abre **Deploys** y selecciona **Trigger deploy → Deploy site**. Los siguientes cambios enviados a `main` se publicarán automáticamente.

También puedes desplegar mediante la CLI:

```powershell
pnpm exec netlify login
pnpm exec netlify link
pnpm exec netlify deploy --build
pnpm exec netlify deploy --build --prod
```

El primer deploy es una vista previa. El comando con `--prod` publica en el dominio principal.

## Verificación después del deploy

1. Abre el dominio generado por Netlify.
2. Envía una operación completa desde el chat.
3. Confirma que la etiqueta cambie a **Gemini conectado**.
4. Prueba una pregunta como `¿Qué es el notional?`.
5. Revisa que copiar y compartir funcionen bajo HTTPS.

Para comprobar directamente la función desde PowerShell:

```powershell
$body = @{ message = "BTC riesgo 8 entrada 61800 SL 62250 en MEXC Futures por API" } | ConvertTo-Json
Invoke-RestMethod `
  -Method Post `
  -Uri "https://TU-DOMINIO.netlify.app/api/interpret-trade" `
  -ContentType "application/json" `
  -Body $body
```

La respuesta debe tener `kind: trade`, `symbol: BTCUSDT`, `broker: MEXC` y `feeProfile: api`.

## Solución de problemas

### El chat muestra “Modo local”

- Verifica `GEMINI_API_KEY` en las variables de Netlify.
- Confirma que `GEMINI_MODEL` sea `gemini-3.1-flash-lite`.
- Ejecuta un nuevo deploy después de modificar variables.
- Revisa **Logs → Functions → interpret-trade**.

### La función devuelve 404

- Confirma que existe `netlify/functions/interpret-trade.mts`.
- Verifica que el deploy haya incluido las Functions.
- No pruebes la integración usando únicamente `pnpm dev`.

### La función devuelve 500 o 502

- Comprueba que la clave no esté vencida, bloqueada o revocada.
- Revisa la cuota del proyecto de Gemini.
- Consulta los logs de la función en Netlify.

### La compilación falla

Ejecuta localmente:

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Corrige los errores antes de volver a desplegar.

## Seguridad

- Nunca expongas `GEMINI_API_KEY` en código del navegador.
- Si una clave se comparte accidentalmente, revócala y genera una nueva.
- Mantén `.env`, `.env.copy` y archivos similares fuera de Git.
- Los cálculos financieros se ejecutan localmente con fórmulas deterministas; Gemini solo interpreta el mensaje y responde preguntas.

## Estructura de producción

```text
Navegador
  → /api/interpret-trade
  → Netlify Function
  → Gemini API

Navegador
  → calculateRisk()
  → Resultado determinista
```
