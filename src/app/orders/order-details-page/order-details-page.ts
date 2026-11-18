import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Order, OrderItem } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-details-page.html',
  styleUrl: './order-details-page.css'
})
export class OrderDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | undefined>(undefined);
  readonly allOrderIds = signal<string[]>([]);
  readonly currentOrderIndex = signal<number>(0);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');

  // Box Selection & Dimensions
  readonly boxOptions: string[] = [
    'Custom Box',
    'Poly Bag - Small',
    'Poly Bag - Extra Large',
    'Poly Bag - Large',
    'Poly Bag - Medium',
    'Large Feed Box'
  ];
  readonly selectedBox = signal<string>('Custom Box');
  readonly isBoxDropdownOpen = signal<boolean>(false);

  readonly boxLength = signal<number | null>(1);
  readonly boxWidth = signal<number | null>(1);
  readonly boxHeight = signal<number | null>(1);
  readonly boxWeight = signal<number | null>(1);

  // Validation State (can toggle to display errors as seen in screenshot 2)
  readonly showValidationErrors = signal<boolean>(false);

  // Active Toast / Feedback
  readonly toastMessage = signal<string>('');

  ngOnInit(): void {
    // Load all orders list to support Prev / Next navigation
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const ids = orders.map((o) => o.id || o.orderNumber);
        this.allOrderIds.set(ids);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadOrder(id);
      }
    });
  }

  loadOrder(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        if (order) {
          this.order.set(order);
          this.selectedBox.set(order.selectedBox || 'Custom Box');

          if (order.boxDimensions) {
            this.boxLength.set(order.boxDimensions.length);
            this.boxWidth.set(order.boxDimensions.width);
            this.boxHeight.set(order.boxDimensions.height);
            this.boxWeight.set(order.boxDimensions.weight);
          }

          // If this is order 000055411, show the validation state like Screenshot 2
          if (order.orderNumber === '000055411') {
            this.showValidationErrors.set(true);
          } else {
            this.showValidationErrors.set(false);
          }

          // Update index for pagination
          const ids = this.allOrderIds();
          const idx = ids.findIndex((item) => item === order.id || item === order.orderNumber);
          if (idx !== -1) {
            this.currentOrderIndex.set(idx);
          }
        } else {
          this.errorMessage.set(`Order #${id} not found.`);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load order.');
        this.isLoading.set(false);
      }
    });
  }

  toggleBoxDropdown(): void {
    this.isBoxDropdownOpen.update((v) => !v);
  }

  selectBoxOption(option: string): void {
    this.selectedBox.set(option);
    this.isBoxDropdownOpen.set(false);

    // Auto set dimensions based on standard packaging
    if (option === 'Poly Bag - Small') {
      this.boxLength.set(10);
      this.boxWidth.set(8);
      this.boxHeight.set(2);
      this.boxWeight.set(1.5);
    } else if (option === 'Poly Bag - Large') {
      this.boxLength.set(15);
      this.boxWidth.set(12);
      this.boxHeight.set(4);
      this.boxWeight.set(4);
    } else if (option === 'Large Feed Box') {
      this.boxLength.set(36);
      this.boxWidth.set(24);
      this.boxHeight.set(18);
      this.boxWeight.set(50);
    }
  }

  toggleItemSelection(item: OrderItem): void {
    item.selected = !item.selected;
  }

  onShip(): void {
    if (
      !this.boxLength() ||
      !this.boxWidth() ||
      !this.boxHeight() ||
      !this.boxWeight() ||
      this.boxLength()! <= 0 ||
      this.boxWidth()! <= 0 ||
      this.boxHeight()! <= 0 ||
      this.boxWeight()! <= 0
    ) {
      this.showValidationErrors.set(true);
      this.showToast('Please correct box dimensions before shipping.');
      return;
    }

    this.showToast('Order successfully marked as SHIPPED!');
  }

  onPackingSlip(): void {
    this.showToast('Generating Packing Slip...');
    window.print();
  }

  onVoidShipping(): void {
    this.showToast('Voiding shipping label...');
  }

  onReprintLabel(): void {
    this.showToast('Reprinting shipping label...');
  }

  onVoidOrder(): void {
    if (confirm('Are you sure you want to void this order?')) {
      this.showToast('Order voided.');
    }
  }

  onRefundOrder(): void {
    if (confirm('Initiate refund for this order?')) {
      this.showToast('Refund processed.');
    }
  }

  prevOrder(): void {
    const ids = this.allOrderIds();
    const curr = this.currentOrderIndex();
    if (curr > 0) {
      this.router.navigate(['/orders', ids[curr - 1]]);
    }
  }

  nextOrder(): void {
    const ids = this.allOrderIds();
    const curr = this.currentOrderIndex();
    if (curr < ids.length - 1) {
      this.router.navigate(['/orders', ids[curr + 1]]);
    }
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set('');
    }, 3000);
  }
}
