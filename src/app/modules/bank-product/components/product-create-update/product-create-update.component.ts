import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductVo } from '../../../../shared/vo/product-vo';
import { ProductService } from '../../services/product.service';
import { ResponseVo } from '../../../../shared/vo/response/response-vo';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-create-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './product-create-update.component.html',
  styleUrl: './product-create-update.component.scss'
})
export class ProductCreateUpdateComponent {

  product: ProductVo;
  revisionDateDisplay: string;
  mode: string = 'create';
  productData?: ProductVo;
  isDisable: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.product = new ProductVo();
    this.revisionDateDisplay = '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'create';
      this.productData = params['product'] ? JSON.parse(params['product']) : null;
      if (this.mode === 'edit' && this.productData) {
        this.product = this.productData;
        this.isDisable = true;
      }
    });
  }

  /**
   * Method to calculate revision date (1 year after release date)
   */
  calculateRevisionDate(releaseDate: string) {
    const [year, month, day] = releaseDate.split('-');
    const revisionYear = parseInt(year) + 1;
    
    this.product.date_revision = `${revisionYear}-${month}-${day}`;
  }

  /**
   * Method to create or update product
   */
  clickForm(form: NgForm) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    if (form.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    if(this.mode === 'create') {
      this.saveProduct();
    } else {
      this.updateProduct();
    }
  }

  /**
   * Method to save product
   */
  saveProduct(){
    this.productService.verifyId(this.product.id).subscribe({
      next: (response) => {
        if (response) {
          alert('El Id del producto ya existe.');
          return;
        }else{
          this.productService.saveproduct(this.product).subscribe({
            next: (response: ResponseVo) => {
              if (response.data) {
                alert('Producto guardado exitosamente.');
                this.router.navigate(['/products-list']);
              }else{
                alert('Error al guardar el producto.');
              }
            },
            error: (error) => {
              alert('Error al guardar el producto.');
            }
          });
        }
      },
      error: (error) => {
        alert('Error al verificar el ID del producto.');
        return;
      }
    });
  }

  updateProduct(){
    this.productService.updateProduct(this.product.id, this.product).subscribe({
      next: (response: ResponseVo) => {
        if (response.data) {
          alert('Producto actualizado exitosamente.');
          this.router.navigate(['/products-list']);
        }else{
          alert('Error al actualizar el producto.');
        }
      },
      error: (error) => {
        console.error('Error actualizando producto:', error);
        alert('Error al actualizar el producto.');
      }
    });
  }
  

}
