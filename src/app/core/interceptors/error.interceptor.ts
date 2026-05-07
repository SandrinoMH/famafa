import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Une erreur est survenue lors de la communication avec le serveur.';

      if (error.status === 413) {
        message = 'Le fichier est trop volumineux pour le serveur.';
      } else if (error.status === 429) {
        message = 'Trop de requêtes. Veuillez patienter.';
      } else if (error.error instanceof Blob) {
          // Si l'erreur est un blob (pour responseType: 'blob')
          message = 'Le traitement de l\'image a échoué.';
      }

      logger.error('API Error', error);
      snackBar.open(message, 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      return throwError(() => error);
    })
  );
};
