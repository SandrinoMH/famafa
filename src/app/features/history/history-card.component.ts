import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IHistoryEntry } from '../../core/models/history-entry.model';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-history-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, DatePipe, FileSizePipe],
  template: `
    <div class="history-card">
      <div class="history-card__images">
        <img
          class="history-card__thumb"
          [src]="entry.originalDataUrl"
          alt="Original"
          [matTooltip]="'Original'"
        />
        <mat-icon class="history-card__arrow">arrow_forward</mat-icon>
        <div class="history-card__result-wrap">
          <img
            class="history-card__thumb history-card__thumb--result"
            [src]="entry.resultDataUrl"
            alt="Résultat"
            [matTooltip]="'Résultat'"
          />
        </div>
      </div>

      <div class="history-card__info">
        <p class="history-card__name" [matTooltip]="entry.fileName">{{ entry.fileName }}</p>
        <p class="history-card__meta">
          {{ entry.processedAt | date:'dd/MM/yyyy HH:mm' }}
          &bull; {{ entry.fileSize | fileSize }}
        </p>
      </div>

      <div class="history-card__actions">
        <button
          mat-icon-button
          color="primary"
          [matTooltip]="'Télécharger'"
          (click)="download.emit(entry)"
        >
          <mat-icon>download</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [matTooltip]="'Supprimer'"
          (click)="remove.emit(entry.id)"
        >
          <mat-icon>delete_outline</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./history-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryCardComponent {
  @Input({ required: true }) entry!: IHistoryEntry;
  @Output() download = new EventEmitter<IHistoryEntry>();
  @Output() remove = new EventEmitter<string>();
}
