import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <div class="container">
        <div class="app-toolbar__logo">
          <mat-icon>auto_fix_high</mat-icon>
          <span>Famafa</span>
        </div>
        <span class="spacer"></span>
        <button mat-icon-button>
          
        </button>
      </div>
    </mat-toolbar>

    <div class="app-container">
      <router-outlet></router-outlet>
    </div>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2026 Famafa - Propulsé par Sandrino | <small>v2.1 (Local AI Mode)</small></p>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'remove-bg-app';
  
  constructor() {
    console.log('%c [FAMAFA] Application Initialisée v2.1', 'color: white; background: green; padding: 5px; border-radius: 3px;');
  }
}
