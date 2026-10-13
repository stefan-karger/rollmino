import { canPlace, isSolved, newGame, rollDice } from '../engine/core.ts';
import type { Game, Level, PieceId, Placement } from '../engine/core.ts';

type Mode = 'ranked' | 'practice';
type Ready = { phase: 'ready'; level: Level } & (
  { mode: 'ranked' } | { mode: 'practice'; dice: readonly string[] }
);
type Running = {
  phase: 'running'; level: Level; mode: Mode; game: Game;
  startedAt: number; history: Game['placed'][];
};
type Completed = {
  phase: 'completed'; level: Level; mode: Mode; game: Game;
  elapsedMs: number; finishedAt: number;
};
export type Session = Ready | Running | Completed;

export function freshSession(level: Level = 'STARTER'): Session {
  return { phase: 'ready', mode: 'ranked', level };
}

export function start(session: Session, now: number, random: () => number = Math.random): Session {
  if (session.phase !== 'ready') return session;
  const dice = session.mode === 'ranked' ? rollDice(random) : session.dice;
  return {
    phase: 'running', mode: session.mode, level: session.level,
    game: newGame(dice, session.level), startedAt: now, history: [],
  };
}

export function elapsed(session: Session, now: number): number {
  if (session.phase === 'ready') return 0;
  return session.phase === 'completed' ? session.elapsedMs : Math.max(0, now - session.startedAt);
}

export function formatTime(ms: number): string {
  const centiseconds = Math.floor(Math.max(0, ms) / 10);
  const minutes = Math.floor(centiseconds / 6000);
  const seconds = Math.floor(centiseconds / 100) % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds % 100).padStart(2, '0')}`;
}

function commit(session: Running, placed: Game['placed'], now: number): Session {
  const game = { ...session.game, placed };
  if (isSolved(game)) {
    return {
      phase: 'completed', mode: session.mode, level: session.level, game,
      elapsedMs: elapsed(session, now), finishedAt: now,
    };
  }
  return { ...session, game, history: [...session.history, session.game.placed] };
}

export function place(session: Session, placement: Placement, now: number): Session {
  if (session.phase !== 'running' || !canPlace(session.game, placement)) return session;
  const old = session.game.placed[placement.id];
  if (old && old.orientation === placement.orientation && old.x === placement.x && old.y === placement.y) {
    return session;
  }
  return commit(session, { ...session.game.placed, [placement.id]: { ...placement } }, now);
}

export function remove(session: Session, id: PieceId, now: number): Session {
  if (session.phase !== 'running' || !session.game.placed[id]) return session;
  const placed = { ...session.game.placed };
  delete placed[id];
  return commit(session, placed, now);
}

export function undo(session: Session): Session {
  if (session.phase !== 'running' || session.history.length === 0) return session;
  return {
    ...session, game: { ...session.game, placed: session.history[session.history.length - 1] },
    history: session.history.slice(0, -1),
  };
}

/** Call only after any required abandonment confirmation has been accepted. */
export function replay(session: Session): Session {
  if (session.phase === 'ready') return session;
  return { phase: 'ready', mode: 'practice', level: session.level, dice: [...session.game.dice] };
}
