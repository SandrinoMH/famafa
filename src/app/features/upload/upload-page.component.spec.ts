import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UploadPageComponent } from './upload-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UploadPageComponent', () => {
  let component: UploadPageComponent;
  let fixture: ComponentFixture<UploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UploadPageComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les signaux à null', () => {
    expect(component.isLoading()).toBeFalse();
    expect(component.originalUrl()).toBeNull();
    expect(component.resultUrl()).toBeNull();
  });

  it('devrait réinitialiser les signaux au clic sur reset', () => {
    component.originalUrl.set('test');
    component.reset();
    expect(component.originalUrl()).toBeNull();
  });
});
