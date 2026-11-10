import type { Language } from './i18n';

export const DIFFICULTIES = ['tiny', 'small', 'medium', 'big'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type Settings = {
  language: Language;
  sound: boolean;
};

export const initialSettings: Settings = {
  language: 'auto',
  sound: true,
};

export type Stats = Record<Difficulty, { solved: number }>;

export const initialStats: Stats = {
  tiny: { solved: 0 },
  small: { solved: 0 },
  medium: { solved: 0 },
  big: { solved: 0 },
};
