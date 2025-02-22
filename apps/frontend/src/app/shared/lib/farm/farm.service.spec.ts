import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FarmService } from './farm.service';
import { Farm } from '../../model/farm.model';
import { provideHttpClient } from '@angular/common/http';

describe('FarmService', () => {
  let service: FarmService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FarmService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FarmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentFarm', () => {
    it('should get current farm from API', () => {
      const mockFarm: Farm = {
        id: 1,
        userId: 1,
        propertyName: 'Test Farm',
        location: 'Test Location',
        sector: 'Test Sector',
        creditReason: 'Test Credit Reason',
      };

      service.getCurrentFarm().subscribe(farm => {
        expect(farm).toEqual(mockFarm);
      });

      const req = httpMock.expectOne('farms/my-farm');
      expect(req.request.method).toBe('GET');
      req.flush(mockFarm);
    });
  });

  describe('saveFarm', () => {
    it('should save farm to API', () => {
      const farmToSave = {
        propertyName: 'New Farm',
        location: 'Test Location',
        sector: 'Test Sector',
        creditReason: 'Test Credit Reason',
      };

      const mockResponse: Farm = {
        id: 1,
        userId: 1,
        ...farmToSave
      };

      service.saveFarm(farmToSave).subscribe(farm => {
        expect(farm).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('farms');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(farmToSave);
      req.flush(mockResponse);
    });
  });
});
