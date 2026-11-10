import { useEffect, useState } from 'react';

import { Board } from './components/Board';
import { Confetti } from './components/Confetti';
import { Icon } from './components/Icon';
import { NewGame, SettingsView } from './components/Menu';
import {
  initialSettings,
  initialStats,
  newGame,
  recordWin,
  withStroke,
  type Difficulty,
  type Game,
  type Settings,
  type Stats,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import {
  COLOUR,
  DOT,
  pickPicture,
  pictureById,
  type Mark,
  type Tool,
} from './lib/pixels';
import { popMenu, pushMenu, useBackButton } from './lib/use-back-button';
import { useCheer } from './lib/use-cheer';
import { useStoredState } from './lib/use-stored-state';
import { useWakeLock } from './lib/use-wake-lock';

type View = 'play' | 'new' | 'settings';

export default function App() {
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<{ game?: Game }>('pixels', {});
  // A saved game whose picture has since been taken out is dropped.
  const picture =
    store.game && pictureById(store.game.difficulty, store.game.picture);
  const game = picture ? store.game : undefined;
  const [settings, setSettings] = useStoredState<Settings>(
    'pixels-settings',
    initialSettings
  );
  const [stats, setStats] = useStoredState<Stats>('pixels-stats', initialStats);
  const [view, setViewState] = useState<View>(game ? 'play' : 'new');
  // Menus open over the game, so the phone's Back button closes them.
  const setView = (next: View) => {
    if (next === 'play') popMenu();
    else pushMenu();
    setViewState(next);
  };
  useBackButton(() => {
    if (game) setViewState('play');
  });
  const [history, setHistory] = useState<Game[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  useWakeLock();
  const cheer = useCheer(settings.sound);

  const lang = settings.language === 'auto' ? detectLang() : settings.language;
  const t = STRINGS[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
  }, [lang, t]);

  const start = (d: Difficulty) => {
    const previous = game?.difficulty === d ? game.picture : undefined;
    const next = pickPicture(d, stats[d], previous, Math.random);
    setStore({ game: newGame(d, next) });
    setHistory([]);
    setView('play');
  };

  const play = (next: Game) => {
    if (!game || next === game) return;
    setHistory((h) => [...h, game]);
    setStore({ game: next });
  };

  const onStroke = (cells: number[], mark: Mark) => {
    if (!game || !picture) return;
    const next = withStroke(game, picture, cells, mark);
    if (next.solved) {
      setStats(recordWin(stats, next));
      setCelebrating(true);
      cheer();
    }
    play(next);
  };

  const setTool = (tool: Tool) => {
    if (game) setStore({ game: { ...game, tool } });
  };

  const undo = () => {
    if (!game || game.solved || !history.length) return;
    // Undo takes back marks, not a change of tool.
    setStore({ game: { ...history.at(-1)!, tool: game.tool } });
    setHistory((h) => h.slice(0, -1));
  };

  const clear = () => {
    if (!game || !picture || game.solved) return;
    play({ ...newGame(game.difficulty, picture), tool: game.tool });
  };

  const blank = !game?.marks.some(Boolean);

  return (
    <main className={view === 'play' && game ? 'app app--play' : 'app'}>
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
            game && (
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

      {view === 'play' && game && picture && (
        <>
          <div className='stage'>
            <Board
              // A new picture starts with no stroke under way.
              key={picture.id}
              picture={picture}
              marks={game.marks}
              tool={game.tool}
              solved={game.solved}
              onStroke={onStroke}
              t={t}
            />
          </div>

          {game.solved ? (
            <section className='card solved'>
              <h2>{t.solved}</h2>
              <p className='solved__name'>{t.itsA(picture.name[lang])}</p>
              <div className='solved__actions'>
                <button
                  className='button'
                  onClick={() => start(game.difficulty)}
                >
                  {t.next}
                </button>
                <button
                  className='button button--secondary'
                  onClick={() => setView('new')}
                >
                  {t.changeLevel}
                </button>
              </div>
            </section>
          ) : (
            <div className='bar'>
              <div className='switch'>
                {([COLOUR, DOT] as const).map((tool) => (
                  <button
                    key={tool}
                    aria-pressed={game.tool === tool}
                    onClick={() => setTool(tool)}
                  >
                    <span
                      className={
                        tool === COLOUR
                          ? 'switch__mark switch__mark--colour'
                          : 'switch__mark switch__mark--dot'
                      }
                    />
                    {tool === COLOUR ? t.colour : t.dot}
                  </button>
                ))}
              </div>
              <div className='tools'>
                <button
                  className='tool'
                  onClick={undo}
                  disabled={!history.length}
                  aria-label={t.undo}
                >
                  <Icon name='undo' />
                </button>
                <button
                  className='tool'
                  onClick={clear}
                  disabled={blank}
                  aria-label={t.clear}
                >
                  <Icon name='clear' />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'settings' && (
        <footer className='footer'>
          <a href='https://github.com/mardesnic/des-pixels'>{t.source}</a>
        </footer>
      )}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
