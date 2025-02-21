import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('storage operations', () => {
    it('should store and retrieve a value', () => {
      const testKey = 'testKey';
      const testValue = 'test value';

      service.setItem(testKey, testValue);
      expect(service.getItem(testKey)).toBe(testValue);
    });

    it('should return null for non-existent key', () => {
      expect(service.getItem('nonexistentkey')).toBeNull();
    });

    it('should remove a stored value', () => {
      const testKey = 'testKey';
      const testValue = 'test value';

      service.setItem(testKey, testValue);
      service.removeItem(testKey);
      expect(service.getItem(testKey)).toBeNull();
    });

    it('should clear all stored values', () => {
      service.setItem('key1', 'value1');
      service.setItem('key2', 'value2');

      service.clear();

      expect(service.getItem('key1')).toBeNull();
      expect(service.getItem('key2')).toBeNull();
    });

    it('should update an existing value', () => {
      const testKey = 'testKey';
      const initialValue = 'initial value';
      const updatedValue = 'updated value';

      service.setItem(testKey, initialValue);
      service.setItem(testKey, updatedValue);
      expect(service.getItem(testKey)).toBe(updatedValue);
    });
  });
});
