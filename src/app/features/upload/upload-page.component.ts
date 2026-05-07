import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UploadZoneComponent } from './upload-zone.component';
import { ResultComponent } from '../result/result.component';
import { HistoryPanelComponent } from '../history/history-panel.component';
import { FileValidationService } from '../../core/services/file-validation.service';
import { ImageProcessingService } from '../../core/services/image-processing.service';
import { HistoryService } from '../../core/services/history.service';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    UploadZoneComponent,
    ResultComponent,
    HistoryPanelComponent
  ],
  template: `
    <div class="upload-page">
      <header class="upload-page__header">
        <h1>Supprimer le fond d'image</h1>
        <p>Téléchargez une image pour enlever le fond instantanément et gratuitement.</p>
      </header>

      <main class="upload-page__content">
        @if (!currentResult()) {
          <app-upload-zone (fileSelected)="handleFile($event)"></app-upload-zone>
        }

        @if (isLoading()) {
          <div class="upload-page__loader">
            <div class="progress-info">
              <span>{{ processingStatus() }}</span>
              <span>{{ processingProgress() }}%</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="processingProgress()"></mat-progress-bar>
            <p class="loader-tip">C'est la première fois ? Le modèle IA (80Mo) est en cours de chargement...</p>
          </div>
        }

        @if (currentResult()) {
          <app-result
            [originalUrl]="originalUrl()!"
            [resultUrl]="resultUrl()!"
            (reseted)="reset()"
          ></app-result>
        }
      </main>

      <app-history-panel></app-history-panel>
    </div>
  `,
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
  private validationService = inject(FileValidationService);
  private processingService = inject(ImageProcessingService);
  private historyService = inject(HistoryService);
  private logger = inject(LoggerService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  processingProgress = signal(0);
  processingStatus = signal('Initialisation...');
  originalUrl = signal<string | null>(null);
  resultUrl = signal<string | null>(null);
  currentResult = signal<Blob | null>(null);
  private currentFileName = signal<string>('image');
  private currentFileSize = signal<number>(0);

  async handleFile(file: File): Promise<void> {
    const validation = this.validationService.validate(file);
    if (!validation.valid) {
      this.snackBar.open(validation.error!, 'Fermer', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);
    this.currentFileName.set(file.name);
    this.currentFileSize.set(file.size);
    this.originalUrl.set(URL.createObjectURL(file));

    try {
      this.logger.log('Optimisation de l\'image (Haute Résolution)...');
      const compressedFile = await this.processingService.compressImage(file, 2000);

      this.logger.log('Traitement IA local (Navigateur)...');
      this.processingProgress.set(0);
      
      this.processingService.removeBackground(compressedFile, (status, progress) => {
        // Map status to French
        const statusMap: {[key: string]: string} = {
          'fetch': 'Téléchargement du modèle...',
          'compute': 'Calcul en cours...',
          'process': 'Traitement de l\'image...',
          'complete': 'Terminé !'
        };
        this.processingStatus.set(statusMap[status] || 'Traitement...');
        this.processingProgress.set(Math.round(progress * 100));
      }).subscribe({
        next: async (blob) => {
          this.currentResult.set(blob);
          const resultBlobUrl = URL.createObjectURL(blob);
          this.resultUrl.set(resultBlobUrl);
          this.isLoading.set(false);

          // Save thumbnails to history (compressed to 200px to fit localStorage)
          try {
            const [originalThumb, resultThumb] = await Promise.all([
              this.createThumbnail(compressedFile, 200, 'image/jpeg'),
              this.createThumbnail(blob, 200, 'image/png') // PNG to keep transparency
            ]);
            
            this.historyService.add({
              fileName: this.currentFileName(),
              originalDataUrl: originalThumb,
              resultDataUrl: resultThumb,
              fileSize: this.currentFileSize()
            });
            this.logger.log('History entry added successfully');
          } catch (err) {
            this.logger.error('Failed to save to history', err);
          }
        },
        error: (err) => {
          this.logger.error('Processing failed', err);
          this.isLoading.set(false);
          const detail = err.message || 'Erreur inconnue';
          this.snackBar.open(`ÉCHEC : ${detail}`, 'Détails', { duration: 10000 });
        }
      });
    } catch (err) {
      this.logger.error('Compression failed', err);
      this.isLoading.set(false);
      this.snackBar.open('Erreur lors de la compression de l\'image.', 'Fermer', { duration: 3000 });
    }
  }

  /**
   * Creates a small thumbnail (max maxSize px) as a compressed data URL.
   */
  private createThumbnail(blob: Blob, maxSize: number, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL(mimeType, mimeType === 'image/jpeg' ? 0.7 : undefined));
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  reset(): void {
    this.currentResult.set(null);
    this.originalUrl.set(null);
    this.resultUrl.set(null);
  }
}
