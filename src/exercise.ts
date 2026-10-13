import { canPlace, isSolved, newGame } from '../engine/core.ts';
import type { Game, PieceId, Placement } from '../engine/core.ts';
import { tutorialExample } from './teaching-data.ts';

const learnerPieces: readonly PieceId[] = ['brown', 'grey', 'cyan'];
export const fixedPiece = (id: PieceId): boolean => !learnerPieces.includes(id);
type Snapshot = { placed: Game['placed']; history: Game['placed'][] };
export type Exercise = {
  phase: 'running' | 'completed'; game: Game; step: number;
  history: Game['placed'][]; checkpoint: Snapshot;
};

export function beginExercise(): Exercise {
  const game = newGame(tutorialExample.dice, 'STARTER');
  game.placed = Object.fromEntries(tutorialExample.placements.filter(p => fixedPiece(p.id)).map(p => [p.id, { ...p }]));
  return { phase: 'running', game, step: 0, history: [], checkpoint: { placed: game.placed, history: [] } };
}

function atAnswer(game: Game, id: PieceId): boolean {
  const placed = game.placed[id];
  const answer = tutorialExample.placements.find(p => p.id === id)!;
  return Boolean(placed && placed.orientation === answer.orientation && placed.x === answer.x && placed.y === answer.y);
}
function progress(previous: Exercise, placed: Game['placed'], history: Game['placed'][], action: 'commit' | 'undo'): Exercise {
  const game = { ...previous.game, placed };
  if (isSolved(game)) return { ...previous, phase: 'completed', game, history };
  let step = previous.step;
  if (step === 0 && atAnswer(game, 'brown')) step = 1;
  else if (step === 1 && action === 'undo' && atAnswer(previous.game, 'brown') && !placed.brown) step = 2;
  else if (step >= 2) {
    step = !atAnswer(game, 'brown') ? 2 : !atAnswer(game, 'grey') ? 3 : 4;
  }
  const checkpoint = step === previous.step ? previous.checkpoint : { placed, history };
  return { ...previous, game, history, step, checkpoint };
}
export function exercisePlace(exercise: Exercise, placement: Placement): Exercise {
  if (exercise.phase !== 'running' || fixedPiece(placement.id) || !canPlace(exercise.game, placement)) return exercise;
  const old = exercise.game.placed[placement.id];
  if (old && old.orientation === placement.orientation && old.x === placement.x && old.y === placement.y) return exercise;
  return progress(exercise, { ...exercise.game.placed, [placement.id]: { ...placement } }, [...exercise.history, exercise.game.placed], 'commit');
}
export function exerciseRemove(exercise: Exercise, id: PieceId): Exercise {
  if (exercise.phase !== 'running' || fixedPiece(id) || !exercise.game.placed[id]) return exercise;
  const placed = { ...exercise.game.placed };
  delete placed[id];
  return progress(exercise, placed, [...exercise.history, exercise.game.placed], 'commit');
}
export function exerciseUndo(exercise: Exercise): Exercise {
  if (exercise.phase !== 'running' || !exercise.history.length) return exercise;
  return progress(exercise, exercise.history[exercise.history.length - 1], exercise.history.slice(0, -1), 'undo');
}
export function resetStep(exercise: Exercise): Exercise {
  if (exercise.phase !== 'running') return exercise;
  return { ...exercise, game: { ...exercise.game, placed: exercise.checkpoint.placed }, history: exercise.checkpoint.history };
}
export function exerciseInstruction(exercise: Exercise): string {
  if (exercise.phase === 'completed') return 'Exercise complete! All nine pieces fit. Choose Play, review the tutorial or redo the exercise.';
  return [
    'Select Brown domino, then tap B1. Its + lands on B1; it covers B1 and C1.',
    'Undo your Brown domino placement. The six prepared pieces stay fixed.',
    'Place Brown domino at B1 again.',
    'Select Grey line, Rotate once, then tap F3 to fill F3 through F6.',
    'Select Cyan L, Flip once, Rotate twice, then tap E3. Its + is now the bottom square; it covers E1, F1, E2 and E3.',
  ][exercise.step] + ' Legal moves are accepted. Reset step restores this task’s starting board.';
}
export function exerciseTarget(exercise: Exercise): string | undefined {
  if (exercise.phase === 'completed' || exercise.step === 1) return;
  return exercise.step < 3 ? 'B1' : exercise.step === 3 ? 'F3' : 'E3';
}
