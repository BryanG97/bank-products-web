import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from './delete-modal.component';
import { ProductVo } from '../../../../shared/vo/product-vo';
import { By } from '@angular/platform-browser';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;
  let mockProduct: ProductVo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    mockProduct = {
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: '2024-12-31'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal when showModal is false', () => {
    component.showModal = false;
    fixture.detectChanges();
    
    const modalElement = fixture.debugElement.query(By.css('.delete-modal'));
    expect(modalElement.classes['show']).toBeFalsy();
  });

  it('should show modal when showModal is true', () => {
    component.showModal = true;
    fixture.detectChanges();
    
    const modalElement = fixture.debugElement.query(By.css('.delete-modal'));
    expect(modalElement.classes['show']).toBeTruthy();
  });

  it('should display product name in modal when productToDelete is set', () => {
    component.showModal = true;
    component.productToDelete = mockProduct;
    fixture.detectChanges();
    
    const productNameElement = fixture.debugElement.query(By.css('.modal-body strong'));
    expect(productNameElement.nativeElement.textContent).toContain(mockProduct.name);
  });

  it('should emit confirm event when confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');
    component.showModal = true;
    component.productToDelete = mockProduct;
    fixture.detectChanges();
    
    const confirmButton = fixture.debugElement.query(By.css('.btn-delete'));
    confirmButton.triggerEventHandler('click', null);
    
    expect(component.confirm.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit cancel event when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    component.showModal = true;
    fixture.detectChanges();
    
    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'));
    cancelButton.triggerEventHandler('click', null);
    
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should not emit confirm event when confirm button is clicked but no productToDelete', () => {
    spyOn(component.confirm, 'emit');
    component.showModal = true;
    component.productToDelete = undefined;
    fixture.detectChanges();
    
    const confirmButton = fixture.debugElement.query(By.css('.btn-delete'));
    confirmButton.triggerEventHandler('click', null);
    
    expect(component.confirm.emit).not.toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    spyOn(component, 'onConfirm');
    component.showModal = true;
    component.productToDelete = mockProduct;
    fixture.detectChanges();
    
    const confirmButton = fixture.debugElement.query(By.css('.btn-delete'));
    confirmButton.triggerEventHandler('click', null);
    
    expect(component.onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    component.showModal = true;
    fixture.detectChanges();
    
    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'));
    cancelButton.triggerEventHandler('click', null);
    
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should have correct button texts', () => {
    component.showModal = true;
    fixture.detectChanges();
    
    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'));
    const confirmButton = fixture.debugElement.query(By.css('.btn-delete'));
    
    expect(cancelButton.nativeElement.textContent.trim()).toBe('Cancelar');
    expect(confirmButton.nativeElement.textContent.trim()).toBe('Eliminar');
  });

  it('should have modal structure elements', () => {
    component.showModal = true;
    fixture.detectChanges();
    
    const modalContent = fixture.debugElement.query(By.css('.modal-content'));
    const modalBody = fixture.debugElement.query(By.css('.modal-body'));
    const modalFooter = fixture.debugElement.query(By.css('.modal-footer'));
    
    expect(modalContent).toBeTruthy();
    expect(modalBody).toBeTruthy();
    expect(modalFooter).toBeTruthy();
  });

  it('should display confirmation message correctly', () => {
    component.showModal = true;
    component.productToDelete = mockProduct;
    fixture.detectChanges();
    
    const modalBody = fixture.debugElement.query(By.css('.modal-body p'));
    const expectedMessage = `¿Está seguro de eliminar el producto "${mockProduct.name}"?`;
    expect(modalBody.nativeElement.textContent.trim()).toContain(expectedMessage);
  });
});
