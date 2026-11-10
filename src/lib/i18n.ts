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
  goal: 'The numbers say how many squares to colour in each row and column. Colour them all and find the picture!',
  colour: 'Colour',
  dot: 'Dot',
  coloured: 'coloured',
  dotted: 'dot',
  blank: 'empty',
  undo: 'Undo',
  clear: 'Start over',
  solved: 'Well done!',
  itsA: (name: string) => `It's ${name}!`,
  solvedOf: (n: number, total: number) => `${n} of ${total}`,
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
  goal: 'Brojevi govore koliko kvadratića treba obojiti u svakom retku i stupcu. Oboji ih sve i otkrij sliku!',
  colour: 'Boja',
  dot: 'Točka',
  coloured: 'obojeno',
  dotted: 'točka',
  blank: 'prazno',
  undo: 'Poništi',
  clear: 'Ispočetka',
  solved: 'Bravo!',
  itsA: (name: string) => `To je ${name}!`,
  solvedOf: (n: number, total: number) => `${n} od ${total}`,
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
