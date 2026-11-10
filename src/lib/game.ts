import type { Language } from './i18n';
import type { Picture } from './pictures';
import { COLOUR, EMPTY, isSolved, paint, type Mark, type Tool } from './pixels';

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
  marks: Mark[];
  tool: Tool;
  solved: boolean;
};

export const newGame = (difficulty: Difficulty, p: Picture): Game => ({
  difficulty,
  picture: p.id,
  marks: new Array<Mark>(p.rows.length ** 2).fill(EMPTY),
  tool: COLOUR,
  solved: false,
});

// The game after a stroke, or the same game if nothing changed.
export function withStroke(
  game: Game,
  p: Picture,
  cells: number[],
  mark: Mark
): Game {
  const marks = paint(game.marks, cells, mark, game.tool);
  if (marks.every((m, i) => m === game.marks[i])) return game;
  return { ...game, marks, solved: isSolved(p, marks) };
}

// The pictures solved at each size, by id.
export type Stats = Record<Difficulty, string[]>;

export const initialStats: Stats = { tiny: [], small: [], medium: [], big: [] };

export function recordWin(stats: Stats, game: Game): Stats {
  const solved = stats[game.difficulty];
  if (solved.includes(game.picture)) return stats;
  return { ...stats, [game.difficulty]: [...solved, game.picture] };
}
