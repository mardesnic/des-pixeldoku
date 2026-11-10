import type { Language } from './i18n';
import type { Picture } from './pictures';
import { isSolved, paint } from './pixels';

// Grids of 5, 6, 8 and 10 squares a side.
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

export type Game = {
  difficulty: Difficulty;
  picture: string;
  // Whether each square is coloured, row by row.
  coloured: boolean[];
  solved: boolean;
};

export const newGame = (difficulty: Difficulty, p: Picture): Game => ({
  difficulty,
  picture: p.id,
  coloured: new Array<boolean>(p.rows.length ** 2).fill(false),
  solved: false,
});

// The game after a stroke, or the same game if nothing changed.
export function withStroke(
  game: Game,
  p: Picture,
  cells: number[],
  on: boolean
): Game {
  const coloured = paint(game.coloured, cells, on);
  if (coloured.every((c, i) => c === game.coloured[i])) return game;
  return { ...game, coloured, solved: isSolved(p, coloured) };
}

// The pictures solved at each size, by id.
export type Stats = Record<Difficulty, string[]>;

export const initialStats: Stats = { tiny: [], small: [], medium: [], big: [] };

export function recordWin(stats: Stats, game: Game): Stats {
  const solved = stats[game.difficulty];
  if (solved.includes(game.picture)) return stats;
  return { ...stats, [game.difficulty]: [...solved, game.picture] };
}
