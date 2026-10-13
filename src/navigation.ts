export type Screen = 'home' | 'game' | 'records' | 'tutorial';
type Entry = { rollmino: true; index: number; screen: Screen };

function entry(value: unknown): Entry | undefined {
  if (!value || typeof value !== 'object') return;
  const state = value as Partial<Entry>;
  if (state.rollmino === true && Number.isInteger(state.index) && state.index! >= 0
    && (state.screen === 'home' || state.screen === 'game' || state.screen === 'records' || state.screen === 'tutorial')) return state as Entry;
}

/** Only screens live in history. A history entry never contains a run. */
export function navigation(enter: (screen: Screen) => void,
  leave: (accept: () => void) => void, ready: () => void) {
  let current: Entry = { rollmino: true, index: 0, screen: 'home' };
  let restoring: (() => void) | undefined;
  let deciding = false;
  let approved: Entry | undefined;
  const replaceRoot = () => { history.replaceState(current, ''); ready(); };

  window.addEventListener('popstate', event => {
    const target = entry(event.state);
    if (!target) return;
    if (approved) {
      if (target.index !== approved.index) { history.go(approved.index - target.index); return; }
      current = approved;
      approved = undefined;
      enter(current.screen);
      return;
    }
    if (restoring || deciding) {
      if (target.index !== current.index) {
        history.go(current.index - target.index);
        return;
      }
      const done = restoring;
      restoring = undefined;
      done?.();
      return;
    }
    if (target.index === current.index) return;
    if (current.screen === 'game') {
      // Reconcile before asking. Cancel leaves the cursor and committed game intact.
      deciding = true;
      restoring = () => leave(() => {
        deciding = false;
        approved = target;
        history.go(target.index - current.index);
      });
      history.go(current.index - target.index);
      return;
    }
    current = target;
    enter(target.screen);
  });

  const previous = entry(history.state);
  if (previous && previous.index > 0) {
    restoring = replaceRoot;
    history.go(-previous.index);
  } else replaceRoot();

  return {
    open(screen: Exclude<Screen, 'home'>) {
      if (restoring || deciding || approved || current.screen !== 'home') return;
      current = { rollmino: true, index: 1, screen };
      history.pushState(current, '');
      enter(screen);
    },
    home() {
      if (!restoring && !deciding && !approved && current.screen !== 'home') history.go(-current.index);
    },
    play() {
      if (restoring || deciding || approved || current.screen !== 'tutorial') return;
      current = { ...current, screen: 'game' };
      history.replaceState(current, '');
      enter('game');
    },
    cancel() { deciding = false; },
  };
}
