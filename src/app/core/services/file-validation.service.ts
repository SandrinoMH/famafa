import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {
  private readonly MAX_SIZE_MB = 10;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  validate(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Format non supporté. Utilisez JPG, PNG ou WEBP.' };
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > this.MAX_SIZE_MB) {
      return { valid: false, error: `Fichier trop volumineux (${sizeInMB.toFixed(1)}MB). Max 10MB.` };
    }

    return { valid: true };
  }
}
