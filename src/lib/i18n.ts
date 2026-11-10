import type { Difficulty } from './game';

export const LANGS = ['en', 'hr'] as const;
export type Lang = (typeof LANGS)[number];
export type Language = 'auto' | Lang;

// Each language's name in that language, for the picker.
export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  hr: 'Hrvatski',
};

export function detectLang(): Lang {
  const preferred = navigator.languages ?? [navigator.language];
  return preferred.some((l) => l.toLowerCase().startsWith('hr')) ? 'hr' : 'en';
}

const en = {
  title: 'Pixels',
  newGame: 'New game',
  settings: 'Settings',
  done: 'Done',
  cancel: 'Cancel',
  levels: {
    tiny: 'Tiny',
    small: 'Small',
    medium: 'Medium',
    big: 'Big',
  } satisfies Record<Difficulty, string>,
  goal: 'Colour the squares the numbers ask for',
  undo: 'Undo',
  clear: 'Start over',
  solved: 'Well done!',
  next: 'Next picture',
  changeLevel: 'Change level',
  language: 'Language',
  automatic: 'Automatic',
  sound: 'Sound',
  on: 'On',
  off: 'Off',
  statistics: 'Statistics',
  solvedColumn: 'Solved',
  source: 'Source',
};

export type Strings = typeof en;

const hr: Strings = {
  title: 'Pikseli',
  newGame: 'Nova igra',
  settings: 'Postavke',
  done: 'Gotovo',
  cancel: 'Odustani',
  levels: {
    tiny: 'Mala',
    small: 'Manja',
    medium: 'Srednja',
    big: 'Velika',
  },
  goal: 'Oboji kvadratiće koje traže brojevi',
  undo: 'Poništi',
  clear: 'Ispočetka',
  solved: 'Bravo!',
  next: 'Sljedeća slika',
  changeLevel: 'Promijeni razinu',
  language: 'Jezik',
  automatic: 'Automatski',
  sound: 'Zvuk',
  on: 'Uključen',
  off: 'Isključen',
  statistics: 'Statistika',
  solvedColumn: 'Riješeno',
  source: 'Izvorni kod',
};

export const STRINGS: Record<Lang, Strings> = { en, hr };
