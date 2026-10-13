import { RESTRICTED } from '../engine/core.ts';
import type { Level } from '../engine/core.ts';

export type RunRecord = { elapsedMs: number; finishedAt: number };
type Lists = Record<Level, RunRecord[]>;
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
export const RECORDS_KEY = 'rollmino.records.v1';
const levels = Object.keys(RESTRICTED) as Level[];
const unavailable = 'Records are kept for this page only and will not survive reload.';
const recovered = 'Invalid saved records were discarded.';

function empty(): Lists {
  return { STARTER: [], JUNIOR: [], EXPERT: [], MASTER: [], WIZARD: [] };
}

function validRecord(value: unknown): value is RunRecord {
  if (!value || typeof value !== 'object') return false;
  const entry = value as RunRecord;
  return Number.isSafeInteger(entry.elapsedMs) && entry.elapsedMs >= 0
    && Number.isSafeInteger(entry.finishedAt) && Number.isFinite(new Date(entry.finishedAt).getTime());
}

function rank(entries: RunRecord[]): RunRecord[] {
  return entries.sort((a, b) => a.elapsedMs - b.elapsedMs || a.finishedAt - b.finishedAt).slice(0, 5);
}

/** Owns only the current page's record lists and the concrete localStorage operations. */
export class Records {
  lists: Lists = empty();
  notice = '';
  private storage: Storage | undefined;

  constructor(storage?: Storage) {
    this.storage = storage;
    if (!storage) this.notice = unavailable;
    this.read();
  }

  private read(): void {
    if (!this.storage) return;
    let raw: string | null;
    try {
      raw = this.storage.getItem(RECORDS_KEY);
    } catch {
      this.storage = undefined;
      this.notice = unavailable;
      return;
    }
    const lists = empty();
    if (raw === null) {
      this.lists = lists;
      return;
    }
    try {
      const payload: unknown = JSON.parse(raw);
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw Error('payload');
      let discarded = false;
      for (const level of levels) {
        const entries = (payload as Record<string, unknown>)[level];
        if (entries === undefined) continue;
        if (!Array.isArray(entries)) throw Error('list');
        for (const entry of entries) {
          if (!validRecord(entry)) {
            discarded = true;
            continue;
          }
          lists[level].push({ elapsedMs: entry.elapsedMs, finishedAt: entry.finishedAt });
        }
        lists[level] = rank(lists[level]);
      }
      this.notice = discarded ? recovered : '';
      this.lists = lists;
    } catch {
      this.lists = empty();
      this.notice = recovered;
    }
  }

  private write(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(RECORDS_KEY, JSON.stringify(this.lists));
    } catch {
      this.storage = undefined;
      this.notice = unavailable;
    }
  }

  insert(level: Level, record: RunRecord): void {
    if (!validRecord(record)) throw Error('Expected valid whole-millisecond record.');
    this.read();
    this.lists[level] = rank([...this.lists[level], { ...record }]);
    this.write();
  }

  clear(level: Level): void {
    this.read();
    this.lists[level] = [];
    this.write();
  }
}
