import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should make GET request to products endpoint', () => {
      service.getProducts().subscribe();
      
      const req = httpMock.expectOne('/bp/products');
      expect(req.request.method).toBe('GET');
      req.flush({ data: [] });
    });
  });

  describe('saveproduct', () => {
    it('should make POST request to products endpoint', () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      service.saveproduct(mockProduct).subscribe();
      
      const req = httpMock.expectOne('/bp/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct });
    });
  });

  describe('verifyId', () => {
    it('should make GET request to verification endpoint', () => {
      service.verifyId('test-id').subscribe();
      
      const req = httpMock.expectOne('/bp/products/verification/test-id');
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('should handle undefined id', () => {
      service.verifyId(undefined).subscribe();
      
      const req = httpMock.expectOne('/bp/products/verification/undefined');
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });

  describe('updateProduct', () => {
    it('should make PUT request to products endpoint with id', () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      service.updateProduct('test-id', mockProduct).subscribe();
      
      const req = httpMock.expectOne('/bp/products/test-id');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct });
    });

    it('should handle undefined id', () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      service.updateProduct(undefined, mockProduct).subscribe();
      
      const req = httpMock.expectOne('/bp/products/undefined');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct });
    });
  });

  describe('deleteProduct', () => {
    it('should make DELETE request to products endpoint with id', () => {
      service.deleteProduct('test-id').subscribe();
      
      const req = httpMock.expectOne('/bp/products/test-id');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle undefined id', () => {
      service.deleteProduct(undefined).subscribe();
      
      const req = httpMock.expectOne('/bp/products/undefined');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
