import { TestBed } from '@angular/core/testing';
import { FileValidationService } from './file-validation.service';

describe('FileValidationService', () => {
  let service: FileValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileValidationService);
  });

  it('devrait valider un fichier JPG correct', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = service.validate(file);
    expect(result.valid).toBeTrue();
  });

  it('devrait rejeter un fichier trop gros', () => {
    const bigFile = { size: 11 * 1024 * 1024, type: 'image/jpeg' } as File;
    const result = service.validate(bigFile);
    expect(result.valid).toBeFalse();
    expect(result.error).toContain('volumineux');
  });

  it('devrait rejeter un type non supporté', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = service.validate(file);
    expect(result.valid).toBeFalse();
    expect(result.error).toContain('Format non supporté');
  });
});
