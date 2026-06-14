import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/products-list', pathMatch: 'full' },
    {
        path: 'products-list',
        loadComponent: () => import('./modules/bank-product/components/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'product-create-update',
        loadComponent: () => import('./modules/bank-product/components/product-create-update/product-create-update.component').then(m => m.ProductCreateUpdateComponent)
    },
];
