import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HistoryService } from '../../core/services/history.service';
import { HistoryCardComponent } from './history-card.component';
import { IHistoryEntry } from '../../core/models/history-entry.model';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, HistoryCardComponent],
  template: `
    <section class="history-panel">
      <div class="history-panel__header">
        <h2>
          <mat-icon>history</mat-icon>
          Historique <span class="history-panel__count">{{ historyService.count() }}</span>
        </h2>
        @if (!historyService.isEmpty()) {
          <button mat-button color="warn" (click)="clearAll()">
            <mat-icon>delete_sweep</mat-icon> Tout effacer
          </button>
        }
      </div>

      <mat-divider></mat-divider>

      @if (historyService.isEmpty()) {
        <div class="history-panel__empty">
          <mat-icon>image_search</mat-icon>
          <p>Aucune image traitée pour l'instant.</p>
        </div>
      } @else {
        <div class="history-panel__grid">
          @for (entry of historyService.entries(); track entry.id) {
            <app-history-card
              [entry]="entry"
              (download)="downloadEntry($event)"
              (remove)="removeEntry($event)"
            ></app-history-card>
          }
        </div>
      }
    </section>
  `,
  styleUrls: ['./history-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPanelComponent {
  historyService = inject(HistoryService);
  private logger = inject(LoggerService);

  downloadEntry(entry: IHistoryEntry): void {
    const link = document.createElement('a');
    link.href = entry.resultDataUrl;
    link.download = `famafa-${entry.fileName.replace(/\.[^.]+$/, '')}.png`;
    link.click();
    this.logger.log('HistoryPanel: downloading entry', entry.id);
  }

  removeEntry(id: string): void {
    this.historyService.remove(id);
  }

  clearAll(): void {
    this.historyService.clear();
  }
}
