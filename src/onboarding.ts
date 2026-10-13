type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
export const ONBOARDING_KEY = 'rollmino.onboarding.v1';

/** Remember only that this optional offer was handled, never lesson progress. */
export function tutorialOffer(storage?: Storage) {
  let handled = false;
  try { handled = storage?.getItem(ONBOARDING_KEY) === 'handled'; } catch { /* Offer again. */ }
  return {
    get offered() { return !handled; },
    handle() {
      if (handled) return;
      handled = true;
      try { storage?.setItem(ONBOARDING_KEY, 'handled'); } catch { /* This page still remembers the choice. */ }
    },
  };
}
