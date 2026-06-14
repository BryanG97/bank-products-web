import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductVo } from '../../../shared/vo/product-vo';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = '/bp/products';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get bank product
   * @returns Get products list
   */
  public getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /**
   * Save bank product
   * @param product 
   * @returns Save product
   */
  public saveproduct(product: ProductVo): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  /**
   * Verify if product ID exists
   * @param id Product ID
   * @returns Verify product ID
   */
  public verifyId(id?: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verification/${id}`);
  }

}
