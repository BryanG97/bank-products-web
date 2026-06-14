import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductCreateUpdateComponent } from './product-create-update.component';
import { ProductService } from '../../services/product.service';

describe('ProductCreateUpdateComponent', () => {
  let component: ProductCreateUpdateComponent;
  let fixture: ComponentFixture<ProductCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductCreateUpdateComponent,
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
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ mode: 'create' }),
            queryParams: of({})
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('calculateRevisionDate', () => {
    it('should calculate revision date as 1 year after release date', () => {
      const releaseDate = '2023-06-15';
      
      component.calculateRevisionDate(releaseDate);
      
      expect(component.product.date_revision).toBe('2024-06-15');
    });

    it('should handle leap year correctly', () => {
      const releaseDate = '2020-02-29';
      
      component.calculateRevisionDate(releaseDate);
      
      expect(component.product.date_revision).toBe('2021-02-29');
    });

    it('should handle year transition correctly', () => {
      const releaseDate = '2023-12-31';
      
      component.calculateRevisionDate(releaseDate);
      
      expect(component.product.date_revision).toBe('2024-12-31');
    });
  });

  describe('clickForm', () => {
    it('should mark all form controls as touched', () => {
      const mockForm = {
        controls: {
          id: { markAsTouched: jasmine.createSpy('markAsTouched') },
          name: { markAsTouched: jasmine.createSpy('markAsTouched') },
          description: { markAsTouched: jasmine.createSpy('markAsTouched') }
        },
        invalid: false
      } as any;
      
      component.clickForm(mockForm);
      
      expect(mockForm.controls.id.markAsTouched).toHaveBeenCalled();
      expect(mockForm.controls.name.markAsTouched).toHaveBeenCalled();
      expect(mockForm.controls.description.markAsTouched).toHaveBeenCalled();
    });

    it('should show alert and return if form is invalid', () => {
      const mockForm = {
        controls: {},
        invalid: true
      } as any;
      spyOn(window, 'alert');
      
      component.clickForm(mockForm);
      
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos correctamente.');
    });

    it('should call saveProduct when mode is create and form is valid', () => {
      const mockForm = {
        controls: {},
        invalid: false
      } as any;
      component.mode = 'create';
      spyOn(component, 'saveProduct');
      
      component.clickForm(mockForm);
      
      expect(component.saveProduct).toHaveBeenCalled();
    });

    it('should call updateProduct when mode is edit and form is valid', () => {
      const mockForm = {
        controls: {},
        invalid: false
      } as any;
      component.mode = 'edit';
      spyOn(component, 'updateProduct');
      
      component.clickForm(mockForm);
      
      expect(component.updateProduct).toHaveBeenCalled();
    });
  });

  describe('saveProduct', () => {
    it('should verify ID and save product when ID does not exist', () => {
      component.product = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'verifyId');
      productServiceSpy.and.returnValue(of(false));
      const saveProductSpy = spyOn(TestBed.inject(ProductService), 'saveproduct');
      saveProductSpy.and.returnValue(of({ data: { id: 'test-id' } }));
      spyOn(window, 'alert');
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      routerSpy.and.returnValue(Promise.resolve(true));
      
      component.saveProduct();
      
      expect(productServiceSpy).toHaveBeenCalledWith('test-id');
      expect(saveProductSpy).toHaveBeenCalledWith(component.product);
      expect(window.alert).toHaveBeenCalledWith('Producto guardado exitosamente.');
      expect(routerSpy).toHaveBeenCalledWith(['/products-list']);
    });

    it('should show alert when ID already exists', () => {
      component.product = {
        id: 'existing-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'verifyId');
      productServiceSpy.and.returnValue(of(true));
      spyOn(window, 'alert');
      
      component.saveProduct();
      
      expect(productServiceSpy).toHaveBeenCalledWith('existing-id');
      expect(window.alert).toHaveBeenCalledWith('El Id del producto ya existe.');
    });

    it('should show error alert when save fails', () => {
      component.product = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const verifyIdSpy = spyOn(TestBed.inject(ProductService), 'verifyId');
      verifyIdSpy.and.returnValue(of(false));
      const saveProductSpy = spyOn(TestBed.inject(ProductService), 'saveproduct');
      saveProductSpy.and.returnValue(of({ data: null }));
      spyOn(window, 'alert');
      
      component.saveProduct();
      
      expect(window.alert).toHaveBeenCalledWith('Error al guardar el producto.');
    });

    it('should show error alert when verification fails', () => {
      component.product = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'verifyId');
      productServiceSpy.and.returnValue(throwError('Error'));
      spyOn(window, 'alert');
      
      component.saveProduct();
      
      expect(window.alert).toHaveBeenCalledWith('Error al verificar el ID del producto.');
    });
  });

  describe('updateProduct', () => {
    it('should update product and navigate on success', () => {
      component.product = {
        id: 'test-id',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'updateProduct');
      productServiceSpy.and.returnValue(of({ data: { id: 'test-id' } }));
      spyOn(window, 'alert');
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      routerSpy.and.returnValue(Promise.resolve(true));
      
      component.updateProduct();
      
      expect(productServiceSpy).toHaveBeenCalledWith('test-id', component.product);
      expect(window.alert).toHaveBeenCalledWith('Producto actualizado exitosamente.');
      expect(routerSpy).toHaveBeenCalledWith(['/products-list']);
    });

    it('should show error alert when update fails', () => {
      component.product = {
        id: 'test-id',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated.png',
        date_release: new Date(),
        date_revision: '2024-12-31'
      };
      
      const productServiceSpy = spyOn(TestBed.inject(ProductService), 'updateProduct');
      productServiceSpy.and.returnValue(of({ data: null }));
      spyOn(window, 'alert');
      
      component.updateProduct();
      
      expect(window.alert).toHaveBeenCalledWith('Error al actualizar el producto.');
    });
  });

  describe('ngOnInit', () => {
    it('should set mode to create when no mode parameter', () => {
      const activatedRouteMock = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
      activatedRouteMock.queryParams = of({});
      
      component.ngOnInit();
      
      expect(component.mode).toBe('create');
      expect(component.productData).toBeNull();
      expect(component.isDisable).toBe(false);
    });

    it('should set mode to edit and populate product data', () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test.png',
        date_release: new Date().toISOString(),
        date_revision: '2024-12-31'
      };
      
      const activatedRoute = TestBed.inject(ActivatedRoute);
      Object.defineProperty(activatedRoute, 'queryParams', {
        value: of({
          mode: 'edit',
          product: JSON.stringify(mockProduct)
        }),
        writable: true
      });
      
      component.ngOnInit();
      
      expect(component.mode).toBe('edit');
      expect(component.productData?.id).toBe(mockProduct.id);
      expect(component.productData?.name).toBe(mockProduct.name);
      expect(component.productData?.description).toBe(mockProduct.description);
      expect(component.productData?.logo).toBe(mockProduct.logo);
      expect(component.productData?.date_revision).toBe(mockProduct.date_revision);
      expect(component.product.id).toBe(mockProduct.id);
      expect(component.product.name).toBe(mockProduct.name);
      expect(component.product.description).toBe(mockProduct.description);
      expect(component.product.logo).toBe(mockProduct.logo);
      expect(component.product.date_revision).toBe(mockProduct.date_revision);
      expect(component.isDisable).toBe(true);
    });

    it('should handle mode parameter without product data', () => {
      const activatedRouteMock = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
      activatedRouteMock.queryParams = of({ mode: 'edit' });
      
      component.ngOnInit();
      
      expect(component.mode).toBe('edit');
      expect(component.productData).toBeNull();
      expect(component.isDisable).toBe(false);
    });
  });
});
