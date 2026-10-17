# DGBM Risk Control

Calculadora de riesgo para criptomonedas y CFDs. El modo **CFDs / MT5** compara lotaje Standard y Cent para Exness y Vantage; el modo **Cripto** conserva Spot, Futures, comisiones, objetivos RR y el asistente conectado a Gemini mediante una Netlify Function. El modo oscuro es el predeterminado y se respeta cualquier preferencia guardada.

## Calculadora CFD / MT5

- Símbolos CFD (selector sin nombres largos, en este orden): XAUUSD, BTCUSD, EURUSD, GBPUSD, USDJPY, USTEC, US30, US500, GBPJPY, XAGUSD, USOIL, ETHUSD, USDCAD, AUDUSD y EURJPY. Las variantes Cent se muestran según la cuenta elegida y se reconocen también en el bot.
- Entradas: riesgo USD, LONG/SHORT, entrada, SL, TP automático o manual opcional, cuenta, apalancamiento y spread editable.
- **TP automáticos solo en CFD:** nueve objetivos netos de 1:2 a 1:10, visibles simultáneamente y recalculados con entrada, SL y spread. El modo automático usa 1:2 al iniciar; elegir una tarjeta actualiza el TP, el mapa y el plan copiado. El modo manual conserva el TP libre y opcional. El cálculo cripto mantiene sus objetivos existentes.
- Los objetivos comparan ganancia neta con el **riesgo total real** (pérdida al SL + spread), incluso cuando el spread se suma fuera del presupuesto inicial. Cada tarjeta es una salida alternativa de toda la posición; no se suman sus ganancias ni representan cierres parciales. Sin volumen ejecutable se muestran precios teóricos y se omiten ganancias.
- Resultados automáticos: unidades subyacentes, lotes teóricos y ejecutables, riesgo al SL, spread, resultado neto en TP, ratio beneficio/riesgo y equivalencias USD/USC.
- La detección automática elige Standard si el volumen es viable y Cent si Standard no llega al mínimo. Si ninguna cuenta es viable, no recomienda una orden. La selección manual no se cambia silenciosamente.
- El volumen se redondea **hacia abajo** al paso de lote. Contrato, mínimo y paso son editables según el servidor; Cent supone un contrato 100 veces menor.
- Si el spread se incluye en el presupuesto, las unidades son `riesgo / (pérdida por unidad al SL + spread por unidad)`. En modo adicional, las unidades son `riesgo / pérdida por unidad al SL`; la pérdida total estimada puede exceder el presupuesto por el spread.
- USDJPY y USDCAD convierten la pérdida al precio SL, la ganancia al precio TP y el spread al precio de entrada. Su nocional USD coincide con las unidades USD. GBPJPY y EURJPY requieren **USDJPY de referencia**, editable y sin una tasa precargada: el modelo convierte pérdida, ganancia y nocional usando esta tasa constante. El bot acepta `GBPJPY riesgo 1 entrada 195 SL 194 conversión USDJPY 150 TP 1:3`. La referencia se incluye en el resultado copiado.
- El modelo añade un spread a la pérdida por recorrido y resta uno a la ganancia bruta. Usa precios de referencia; no dupliques el spread si tus precios de ejecución ya lo incorporan. No incluye comisiones, swap o deslizamiento.
- La tabla compara los 12 apalancamientos con el mismo tamaño y riesgo. UNLIMITED es una aproximación teórica elegible de Exness, no una garantía de margen cero; no se habilita en Vantage.

**Ejemplo de $1:** XAUUSD, entrada 4100, SL 4080 y spread 0.20. En modo spread adicional: 0.05 XAUT/oz, 0.0005 lotes Standard teóricos y **0.05 lotes Cent** ejecutables; riesgo SL $1.00 (100 USC), spread $0.01 y total $1.01. El TP automático 1:2 es **4140.60**, con beneficio neto **$2.02**; el 1:10 es 4302.20, con $10.10 netos. Al incluir spread dentro del presupuesto, se ejecutan 0.04 lotes Cent, con riesgo total $0.808 por el redondeo. El TP manual 4120 del encargo sigue disponible al cambiar a modo manual.

El cálculo por unidad del TP neto usa `g = ratio × (pérdida SL por unidad + spread por unidad) + spread por unidad`. En instrumentos cotizados en USD: `TP = entrada ± g`. En USDJPY: LONG `TP = entrada / (1 - g)` y SHORT `TP = entrada / (1 + g)`, porque la conversión de beneficio a USD usa el propio precio de salida. Un objetivo que no tenga solución positiva se marca como no alcanzable.

El frontend comparte un sistema visual para las dos calculadoras: cabecera adaptable, portada con ejemplo explícito, selector de mercado, mapa de niveles, tarjetas de objetivos, tablas y conceptos desplegables. Mantiene los modos claro/oscuro y respeta la preferencia de movimiento reducido.

### Asistente en ambos mercados y copia CFD

La pestaña Cripto conserva el asistente para Spot/Futures con comisiones por exchange. La pestaña CFD incluye un asistente para Exness/Vantage que aplica sus operaciones al formulario y usa `calculateCfd()`, con los mismos mínimos, restricciones Cent, spread y TP netos. Cada modo mantiene su conversación y no convierte símbolos CFD a USDT.

Ejemplos CFD: `Oro Exness Cent riesgo $1 entrada 4100 SL 4080 TP 1:3 apalancamiento 1:100`, `GBPUSD Vantage riesgo 5 entrada 1.295 SL 1.290 TP 1:4`. Después de calcular, admite `y con 1:500` o `cambia TP a 1:5`. Para tomar los datos editados en pantalla, usa **Usar formulario**. Las operaciones nuevas e incompletas piden los datos faltantes; no toman precios precargados silenciosamente.

Las operaciones estructuradas y las explicaciones básicas funcionan localmente. Gemini sigue disponible para interpretar texto libre y responder preguntas: la función `/api/interpret-trade` recibe `mode: "cfd"` para la ruta CFD y conserva su ruta cripto anterior. Su respuesta se valida antes de calcular; Gemini no determina los lotes ni las ganancias. El acceso real al proveedor depende de las variables de entorno y su disponibilidad.

**Copiar resultado CFD** exporta cuenta, lote, entrada/SL/TP, riesgo USD/USC, spread, margen y los nueve TP. Cada tarjeta ejecutable tiene copia por cuenta; las respuestas del bot también se pueden copiar. Si no hay volumen ejecutable, la copia general incluye el informe de inviabilidad. El botón muestra el resultado de la copia y avisa si el navegador rechaza el portapapeles.

Las condiciones del adjunto son **presets**, no cotizaciones ni especificaciones garantizadas. Fuentes consultadas el 17/10/2026:

- [Exness Standard Cent](https://get.exness.help/hc/en-us/articles/17537782786588-Standard-Cent-account): conversión de lotes, USC y BTCUSDc solo en MT5.
- [Exness índices](https://get.exness.help/hc/en-us/articles/17854383867548-Indices): USTEC y US30 con mínimo 0.05, US500 con mínimo 0.14 y apalancamiento base 1:400. La documentación menciona índices Cent en MT5, pero este modelo no los simula hasta verificar su contrato Cent; no afirma indisponibilidad universal.
- [Exness cripto](https://get.exness.help/hc/en-us/articles/17854191888540-Cryptocurrencies): ETHUSD con mínimo 0.1. [Exness energía](https://get.exness.help/hc/en-us/articles/17854173039388-Commodities): contrato USOIL de 1000 barriles y perfil de margen MT5 hasta 1:2000. Los controles del servidor siguen siendo editables.
- [Exness cambios de margen](https://get.exness.help/hc/es/articles/30743728061724-El-apalancamiento-aumenta-para-determinados-instrumentos): transición de índices prevista desde el 24/10/2026; este perfil conserva el tope 1:400 hasta revisar las condiciones efectivas del servidor.
- [Vantage contratos de oro](https://latam.vantagemarkets.com/es/academy/xauusd-risk-management/): el contrato depende del producto y cuenta. Los presets Cent y sufijos de Vantage siguen las referencias del encargo y requieren confirmación en MT5.

Los datos viven en `src/features/cfd/instruments.ts`; las matemáticas en `calculateCfd.ts`, con pruebas de fórmulas, límites, conversión JPY y presupuesto de riesgo. La interfaz está en `CfdWorkspace.tsx`. Se integra en React/Tailwind del proyecto existente, en lugar de duplicar la aplicación en un HTML independiente.

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
