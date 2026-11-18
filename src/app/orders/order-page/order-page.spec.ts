import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrderPage } from './order-page';
import { OrderService } from '../services/order.service';

describe('OrderPage', () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;

  const mockOrderService = {
    getOrders: () => of([]),
    getOrderById: () => of(undefined),
    updateOrderStatus: () => of({} as any),
    deleteOrder: () => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPage],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
