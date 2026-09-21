// DEMO DATA — заменить на согласованную методологию перед production
// Базовая сумма Rj * kji: таблица 1 и п. 34 методики ФСТЭК от 11.11.2025.
import { groups, indicators } from "./kzi-methodology.example.ts";
import type { Methodology } from "../lib/kzi/calculateKzi.ts";
const groupWeights: Record<string, number> = { organization: 0.10, users: 0.25, systems: 0.35, monitoring: 0.30 };
const values: Record<string, number> = {
  "1.1": 0.30, "1.2": 0.40, "1.3": 0.30,
  "2.1": 0.30, "2.2": 0.30, "2.3": 0.20, "2.4": 0.20,
  "3.1": 0.20, "3.2": 0.25, "3.3": 0.15, "3.4": 0.15, "3.5": 0.15, "3.6": 0.10,
  "4.1": 0.40, "4.2": 0.35, "4.3": 0.25,
};
export const methodology: Methodology = {
  groups: groups.map(group => ({ ...group, weight: groupWeights[group.id] })),
  indicators: indicators.map(indicator => ({ ...indicator, value: values[indicator.code] })),
  answerValues: { yes: 1, no: 0, unknown: 0 },
  // TODO: требует подтверждения — повторное невыполнение за 12 месяцев,
  // минимальные значения по нескольким ИС, результаты пентеста и исключения.
  // Опрос не собирает эти данные; пустой список не имитирует их учёт.
  rules: [],
};
