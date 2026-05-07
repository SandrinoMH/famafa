import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string, ...args: any[]): void {
    if (isDevMode()) {
      console.log(`[LOG]: ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (isDevMode()) {
      console.error(`[ERROR]: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (isDevMode()) {
      console.warn(`[WARN]: ${message}`, ...args);
    }
  }
}
