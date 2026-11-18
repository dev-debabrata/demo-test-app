import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrderDetailsPage } from './order-details-page';
import { OrderService } from '../services/order.service';

describe('OrderDetailsPage', () => {
  let component: OrderDetailsPage;
  let fixture: ComponentFixture<OrderDetailsPage>;

  const mockOrderService = {
    getOrders: () => of([]),
    getOrderById: () => of(undefined),
    updateOrderStatus: () => of({} as any),
    deleteOrder: () => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsPage],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
