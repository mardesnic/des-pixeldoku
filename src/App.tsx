import { useEffect, useState } from 'react';

import { Icon } from './components/Icon';
import { NewGame, SettingsView } from './components/Menu';
import {
  initialSettings,
  initialStats,
  type Difficulty,
  type Settings,
  type Stats,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { popMenu, pushMenu, useBackButton } from './lib/use-back-button';
import { useStoredState } from './lib/use-stored-state';
import { useWakeLock } from './lib/use-wake-lock';

type View = 'play' | 'new' | 'settings';

// A placeholder until the puzzle is built: picking a level shows an empty
// grid of that size.
const SIZES: Record<Difficulty, number> = {
  tiny: 5,
  small: 6,
  medium: 8,
  big: 10,
};

export default function App() {
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<{ difficulty?: Difficulty }>(
    'pixels',
    {}
  );
  const { difficulty } = store;
  const [settings, setSettings] = useStoredState<Settings>(
    'pixels-settings',
    initialSettings
  );
  const [stats] = useStoredState<Stats>('pixels-stats', initialStats);
  const [view, setViewState] = useState<View>(difficulty ? 'play' : 'new');
  // Menus open over the game, so the phone's Back button closes them.
  const setView = (next: View) => {
    if (next === 'play') popMenu();
    else pushMenu();
    setViewState(next);
  };
  useBackButton(() => {
    if (difficulty) setViewState('play');
  });
  useWakeLock();

  const lang = settings.language === 'auto' ? detectLang() : settings.language;
  const t = STRINGS[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
  }, [lang, t]);

  const start = (d: Difficulty) => {
    setStore({ difficulty: d });
    setView('play');
  };

  const size = difficulty ? SIZES[difficulty] : 0;

  return (
    <main className={view === 'play' && difficulty ? 'app app--play' : 'app'}>
      <header className='header'>
        <h1>{t.title}</h1>
        <div className='header__actions'>
          {view === 'play' ? (
            <>
              <button
                className='button button--small'
                onClick={() => setView('new')}
              >
                {t.newGame}
              </button>
              <button
                className='button button--small'
                onClick={() => setView('settings')}
              >
                {t.settings}
              </button>
            </>
          ) : (
            difficulty && (
              <button
                className='button button--small'
                onClick={() => setView('play')}
              >
                {view === 'new' ? t.cancel : t.done}
              </button>
            )
          )}
        </div>
      </header>

      {view === 'new' && <NewGame onStart={start} t={t} />}
      {view === 'settings' && (
        <SettingsView
          settings={settings}
          setSettings={setSettings}
          stats={stats}
          t={t}
        />
      )}

      {view === 'play' && difficulty && (
        <>
          <div className='stage'>
            <div
              className='grid'
              style={{ '--size': size } as React.CSSProperties}
            >
              {Array.from({ length: size * size }, (_, i) => (
                <span key={i} className='square' />
              ))}
            </div>
          </div>

          <div className='bar'>
            <p className='goal'>{t.goal}</p>
            <div className='tools'>
              <button className='tool' disabled aria-label={t.undo}>
                <Icon name='undo' />
              </button>
              <button className='tool' disabled aria-label={t.clear}>
                <Icon name='clear' />
              </button>
            </div>
          </div>
        </>
      )}

      {view === 'settings' && (
        <footer className='footer'>
          <a href='https://github.com/mardesnic/des-pixels'>{t.source}</a>
        </footer>
      )}
    </main>
  );
}
