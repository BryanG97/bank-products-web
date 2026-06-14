import { Component } from '@angular/core';
import { ProductVo } from '../../../../shared/vo/product-vo';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ResponseVo } from '../../../../shared/vo/response/response-vo';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  productList: ProductVo[];
  filteredProductList: ProductVo[];
  totalList: number;
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.productList = [];
    this.filteredProductList = [];
    this.totalList = 0;
    this.setupSearch();
   }

  ngOnInit(): void {
    this.getAllProducts();
  }

  /**
   * Method to get all products
   */
  getAllProducts(){
    this.productService.getProducts().subscribe({
      next: (response: ResponseVo) => {
        if(response.data){
          this.productList = response.data;
          this.filteredProductList = response.data;
          this.totalList = response.data.length;
        }
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  /**
   * Setup search with debounce
   */
  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterProducts(searchTerm);
    });
  }

  /**
   * Filter products by name
   */
  filterProducts(searchTerm: string) {
    if (!searchTerm) {
      this.filteredProductList = [...this.productList];
      this.totalList = this.productList.length;
    } else {
      this.filteredProductList = this.productList.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.totalList = this.filteredProductList.length;
    }
  }

  /**
   * Handle search input changes
   */
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }


  /**
   * Method to show screen to create product
   */
  createProduct() {
    this.router.navigate(['/product-create-update']);
  }

}

