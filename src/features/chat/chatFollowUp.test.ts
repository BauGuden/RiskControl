import { describe, expect, it } from "vitest";
import { extractLeverage, isMarginQuestion } from "./chatFollowUp";

describe("chatFollowUp", () => {
  it.each([
    ["con apalacamiento 500x cuanto margen necesito", 500],
    ["¿y con 100x?", 100],
    ["MEXC entrada 84 sl 83 riesgo de 7$ con apalacamiento x100", 100],
    ["leverage de 20", 20],
    ["50x de apalancamiento", 50]
  ])("extrae el apalancamiento de %s", (message, expected) => {
    expect(extractLeverage(message)).toBe(expected);
  });

  it("reconoce una pregunta de margen", () => {
    expect(isMarginQuestion("¿Cuánto margen necesito?")).toBe(true);
  });
});
