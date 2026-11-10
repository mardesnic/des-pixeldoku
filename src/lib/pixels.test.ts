import { describe, expect, it } from 'vitest';

import { initialStats, newGame, recordWin, withStroke } from './game';
import type { Picture } from './pictures';
import {
  COLOUR,
  DOT,
  EMPTY,
  clueOf,
  cluesOf,
  isSolved,
  lineDone,
  paint,
  pickPicture,
  solve,
  solveLine,
  strokeCells,
  strokeMark,
  type Mark,
} from './pixels';

const picture = (rows: string[]): Picture => ({
  id: 'test',
  name: { en: 'a test', hr: 'test' },
  rows,
});

describe('clues', () => {
  it('count the runs of coloured squares', () => {
    expect(clueOf([true, true, false, true, false])).toEqual([2, 1]);
    expect(clueOf([false, false])).toEqual([]);
    expect(clueOf([true, true, true])).toEqual([3]);
  });

  it('are made for every row and column', () => {
    expect(cluesOf(picture(['#.', '##']))).toEqual({
      rows: [[1], [2]],
      columns: [[2], [1]],
    });
  });

  it('say a line is done when its coloured squares match', () => {
    const marks: Mark[] = [COLOUR, DOT, COLOUR];
    expect(lineDone(marks, [0, 1, 2], [1, 1])).toBe(true);
    expect(lineDone(marks, [0, 1, 2], [2])).toBe(false);
    expect(lineDone([EMPTY, EMPTY], [0, 1], [])).toBe(true);
  });
});

describe('solving', () => {
  it('fills the squares every placement shares', () => {
    // A 3 in 5 squares always covers the middle one.
    expect(solveLine([-1, -1, -1, -1, -1], [3])).toEqual([-1, -1, 1, -1, -1]);
    expect(solveLine([-1, -1, -1], [1, 1])).toEqual([1, 0, 1]);
    expect(solveLine([-1, 1, -1, -1], [1])).toEqual([0, 1, 0, 0]);
    expect(solveLine([-1, -1], [])).toEqual([0, 0]);
  });

  it('finds nothing when the clue cannot fit', () => {
    expect(solveLine([1, 1, 1], [1])).toBeNull();
  });

  it('solves a picture line by line', () => {
    const p = picture(['.#.', '###', '.#.']);
    expect(solve(cluesOf(p))).toEqual([
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
    ]);
  });

  it('gives up on a picture with two answers', () => {
    // A diagonal: its clues fit the other diagonal just as well.
    expect(solve(cluesOf(picture(['#.', '.#'])))).toBeNull();
  });
});

describe('strokes', () => {
  it('cover one square on a tap', () => {
    expect(strokeCells(5, 7, 7)).toEqual({ cells: [7] });
  });

  it('follow the row or column of the first move', () => {
    expect(strokeCells(5, 6, 8)).toEqual({ cells: [6, 7, 8], axis: 'row' });
    expect(strokeCells(5, 6, 16)).toEqual({
      cells: [6, 11, 16],
      axis: 'column',
    });
    // Leaning off a row keeps to the row.
    expect(strokeCells(5, 6, 13, 'row').cells).toEqual([6, 7, 8]);
    expect(strokeCells(5, 8, 6).cells).toEqual([8, 7, 6]);
  });

  it('rub out when they start on the same mark', () => {
    expect(strokeMark(COLOUR, COLOUR)).toBe(EMPTY);
    expect(strokeMark(DOT, COLOUR)).toBe(COLOUR);
    expect(strokeMark(EMPTY, DOT)).toBe(DOT);
  });

  it('fill empty squares and leave other marks', () => {
    const marks: Mark[] = [DOT, EMPTY, DOT, COLOUR];
    expect(paint(marks, [0, 1, 2, 3], COLOUR, COLOUR)).toEqual([
      COLOUR,
      COLOUR,
      DOT,
      COLOUR,
    ]);
    expect(paint(marks, [0, 1, 2, 3], EMPTY, DOT)).toEqual([
      EMPTY,
      EMPTY,
      EMPTY,
      COLOUR,
    ]);
  });

  it('solve the picture when the coloured squares match', () => {
    const p = picture(['#.', '##']);
    expect(isSolved(p, [COLOUR, DOT, COLOUR, COLOUR])).toBe(true);
    expect(isSolved(p, [COLOUR, COLOUR, COLOUR, COLOUR])).toBe(false);
  });
});

describe('picking', () => {
  it('prefers pictures not solved yet', () => {
    const ids = ['heart', 'house', 'tree', 'smile', 'mushroom', 'cat-face'];
    const solved = [...ids, 'sun'];
    expect(pickPicture('tiny', solved, undefined, () => 0).id).toBe('umbrella');
  });

  it('never repeats the last picture', () => {
    for (let k = 0; k < 20; k++)
      expect(pickPicture('tiny', [], 'heart', () => k / 20).id).not.toBe(
        'heart'
      );
  });
});

describe('a game', () => {
  const p = picture(['#.', '##']);

  it('is solved by the stroke that finishes the picture', () => {
    let game = newGame('tiny', p);
    game = withStroke(game, p, [0], COLOUR);
    expect(game.solved).toBe(false);
    game = withStroke(game, p, [2, 3], COLOUR);
    expect(game.solved).toBe(true);
  });

  it('stays the same after a stroke that changes nothing', () => {
    const game = newGame('tiny', p);
    expect(withStroke(game, p, [0], EMPTY)).toBe(game);
  });

  it('counts each picture once', () => {
    const game = { ...newGame('tiny', p), solved: true };
    const once = recordWin(initialStats, game);
    expect(once.tiny).toEqual(['test']);
    expect(recordWin(once, game)).toBe(once);
  });
});
