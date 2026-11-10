import { describe, expect, it } from 'vitest';

import { DIFFICULTIES } from './game';
import { PALETTE, PICTURES } from './pictures';
import { cluesOf, solutionOf, solve } from './pixels';

const SIZES = { tiny: 5, small: 6, medium: 8, big: 10 };

describe('pictures', () => {
  const all = DIFFICULTIES.flatMap((d) => PICTURES[d]);

  it('have ids of their own', () => {
    const ids = all.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('have a name in every language', () => {
    for (const p of all) {
      expect(p.name.en, p.id).toBeTruthy();
      expect(p.name.hr, p.id).toBeTruthy();
    }
  });

  for (const d of DIFFICULTIES)
    describe(d, () => {
      it('has pictures', () => expect(PICTURES[d].length).toBeGreaterThan(0));

      for (const p of PICTURES[d])
        it(`${p.id} is square, in colours we have, and solvable`, () => {
          const n = SIZES[d];
          expect(p.rows).toHaveLength(n);
          for (const row of p.rows) {
            expect(row).toHaveLength(n);
            for (const c of row)
              expect(c === '.' || c in PALETTE, c).toBe(true);
          }
          expect(solve(cluesOf(p))).toEqual(solutionOf(p));
        });
    });
});
