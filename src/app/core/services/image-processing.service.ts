import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { removeBackground } from '@imgly/background-removal';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  /**
   * Removes background using client-side WASM (imgly).
   * This avoids server RAM limits and reduces latency.
   */
  removeBackground(file: File, onProgress?: (status: string, progress: number) => void): Observable<Blob> {
    console.log('%c [FAMAFA] Démarrage de l\'IA Locale (Large)...', 'background: #222; color: #bada55; font-size: 20px;');
    const config: any = {
      progress: (status: string, progress: number) => {
        if (onProgress) onProgress(status, progress);
        console.log(`AI Progress: ${status} (${Math.round(progress * 100)}%)`);
      },
      model: 'large',
      output: {
        format: 'image/png',
        quality: 1.0
      }
    };

    // Convert the Promise to an Observable to maintain compatibility with existing components
    return from(removeBackground(file, config));
  }

  /**
   * Compresses an image using Canvas.
   */
  async compressImage(file: File, maxWidth = 1500): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas error');
          
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/png',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/png', 0.8);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }
}
