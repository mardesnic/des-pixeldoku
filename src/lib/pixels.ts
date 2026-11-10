import type { Difficulty } from './game';
import { PICTURES, type Picture } from './pictures';

export const sizeOf = (p: Picture) => p.rows.length;

// Whether each square of the picture is coloured, row by row.
export const solutionOf = (p: Picture): boolean[] =>
  p.rows.flatMap((row) => [...row].map((c) => c !== '.'));

export const colourAt = (p: Picture, i: number): string | undefined => {
  const n = sizeOf(p);
  const c = p.rows[Math.floor(i / n)][i % n];
  return c === '.' ? undefined : c;
};

export const rowOf = (n: number, r: number) =>
  Array.from({ length: n }, (_, c) => r * n + c);
export const columnOf = (n: number, c: number) =>
  Array.from({ length: n }, (_, r) => r * n + c);

// The lengths of the runs of coloured squares in a line: ##.#. → [2, 1].
export function clueOf(line: boolean[]): number[] {
  const runs: number[] = [];
  let run = 0;
  for (const on of line) {
    if (on) run++;
    else if (run) {
      runs.push(run);
      run = 0;
    }
  }
  if (run) runs.push(run);
  return runs;
}

export type Clues = { rows: number[][]; columns: number[][] };

export function cluesOf(p: Picture): Clues {
  const n = sizeOf(p);
  const on = solutionOf(p);
  const clue = (cells: number[]) => clueOf(cells.map((i) => on[i]));
  return {
    rows: Array.from({ length: n }, (_, r) => clue(rowOf(n, r))),
    columns: Array.from({ length: n }, (_, c) => clue(columnOf(n, c))),
  };
}

const same = (a: number[], b: number[]) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

// A line is done when its coloured squares make exactly its clue.
export const lineDone = (
  coloured: boolean[],
  cells: number[],
  clue: number[]
) => same(clueOf(cells.map((i) => coloured[i])), clue);

// Whether a line's coloured squares can still be made to match its numbers.
// Not when there are too many, when a group is too long, or when squares
// are apart that a number needs together: "2" with ■·■ can never fit.
export const lineFits = (line: boolean[], clue: number[]) =>
  solveLine(
    line.map((on) => (on ? 1 : -1)),
    clue
  ) !== null;

// Which of a line's numbers have found their group: a run of coloured
// squares just as long, that can only be that number's group however the
// rest of the line turns out. Colouring the bottom square of a "2 1" column
// lights up the 1 at once, so a child sees what each number stands for.
export function groupsDone(line: boolean[], clue: number[]): boolean[] {
  const n = line.length;
  // Where each group starts, in every way the clue fits around the
  // coloured squares.
  const fits: number[][] = [];
  const starts: number[] = [];
  const place = (k: number, from: number) => {
    if (k === clue.length) {
      for (let i = from; i < n; i++) if (line[i]) return;
      fits.push(starts.slice());
      return;
    }
    for (let at = from; at + clue[k] <= n; at++) {
      if (at > from && line[at - 1]) break;
      if (line[at + clue[k]]) continue;
      starts[k] = at;
      place(k + 1, at + clue[k] + 1);
    }
  };
  place(0, 0);
  return clue.map((len, k) => {
    const at = fits[0]?.[k];
    if (at === undefined || fits.some((f) => f[k] !== at)) return false;
    for (let i = at; i < at + len; i++) if (!line[i]) return false;
    return true;
  });
}

// Solving one line at a time, the way a person does: try every way the
// clue's runs fit the line with what is already known, and keep the squares
// that come out the same in all of them. Unknown is -1, empty 0, coloured 1.
type Known = -1 | 0 | 1;

export function solveLine(line: Known[], clue: number[]): Known[] | null {
  const n = line.length;
  const canOn = new Array<boolean>(n).fill(false);
  const canOff = new Array<boolean>(n).fill(false);
  const now = new Array<boolean>(n).fill(false);
  let any = false;

  // Places run k at or after `from`, with runs before it already placed.
  const place = (k: number, from: number) => {
    if (k === clue.length) {
      for (let i = from; i < n; i++) if (line[i] === 1) return;
      any = true;
      for (let i = 0; i < n; i++) {
        if (now[i]) canOn[i] = true;
        else canOff[i] = true;
      }
      return;
    }
    const len = clue[k];
    const rest = clue.slice(k + 1).reduce((s, x) => s + x + 1, 0);
    for (let at = from; at + len + rest <= n; at++) {
      // Squares skipped before the run must be able to be empty.
      if (at > from && line[at - 1] === 1) break;
      let fits = true;
      for (let i = at; i < at + len; i++) if (line[i] === 0) fits = false;
      if (!fits || line[at + len] === 1) continue;
      for (let i = at; i < at + len; i++) now[i] = true;
      place(k + 1, at + len + 1);
      for (let i = at; i < at + len; i++) now[i] = false;
    }
  };
  place(0, 0);
  if (!any) return null;
  return line.map((_, i) => (canOn[i] && canOff[i] ? -1 : canOn[i] ? 1 : 0));
}

// The picture the clues make, if it can be found line by line without
// guessing; that also means it is the only answer. Null if not.
export function solve(clues: Clues): boolean[] | null {
  const n = clues.rows.length;
  const grid = new Array<Known>(n * n).fill(-1);
  const lines = [
    ...clues.rows.map((clue, r) => ({ cells: rowOf(n, r), clue })),
    ...clues.columns.map((clue, c) => ({ cells: columnOf(n, c), clue })),
  ];
  for (let changed = true; changed;) {
    changed = false;
    for (const { cells, clue } of lines) {
      const known = solveLine(
        cells.map((i) => grid[i]),
        clue
      );
      if (!known) return null;
      known.forEach((v, k) => {
        if (v !== grid[cells[k]]) {
          grid[cells[k]] = v;
          changed = true;
        }
      });
    }
  }
  return grid.includes(-1) ? null : grid.map((v) => v === 1);
}

// The squares a finger has gone over: from where it went down to where it
// is now, along one row or column. The first move picks which, and it then
// stays on that line, so a wobbly finger still colours a straight line.
export type Axis = 'row' | 'column';

export function strokeCells(
  n: number,
  start: number,
  at: number,
  axis?: Axis
): { cells: number[]; axis?: Axis } {
  if (at === start && !axis) return { cells: [start] };
  const [r0, c0] = [Math.floor(start / n), start % n];
  const [r1, c1] = [Math.floor(at / n), at % n];
  const line: Axis =
    axis ?? (Math.abs(c1 - c0) >= Math.abs(r1 - r0) ? 'row' : 'column');
  const [from, to] = line === 'row' ? [c0, c1] : [r0, r1];
  const step = to >= from ? 1 : -1;
  const cells: number[] = [];
  for (let k = from; k !== to + step; k += step)
    cells.push(line === 'row' ? r0 * n + k : k * n + c0);
  return { cells, axis: line };
}

// Applies a stroke: a stroke that starts on an empty square colours every
// square it goes over, and one that starts on a coloured square clears them.
export function paint(
  coloured: boolean[],
  cells: number[],
  on: boolean
): boolean[] {
  const next = coloured.slice();
  for (const i of cells) next[i] = on;
  return next;
}

export function isSolved(p: Picture, coloured: boolean[]) {
  return solutionOf(p).every((on, i) => on === coloured[i]);
}

export const pictureById = (d: Difficulty, id: string) =>
  PICTURES[d].find((p) => p.id === id);

// The next picture: one not solved yet if there are any left, and never the
// one just played.
export function pickPicture(
  d: Difficulty,
  solved: string[],
  previous: string | undefined,
  random: () => number
): Picture {
  const all = PICTURES[d];
  const fresh = all.filter((p) => !solved.includes(p.id) && p.id !== previous);
  const pool = fresh.length
    ? fresh
    : all.filter((p) => p.id !== previous || all.length === 1);
  return pool[Math.floor(random() * pool.length)];
}
