import { useMemo, useRef, useState, type CSSProperties } from 'react';

import type { Strings } from '../lib/i18n';
import { PALETTE, type Picture } from '../lib/pictures';
import {
  cluesOf,
  colourAt,
  columnOf,
  groupsDone,
  lineFits,
  lineDone,
  paint,
  rowOf,
  sizeOf,
  strokeCells,
  type Axis,
} from '../lib/pixels';

// A line's numbers, each a little block like a group of coloured squares,
// with a gap between them like the gap between groups. Each turns green
// when its group is in place.
function Clue({ line, clue }: { line: boolean[]; clue: number[] }) {
  const done = groupsDone(line, clue);
  const all = lineDone(
    line,
    line.map((_, i) => i),
    clue
  );
  const wrong = !lineFits(line, clue);
  return (
    <div
      className={all ? 'clue clue--done' : wrong ? 'clue clue--wrong' : 'clue'}
    >
      {clue.length ? (
        clue.map((k, i) => (
          <span
            key={i}
            className={done[i] || all ? 'group group--done' : 'group'}
          >
            {k}
          </span>
        ))
      ) : (
        <span className='group group--none'>0</span>
      )}
    </div>
  );
}

type Stroke = { start: number; axis?: Axis; on: boolean; cells: number[] };

export function Board({
  picture,
  coloured,
  solved,
  onStroke,
  t,
}: {
  picture: Picture;
  coloured: boolean[];
  solved: boolean;
  onStroke: (cells: number[], on: boolean) => void;
  t: Strings;
}) {
  const n = sizeOf(picture);
  const clues = useMemo(() => cluesOf(picture), [picture]);
  const across = Math.max(1, ...clues.rows.map((c) => c.length));
  const down = Math.max(1, ...clues.columns.map((c) => c.length));

  const squares = useRef<HTMLDivElement>(null);
  const [stroke, setStroke] = useState<Stroke | null>(null);
  // While a finger is down, the stroke shows before it is played.
  const shown = stroke ? paint(coloured, stroke.cells, stroke.on) : coloured;

  const squareAt = (x: number, y: number) => {
    const box = squares.current!.getBoundingClientRect();
    const clamp = (v: number) => Math.min(n - 1, Math.max(0, Math.floor(v)));
    const c = clamp(((x - box.left) / box.width) * n);
    const r = clamp(((y - box.top) / box.height) * n);
    return r * n + c;
  };

  const onDown = (e: React.PointerEvent) => {
    if (solved || stroke || !e.isPrimary) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = squareAt(e.clientX, e.clientY);
    setStroke({ start, on: !coloured[start], cells: [start] });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!stroke || !e.isPrimary) return;
    const at = squareAt(e.clientX, e.clientY);
    const next = strokeCells(n, stroke.start, at, stroke.axis);
    if (next.cells.length !== stroke.cells.length || at !== next.cells.at(-1))
      setStroke({ ...stroke, ...next, axis: next.axis ?? stroke.axis });
  };

  const onUp = (e: React.PointerEvent) => {
    if (!stroke || !e.isPrimary) return;
    onStroke(stroke.cells, stroke.on);
    setStroke(null);
  };

  return (
    <div
      className={solved ? 'board board--solved' : 'board'}
      style={
        {
          '--n': n,
          '--across': across,
          '--down': down,
        } as CSSProperties
      }
    >
      <div className='clues clues--columns' aria-hidden='true'>
        {clues.columns.map((clue, c) => (
          <Clue
            key={c}
            line={columnOf(n, c).map((i) => shown[i])}
            clue={clue}
          />
        ))}
      </div>

      <div className='clues clues--rows' aria-hidden='true'>
        {clues.rows.map((clue, r) => (
          <Clue key={r} line={rowOf(n, r).map((i) => shown[i])} clue={clue} />
        ))}
      </div>

      <div
        ref={squares}
        className='squares'
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => setStroke(null)}
      >
        {shown.map((on, i) => (
          <span
            key={i}
            className={on ? 'square square--on' : 'square'}
            role='img'
            aria-label={on ? t.coloured : t.blank}
          />
        ))}

        {solved && (
          <svg
            className='picture'
            viewBox={`0 0 ${n} ${n}`}
            shapeRendering='crispEdges'
            aria-hidden='true'
          >
            {Array.from({ length: n * n }, (_, i) => {
              const c = colourAt(picture, i);
              return (
                c && (
                  <rect
                    key={i}
                    x={i % n}
                    y={Math.floor(i / n)}
                    width={1.02}
                    height={1.02}
                    fill={PALETTE[c]}
                  />
                )
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
