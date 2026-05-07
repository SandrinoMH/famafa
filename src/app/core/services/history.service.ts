import { Injectable, signal, computed } from '@angular/core';
import { IHistoryEntry } from '../models/history-entry.model';
import { LoggerService } from './logger.service';
import { inject } from '@angular/core';

const STORAGE_KEY = 'famafa_history';
const MAX_ENTRIES = 20;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private logger = inject(LoggerService);

  private _entries = signal<IHistoryEntry[]>(this.loadFromStorage());

  readonly entries = this._entries.asReadonly();
  readonly count = computed(() => this._entries().length);
  readonly isEmpty = computed(() => this._entries().length === 0);

  add(entry: Omit<IHistoryEntry, 'id' | 'processedAt'>): void {
    const newEntry: IHistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      processedAt: new Date().toISOString()
    };

    // Keep only MAX_ENTRIES (most recent first)
    const updated = [newEntry, ...this._entries()].slice(0, MAX_ENTRIES);
    this._entries.set(updated);
    this.saveToStorage(updated);
    this.logger.log('HistoryService: entry added', newEntry.id);
  }

  remove(id: string): void {
    const updated = this._entries().filter(e => e.id !== id);
    this._entries.set(updated);
    this.saveToStorage(updated);
    this.logger.log('HistoryService: entry removed', id);
  }

  clear(): void {
    this._entries.set([]);
    localStorage.removeItem(STORAGE_KEY);
    this.logger.log('HistoryService: history cleared');
  }

  private loadFromStorage(): IHistoryEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(entries: IHistoryEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      this.logger.error('HistoryService: localStorage full, clearing oldest entry');
      // If storage is full, remove oldest half and retry
      const half = entries.slice(0, Math.floor(entries.length / 2));
      this._entries.set(half);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(half));
      } catch { /* ignore */ }
    }
  }
}
