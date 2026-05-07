import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageProcessingService } from './image-processing.service';
import { environment } from '../../../environments/environment';

describe('ImageProcessingService', () => {
  let service: ImageProcessingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageProcessingService]
    });
    service = TestBed.inject(ImageProcessingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait envoyer une requête POST pour supprimer le fond', () => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const mockBlob = new Blob([''], { type: 'image/png' });

    service.removeBackground(mockFile).subscribe(response => {
      expect(response).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/remove-bg`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBlob);
  });
});
