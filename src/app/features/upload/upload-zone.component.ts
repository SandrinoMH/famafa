import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div
      class="upload-zone"
      [class.upload-zone--dragover]="isDragOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        class="upload-zone__input"
        accept="image/jpeg,image/png,image/webp"
        (change)="onFileSelected($event)"
      />
      <div class="upload-zone__content">
        <mat-icon class="upload-zone__icon">cloud_upload</mat-icon>
        <p class="upload-zone__text">Glissez-déposez une image ici ou <span>cliquez pour parcourir</span></p>
        <p class="upload-zone__hint">JPG, PNG ou WEBP (max. 10MB)</p>
      </div>
    </div>
  `,
  styleUrls: ['./upload-zone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadZoneComponent {
  @Output() fileSelected = new EventEmitter<File>();

  isDragOver = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileSelected.emit(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files[0]);
    }
  }
}
