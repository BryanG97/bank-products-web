import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: () => of({ data: [] }),
            saveproduct: () => of({ data: {} }),
            verifyId: () => of(false),
            updateProduct: () => of({ data: {} }),
            deleteProduct: () => of({})
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should fetch products and update lists', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'getProducts');
      productServiceSpy.and.returnValue(of({ data: mockProducts }));
      
      component.getAllProducts();
      
      expect(component.productList).toEqual(mockProducts);
      expect(component.filteredProductList).toEqual(mockProducts);
      expect(component.totalList).toBe(2);
    });
  });

  describe('filterProducts', () => {
    it('should reset to full list when search term is empty', () => {
      component.productList = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      
      component.filterProducts('');
      
      expect(component.filteredProductList).toEqual(component.productList);
      expect(component.totalList).toBe(2);
    });

    it('should filter products by name', () => {
      component.productList = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Another Product', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      
      component.filterProducts('Product 1');
      
      expect(component.filteredProductList.length).toBe(1);
      expect(component.filteredProductList[0].name).toBe('Product 1');
      expect(component.totalList).toBe(1);
    });
  });

  describe('toggleDropdown', () => {
    it('should open dropdown when closed', () => {
      component.openDropdownId = undefined;
      
      component.toggleDropdown('product-1');
      
      expect(component.openDropdownId).toBeDefined();
      expect((component.openDropdownId as unknown as string)).toBe('product-1');
    });

    it('should close dropdown when open', () => {
      component.openDropdownId = 'product-1';
      
      component.toggleDropdown('product-1');
      
      expect(component.openDropdownId).toBeUndefined();
    });

    it('should switch to different dropdown', () => {
      component.openDropdownId = 'product-1';
      
      component.toggleDropdown('product-2');
      
      expect(component.openDropdownId).toBe('product-2');
    });
  });

  describe('deleteProduct', () => {
    it('should set up delete modal', () => {
      const mockProduct = { id: '1', name: 'Test Product', description: 'Test', logo: 'test.png', date_release: new Date(), date_revision: '2024-12-31' };
      
      component.deleteProduct(mockProduct);
      
      expect(component.openDropdownId).toBeUndefined();
      expect(component.productToDelete).toEqual(mockProduct);
      expect(component.showDeleteModal).toBe(true);
    });
  });

  describe('onModalConfirm', () => {
    it('should delete product and refresh list', () => {
      const mockProduct = { id: '1', name: 'Test Product', description: 'Test', logo: 'test.png', date_release: new Date(), date_revision: '2024-12-31' };
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'deleteProduct');
      productServiceSpy.and.returnValue(of({}));
      spyOn(component, 'getAllProducts');
      spyOn(component, 'closeDeleteModal');
      
      component.onModalConfirm(mockProduct);
      
      expect(productServiceSpy).toHaveBeenCalledWith('1');
      expect(component.getAllProducts).toHaveBeenCalled();
      expect(component.closeDeleteModal).toHaveBeenCalled();
    });
  });

  describe('onModalCancel', () => {
    it('should close delete modal', () => {
      spyOn(component, 'closeDeleteModal');
      
      component.onModalCancel();
      
      expect(component.closeDeleteModal).toHaveBeenCalled();
    });
  });

  describe('closeDeleteModal', () => {
    it('should reset modal state', () => {
      component.showDeleteModal = true;
      component.productToDelete = { id: '1', name: 'Test', description: 'Test', logo: 'test.png', date_release: new Date(), date_revision: '2024-12-31' };
      
      component.closeDeleteModal();
      
      expect(component.showDeleteModal).toBe(false);
      expect(component.productToDelete).toBeUndefined();
    });
  });

  describe('updatePagination', () => {
    it('should calculate total pages and reset to page 1', () => {
      component.filteredProductList = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '3', name: 'Product 3', description: 'Desc 3', logo: 'logo3.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      component.itemsPerPage = 2;
      spyOn(component, 'updatePaginatedList');
      
      component.updatePagination();
      
      expect(component.totalPages).toBe(2);
      expect(component.currentPage).toBe(1);
      expect(component.updatePaginatedList).toHaveBeenCalled();
    });
  });

  describe('updatePaginatedList', () => {
    it('should slice products for current page', () => {
      component.filteredProductList = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '3', name: 'Product 3', description: 'Desc 3', logo: 'logo3.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      component.itemsPerPage = 2;
      component.currentPage = 1;
      
      component.updatePaginatedList();
      
      expect(component.paginatedList.length).toBe(2);
      expect(component.paginatedList[0].name).toBe('Product 1');
      expect(component.paginatedList[1].name).toBe('Product 2');
    });

    it('should handle second page', () => {
      component.filteredProductList = [
        { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: '2024-12-31' },
        { id: '3', name: 'Product 3', description: 'Desc 3', logo: 'logo3.png', date_release: new Date(), date_revision: '2024-12-31' }
      ];
      component.itemsPerPage = 2;
      component.currentPage = 2;
      
      component.updatePaginatedList();
      
      expect(component.paginatedList.length).toBe(1);
      expect(component.paginatedList[0].name).toBe('Product 3');
    });
  });

  describe('onItemsPerPageChange', () => {
    it('should update items per page and pagination', () => {
      const mockEvent = { target: { value: '10' } };
      spyOn(component, 'updatePagination');
      
      component.onItemsPerPageChange(mockEvent);
      
      expect(component.itemsPerPage).toBe(10);
      expect(component.updatePagination).toHaveBeenCalled();
    });
  });

  describe('previousPage', () => {
    it('should go to previous page when not on first page', () => {
      component.currentPage = 3;
      spyOn(component, 'updatePaginatedList');
      
      component.previousPage();
      
      expect(component.currentPage).toBe(2);
      expect(component.updatePaginatedList).toHaveBeenCalled();
    });

    it('should not go below page 1', () => {
      component.currentPage = 1;
      spyOn(component, 'updatePaginatedList');
      
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.updatePaginatedList).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should go to next page when not on last page', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      spyOn(component, 'updatePaginatedList');
      
      component.nextPage();
      
      expect(component.currentPage).toBe(2);
      expect(component.updatePaginatedList).toHaveBeenCalled();
    });

    it('should not go beyond last page', () => {
      component.currentPage = 3;
      component.totalPages = 3;
      spyOn(component, 'updatePaginatedList');
      
      component.nextPage();
      
      expect(component.currentPage).toBe(3);
      expect(component.updatePaginatedList).not.toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should navigate to create page', () => {
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      routerSpy.and.returnValue(Promise.resolve(true));
      
      component.createProduct();
      
      expect(routerSpy).toHaveBeenCalledWith(['/product-create-update'], { 
        queryParams: { mode: 'create' } 
      });
    });
  });

  describe('editProduct', () => {
    it('should navigate to edit page with product data', () => {
      const mockProduct = { id: '1', name: 'Test Product', description: 'Test', logo: 'test.png', date_release: new Date(), date_revision: '2024-12-31' };
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      routerSpy.and.returnValue(Promise.resolve(true));
      
      component.editProduct(mockProduct);
      
      expect(component.openDropdownId).toBeUndefined();
      expect(routerSpy).toHaveBeenCalledWith(['/product-create-update'], { 
        queryParams: { mode: 'edit', product: JSON.stringify(mockProduct) } 
      });
    });
  });

  describe('onSearchChange', () => {
    it('should handle search input change', () => {
      const mockEvent = { target: { value: 'test search' } } as any;

      expect(() => component.onSearchChange(mockEvent)).not.toThrow();
    });
  });
});
