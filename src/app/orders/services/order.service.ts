import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/orders';

  private readonly fallbackOrders: Order[] = [
    {
      id: '000055807-3',
      orderNumber: '000055807-3',
      status: 'Packing',
      customerName: 'Utkarsh Chaudhary',
      altPickPerson: 'N/A',
      streetName: '159 10th Avenue North',
      cityStateZip: 'Twin Falls, Idaho, 83301',
      customerPhone: '(879) 541-2155',
      customerEmail: 'utkarsh.chaudhary@navsoft.in',
      store: '#800 Distribution Center',
      orderType: 'Ship to Home',
      orderDate: 'Jul 16, 2026',
      signifydGuarantee: 'ACCEPT',
      signifydScore: 995,
      shipmentId: 'N/A',
      shippingAddressText: 'N/A',
      unreadMessages: 20,
      boxDimensions: {
        length: 28,
        width: 6,
        height: 20,
        weight: 73.5
      },
      selectedBox: 'Custom Box',
      itemsCount: 7,
      totalAmount: 321.93,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      canVoid: true,
      canRefund: false,
      shippingAddress: {
        street: '159 10th Avenue North',
        city: 'Twin Falls',
        state: 'Idaho',
        zipCode: '83301'
      },
      items: [
        {
          id: 1,
          selected: true,
          productName: 'Natural Balance Original Ultra 2363357228 Cat Food...',
          name: 'Natural Balance Original Ultra 2363357228 Cat Food...',
          sku: '2008756',
          qtyOrdered: 7,
          qtyPicked: 5,
          qtyShipped: 0,
          labelPrintedFor: 3,
          qtyShipping: 3,
          quantity: 7,
          price: 45.99
        }
      ]
    },
    {
      id: '000055411',
      orderNumber: '000055411',
      status: 'Packing',
      customerName: 'Avkash Maurya',
      altPickPerson: 'N/A',
      streetName: '1312 North Homedale Avenue',
      cityStateZip: 'Caldwell, Idaho, 83605',
      customerPhone: '(111) 111-1111',
      customerEmail: 'avkash.maurya@navsoft.in',
      store: 'Caldwell',
      orderType: 'Ship to Home',
      orderDate: 'Jun 22, 2026',
      signifydGuarantee: 'ACCEPT',
      signifydScore: 994,
      shipmentId: 'SB-921545016, SB-921545023',
      shippingAddressText: '1312 NORTH HOMEDALE AVENUE, ID, CALDWELL, US',
      unreadMessages: 0,
      boxDimensions: {
        length: 28,
        width: 5,
        height: 26,
        weight: 16
      },
      selectedBox: 'Custom Box',
      itemsCount: 4,
      totalAmount: 154.00,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      canVoid: false,
      canRefund: true,
      shippingAddress: {
        street: '1312 North Homedale Avenue',
        city: 'Caldwell',
        state: 'Idaho',
        zipCode: '83605'
      },
      items: [
        {
          id: 1,
          selected: true,
          productName: 'Natural Balance Original Ultra 2363357228 Cat Food...',
          name: 'Natural Balance Original Ultra 2363357228 Cat Food...',
          sku: '2008756',
          qtyOrdered: 4,
          qtyPicked: 4,
          qtyShipped: 3,
          labelPrintedFor: 0,
          qtyShipping: 1,
          quantity: 4,
          price: 38.50
        }
      ]
    },
    {
      id: '000055812',
      orderNumber: '000055812',
      status: 'Shipped',
      customerName: 'Emily Carter',
      altPickPerson: 'N/A',
      streetName: '402 Pine Meadow Way',
      cityStateZip: 'Ontario, Oregon, 97914',
      customerPhone: '(541) 555-0199',
      customerEmail: 'emily.carter@outlook.com',
      store: 'Ontario',
      orderType: 'Ship to Home',
      orderDate: 'Jul 15, 2026',
      signifydGuarantee: 'ACCEPT',
      signifydScore: 989,
      shipmentId: 'SB-921545044',
      shippingAddressText: '402 PINE MEADOW WAY, OR, ONTARIO, US',
      unreadMessages: 2,
      boxDimensions: {
        length: 18,
        width: 12,
        height: 10,
        weight: 22.4
      },
      selectedBox: 'Poly Bag - Medium',
      itemsCount: 2,
      totalAmount: 189.50,
      paymentStatus: 'Paid',
      paymentMethod: 'PayPal',
      canVoid: false,
      canRefund: false,
      shippingAddress: {
        street: '402 Pine Meadow Way',
        city: 'Ontario',
        state: 'Oregon',
        zipCode: '97914'
      },
      items: [
        {
          id: 1,
          selected: true,
          productName: "Ariat Women's Work Boots (Size 8)",
          name: "Ariat Women's Work Boots (Size 8)",
          sku: '3048912',
          qtyOrdered: 1,
          qtyPicked: 1,
          qtyShipped: 1,
          labelPrintedFor: 1,
          qtyShipping: 0,
          quantity: 1,
          price: 159.50
        }
      ]
    }
  ];

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.warn('Could not connect to json-server at ' + this.apiUrl + '. Using fallback orders data.', error);
        return of(this.fallbackOrders);
      })
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.warn(`Could not fetch order ${id} from json-server. Looking up in fallback data.`, error);
        const fallback = this.fallbackOrders.find((o) => o.id === id || o.orderNumber === id);
        return of(fallback);
      })
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status }).pipe(
      catchError((error) => {
        console.warn(`Could not update order ${id} on json-server. Updating local fallback state.`, error);
        const order = this.fallbackOrders.find((o) => o.id === id);
        if (order) {
          order.status = status;
          return of(order);
        }
        return throwError(() => error);
      })
    );
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.warn(`Could not delete order ${id} on json-server. Removing from local fallback.`, error);
        const index = this.fallbackOrders.findIndex((o) => o.id === id);
        if (index > -1) {
          this.fallbackOrders.splice(index, 1);
        }
        return of(void 0);
      })
    );
  }
}
