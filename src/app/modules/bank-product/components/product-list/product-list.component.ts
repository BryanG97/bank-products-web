import { Component } from '@angular/core';
import { ProductVo } from '../../../../shared/vo/product-vo';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ResponseVo } from '../../../../shared/vo/response/response-vo';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    DeleteModalComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  productList: ProductVo[];
  totalList: number;

  filteredProductList: ProductVo[];
  private searchSubject = new Subject<string>();

  openDropdownId?: string;
  showDeleteModal: boolean = false;
  productToDelete?: ProductVo;

  paginatedList: ProductVo[];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.productList = [];
    this.filteredProductList = [];
    this.paginatedList = [];
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
          this.updatePagination();
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
    this.updatePagination();
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
    this.router.navigate(['/product-create-update'], { 
      queryParams: { mode: 'create' } 
    });
  }

  /**
   * Method to show screen to edit product
   */
  editProduct(product: ProductVo) {
    this.openDropdownId = undefined;
    this.router.navigate(['/product-create-update'], { 
      queryParams: { mode: 'edit', product: JSON.stringify(product) } 
    });
  }

  /**
   * Toggle dropdown menu
   */
  toggleDropdown(productId: string) {
    this.openDropdownId = this.openDropdownId === productId ? undefined : productId;
  }

  /**
   * Delete product
   */
  deleteProduct(product: ProductVo) {
    this.openDropdownId = undefined;
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  /**
   * Handle modal confirm
   */
  onModalConfirm(product: ProductVo) {
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.getAllProducts();
        this.closeDeleteModal();
      },
      error: () => {
        alert('Error al eliminar el producto.');
        this.closeDeleteModal();
      }
    });
  }

  /**
   * Handle modal cancel
   */
  onModalCancel() {
    this.closeDeleteModal();
  }

  /**
   * Close delete modal
   */
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = undefined;
  }

  /**
   * Update pagination
   */
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProductList.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  /**
   * Update paginated list
   */
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredProductList.slice(startIndex, endIndex);
  }

  /**
   * Change items per page
   */
  onItemsPerPageChange(event: any) {
    this.itemsPerPage = parseInt(event.target.value);
    this.updatePagination();
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  /**
   * Go to next page
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

}

