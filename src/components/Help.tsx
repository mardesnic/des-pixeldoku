import type { Strings } from '../lib/i18n';
import { clueOf } from '../lib/pixels';

// One row of a puzzle, drawn like the board: its numbers, then its squares.
function Example({ squares, done }: { squares: string; done?: boolean }) {
  const on = [...squares].map((c) => c === '#');
  const clue = clueOf(on);
  return (
    <div className='example' aria-hidden='true'>
      <div className={done ? 'clue clue--done' : 'clue'}>
        {clue.map((k, i) => (
          <span key={i}>{k}</span>
        ))}
      </div>
      <div className='squares'>
        {on.map((o, i) => (
          <span key={i} className={o ? 'square square--on' : 'square'} />
        ))}
      </div>
    </div>
  );
}

export function Help({ onDone, t }: { onDone: () => void; t: Strings }) {
  return (
    <section className='card help'>
      <h2>{t.howToPlay}</h2>

      <p>{t.helpCount}</p>
      <Example squares='.###.' done />

      <p>{t.helpGroups}</p>
      <Example squares='##.#.' done />

      <p>{t.helpGreen}</p>

      <p>{t.helpTap}</p>

      <button className='button' onClick={onDone}>
        {t.letsPlay}
      </button>
    </section>
  );
}
