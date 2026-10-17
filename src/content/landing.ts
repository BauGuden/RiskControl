import {
  Bot,
  ChartNoAxesCombined,
  Coins,
  Gauge,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Calculadoras", href: "#herramienta" },
  { label: "Contratos CFD", href: "#contratos" },
  { label: "Cómo funciona", href: "#metodo" },
  { label: "Comisiones", href: "#comisiones" },
  { label: "Aprende", href: "#aprende" },
];

export const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    eyebrow: "Riesgo real",
    title: "Define cuánto perder antes de pensar cuánto ganar",
    description:
      "El tamaño se calcula desde tu stop y presupuesto de riesgo, no desde una posición elegida al azar.",
  },
  {
    icon: Coins,
    eyebrow: "Costes visibles",
    title: "De unidades cripto a lotes en MT5",
    description:
      "Compara Standard y Cent, revisa el spread y calcula el margen de tus operaciones CFD en Exness y Vantage.",
  },
  {
    icon: Bot,
    eyebrow: "Asistente Gemini",
    title: "De una idea escrita a un cálculo verificable",
    description:
      "Describe la operación de forma natural; Gemini interpreta y el motor local hace las matemáticas.",
  },
];

export const METHOD_STEPS = [
  {
    number: "01",
    title: "Ubica tu invalidación",
    description:
      "Define entrada y stop según tu análisis. En CFD elige LONG o SHORT; en cripto la dirección se detecta desde los precios.",
  },
  {
    number: "02",
    title: "Fija el riesgo",
    description:
      "Indica tu presupuesto de pérdida. La distancia al stop y los costes determinan el tamaño; en CFD se redondea al paso de lote.",
  },
  {
    number: "03",
    title: "Evalúa el escenario",
    description:
      "Revisa unidades o lotes, cuenta y margen. En CFD compara los nueve objetivos netos de 1:2 a 1:10 antes de elegir tu salida.",
  },
];

export const CONTENT_PILLARS = [
  {
    icon: Gauge,
    category: "Gestión de riesgo",
    title:
      "El apalancamiento no cambia el riesgo si el size está bien calculado",
    description:
      "Aprende a separar margen, exposición y pérdida máxima para evitar la falsa sensación de control.",
  },
  {
    icon: ChartNoAxesCombined,
    category: "Ejecución",
    title:
      "Maker vs. taker: la diferencia que se acumula operación tras operación",
    description:
      "Entiende cuándo una orden aporta liquidez, cuándo la toma y cómo afecta tu resultado neto.",
  },
  {
    icon: GraduationCap,
    category: "Fundamentos",
    title: "Funding, spread y slippage no son la misma comisión",
    description:
      "Tres costes distintos que debes modelar cuando operas futuros o activos con menor liquidez.",
  },
];

export const EXCHANGES = ["Binance", "Bybit", "MEXC", "Bitget", "Bitunix"];
