import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { IHistoryEntry } from '../models/history-entry.model';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait démarrer avec un historique vide', () => {
    expect(service.isEmpty()).toBeTrue();
    expect(service.count()).toBe(0);
  });

  it('devrait ajouter une entrée', () => {
    service.add({
      fileName: 'test.png',
      originalDataUrl: 'data:image/png;base64,aaa',
      resultDataUrl: 'data:image/png;base64,bbb',
      fileSize: 1024
    });
    expect(service.count()).toBe(1);
    expect(service.isEmpty()).toBeFalse();
    expect(service.entries()[0].fileName).toBe('test.png');
  });

  it('devrait supprimer une entrée par id', () => {
    service.add({
      fileName: 'test.png',
      originalDataUrl: 'data:image/png;base64,aaa',
      resultDataUrl: 'data:image/png;base64,bbb',
      fileSize: 1024
    });
    const id = service.entries()[0].id;
    service.remove(id);
    expect(service.isEmpty()).toBeTrue();
  });

  it('devrait effacer tout l\'historique', () => {
    service.add({
      fileName: 'a.png',
      originalDataUrl: 'data:image/png;base64,aaa',
      resultDataUrl: 'data:image/png;base64,bbb',
      fileSize: 100
    });
    service.add({
      fileName: 'b.png',
      originalDataUrl: 'data:image/png;base64,ccc',
      resultDataUrl: 'data:image/png;base64,ddd',
      fileSize: 200
    });
    service.clear();
    expect(service.count()).toBe(0);
    expect(localStorage.getItem('famafa_history')).toBeNull();
  });
});
