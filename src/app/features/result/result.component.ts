import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="result">
      <div class="result__comparison">
        <div class="result__card">
          <span class="result__label">Original</span>
          <div class="result__image-container">
            <img [src]="originalUrl" alt="Original" />
          </div>
        </div>

        <div class="result__card">
          <span class="result__label">Résultat</span>
          <div class="result__image-container result__image-container--checkerboard">
            <img [src]="resultUrl" alt="Background Removed" />
          </div>
        </div>
      </div>

      <div class="result__actions">
        <button mat-flat-button color="primary" (click)="download()">
          <mat-icon>download</mat-icon> Télécharger le PNG
        </button>
        <button mat-stroked-button (click)="reseted.emit()">
          <mat-icon>refresh</mat-icon> Nouvelle image
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
  @Input({ required: true }) originalUrl!: string;
  @Input({ required: true }) resultUrl!: string;
  @Output() reseted = new EventEmitter<void>();

  download(): void {
    const link = document.createElement('a');
    link.href = this.resultUrl;
    link.download = 'remove-bg-result.png';
    link.click();
  }
}
