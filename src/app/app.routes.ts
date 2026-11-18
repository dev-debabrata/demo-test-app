import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/order-page/order-page').then((c) => c.OrderPage),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./orders/order-details-page/order-details-page').then((c) => c.OrderDetailsPage),
  },

  {
    path: '**',
    redirectTo: 'orders',
  },
];
