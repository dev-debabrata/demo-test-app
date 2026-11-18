import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { Order, OrderStatus } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css'
})
export class OrderPage implements OnInit, AfterViewInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly displayedColumns: string[] = [
    'orderNumber',
    'customer',
    'date',
    'items',
    'total',
    'status',
    'paymentStatus',
    'actions'
  ];

  readonly dataSource = new MatTableDataSource<Order>([]);
  readonly isLoading = signal<boolean>(true);
  readonly allOrders = signal<Order[]>([]);

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('ALL');

  // Summary Metrics
  readonly totalOrdersCount = computed(() => this.allOrders().length);
  readonly totalRevenue = computed(() =>
    this.allOrders().reduce((acc, order) => acc + order.totalAmount, 0)
  );
  readonly pendingCount = computed(
    () => this.allOrders().filter((o) => o.status === 'Pending' || o.status === 'Processing').length
  );
  readonly deliveredCount = computed(
    () => this.allOrders().filter((o) => o.status === 'Delivered').length
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadOrders();
    this.setupFilterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.allOrders.set(orders);
        this.applyFilterToDataSource();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (order: Order, filterStr: string): boolean => {
      const filter = JSON.parse(filterStr) as { search: string; status: string };
      const matchesSearch =
        !filter.search ||
        order.orderNumber.toLowerCase().includes(filter.search) ||
        order.customerName.toLowerCase().includes(filter.search) ||
        order.customerEmail.toLowerCase().includes(filter.search) ||
        (order.shippingAddress?.city != null && order.shippingAddress.city.toLowerCase().includes(filter.search)) ||
        (order.cityStateZip != null && order.cityStateZip.toLowerCase().includes(filter.search));

      const matchesStatus =
        filter.status === 'ALL' || order.status.toUpperCase() === filter.status.toUpperCase();

      return matchesSearch && matchesStatus;
    };
  }

  applyFilterToDataSource(): void {
    const filter = {
      search: this.searchQuery().trim().toLowerCase(),
      status: this.selectedStatus()
    };
    this.dataSource.data = this.allOrders();
    this.dataSource.filter = JSON.stringify(filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchChange(val: string): void {
    this.searchQuery.set(val);
    this.applyFilterToDataSource();
  }

  onStatusChange(val: string): void {
    this.selectedStatus.set(val);
    this.applyFilterToDataSource();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.applyFilterToDataSource();
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'Packing':
        return 'status-packing';
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Processing':
        return 'status-processing';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getPaymentClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'payment-paid';
      case 'Pending':
        return 'payment-pending';
      case 'Refunded':
        return 'payment-refunded';
      case 'Failed':
        return 'payment-failed';
      default:
        return '';
    }
  }
}
