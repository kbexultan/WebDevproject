import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  errorMessage = '';
  private ordersSubscription: Subscription | undefined;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  loadOrderHistory(): void {
    this.errorMessage = '';
    this.orders = [];

    // // FE-3: Вызов метода сервиса (orderService.getOrderHistory), который обращается к API для получения данных (истории заказов).
    this.ordersSubscription = this.orderService.getOrderHistory().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        console.log('Order history loaded:', this.orders);
      },
      error: (error) => {
        console.error('Error loading order history:', error);
        this.errorMessage = 'Failed to load order history. Please try again.';
      }
    });
  }

  get showNoCompletedOrdersMessage(): boolean {
    if (!this.orders || this.orders.length === 0) {
       return false;
    }
    const hasAnyOrderWithItems = this.orders.some(order => order.order_items && order.order_items.length > 0);
    return !hasAnyOrderWithItems;
  }

}