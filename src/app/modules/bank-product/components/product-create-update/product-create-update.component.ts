import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductVo } from '../../../../shared/vo/product-vo';
import { ProductService } from '../../services/product.service';
import { ResponseVo } from '../../../../shared/vo/response/response-vo';
import { Router } from '@angular/router';

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

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.product = new ProductVo();
    this.revisionDateDisplay = '';
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

    this.saveProduct();
  }

  /**
   * Method to save product
   */
  saveProduct(){
    console.log('Verificando ID:', this.product.id);
    console.log('URL que se llamará:', `/bp/products/verification/${this.product.id}`);
    
    this.productService.verifyId(this.product.id).subscribe({
      next: (response) => {
        console.log('Respuesta verificación:', response);
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
              console.error('Error guardando producto:', error);
              alert('Error al guardar el producto.');
            }
          });
        }
      },
      error: (error) => {
        console.error('Error verificando ID:', error);
        console.error('URL completa del error:', error.url);
        alert('Error al verificar el ID del producto.');
        return;
      }
    });
  }
  

}
