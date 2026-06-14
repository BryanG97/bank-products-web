import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateUpdateComponent } from './product-create-update.component';

describe('ProductCreateUpdateComponent', () => {
  let component: ProductCreateUpdateComponent;
  let fixture: ComponentFixture<ProductCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreateUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
