import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait appeler console.log en mode dev', () => {
    spyOn(console, 'log');
    service.log('test');
    // En test, isDevMode() est généralement vrai ou configurable
    expect(console.log).toHaveBeenCalled();
  });
});
