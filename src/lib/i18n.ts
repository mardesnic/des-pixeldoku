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
  hint: 'Tap or drag to colour',
  howToPlay: 'How to play',
  helpCount:
    'Each number says how many squares to colour in its row or column. A 3 means three squares side by side.',
  helpGroups:
    'Two numbers mean two groups, in that order, with at least one empty square between them.',
  helpGreen:
    'When the coloured squares in a line match its numbers, the numbers turn green.',
  helpTap:
    'Tap a square to colour it, or drag along a row or column. Tap a coloured square to clear it. Colour all the right squares and the picture appears!',
  letsPlay: "Let's play",
  coloured: 'coloured',
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
  hint: 'Dodirni ili povuci za bojanje',
  howToPlay: 'Kako se igra',
  helpCount:
    'Svaki broj kaže koliko kvadratića treba obojiti u njegovom retku ili stupcu. 3 znači tri kvadratića jedan do drugoga.',
  helpGroups:
    'Dva broja znače dvije skupine, tim redom, s barem jednim praznim kvadratićem između.',
  helpGreen:
    'Kad obojeni kvadratići u retku ili stupcu odgovaraju brojevima, brojevi postanu zeleni.',
  helpTap:
    'Dodirni kvadratić da ga obojiš ili povuci prstom po retku ili stupcu. Dodirni obojeni kvadratić da ga obrišeš. Oboji sve prave kvadratiće i pojavit će se slika!',
  letsPlay: 'Igrajmo',
  coloured: 'obojeno',
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
