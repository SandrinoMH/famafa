import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/upload/upload-page.component').then(m => m.UploadPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
