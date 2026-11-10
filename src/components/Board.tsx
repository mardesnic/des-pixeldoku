import { useMemo, useRef, useState, type CSSProperties } from 'react';

import type { Strings } from '../lib/i18n';
import { PALETTE, type Picture } from '../lib/pictures';
import {
  COLOUR,
  DOT,
  cluesOf,
  colourAt,
  columnOf,
  lineDone,
  paint,
  rowOf,
  sizeOf,
  strokeCells,
  strokeMark,
  type Axis,
  type Mark,
  type Tool,
} from '../lib/pixels';

type Stroke = { start: number; axis?: Axis; mark: Mark; cells: number[] };

export function Board({
  picture,
  marks,
  tool,
  solved,
  onStroke,
  t,
}: {
  picture: Picture;
  marks: Mark[];
  tool: Tool;
  solved: boolean;
  onStroke: (cells: number[], mark: Mark) => void;
  t: Strings;
}) {
  const n = sizeOf(picture);
  const clues = useMemo(() => cluesOf(picture), [picture]);
  const across = Math.max(1, ...clues.rows.map((c) => c.length));
  const down = Math.max(1, ...clues.columns.map((c) => c.length));

  const squares = useRef<HTMLDivElement>(null);
  const [stroke, setStroke] = useState<Stroke | null>(null);
  // While a finger is down, the stroke shows before it is played.
  const shown = stroke ? paint(marks, stroke.cells, stroke.mark, tool) : marks;

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
    setStroke({ start, mark: strokeMark(marks[start], tool), cells: [start] });
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
    onStroke(stroke.cells, stroke.mark);
    setStroke(null);
  };

  const label = (m: Mark) =>
    m === COLOUR ? t.coloured : m === DOT ? t.dotted : t.blank;

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
          <div
            key={c}
            className={
              lineDone(shown, columnOf(n, c), clue) ? 'clue clue--done' : 'clue'
            }
          >
            {(clue.length ? clue : [0]).map((k, i) => (
              <span key={i}>{k}</span>
            ))}
          </div>
        ))}
      </div>

      <div className='clues clues--rows' aria-hidden='true'>
        {clues.rows.map((clue, r) => (
          <div
            key={r}
            className={
              lineDone(shown, rowOf(n, r), clue) ? 'clue clue--done' : 'clue'
            }
          >
            {(clue.length ? clue : [0]).map((k, i) => (
              <span key={i}>{k}</span>
            ))}
          </div>
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
        {shown.map((m, i) => (
          <span
            key={i}
            className={`square square--${m}`}
            role='img'
            aria-label={label(m)}
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
