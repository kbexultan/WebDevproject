import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | undefined;
  removalMessage = '';
  orderPlaced = false;
  successMessage = '';

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  removeFromCart(bookId: number): void {
    const bookToRemove = this.cartItems.find(item => item.book.id === bookId)?.book.title;
    this.cartService.removeFromCart(bookId);
    if (bookToRemove && this.cartItems.some(item => item.book.id === bookId)) {
      this.removalMessage = `Quantity of '${bookToRemove}' updated.`;
    } else if (bookToRemove) {
       this.removalMessage = `'${bookToRemove}' has been removed from your cart.`;
    }

    if (this.removalMessage) {
      setTimeout(() => {
        this.removalMessage = '';
      }, 3000);
    }
  }


  clearCart(): void {
    this.cartService.clearCart();
    this.removalMessage = 'Your cart has been cleared.';
    setTimeout(() => {
      this.removalMessage = '';
    }, 3000);
  }

  placeOrder(): void {
    if (this.cartItems.length > 0 && !this.orderPlaced) {
      console.log('Current cartItems:', this.cartItems);

      const orderItems = this.cartItems.map(item => ({
        book_id: item.book.id,
        quantity: item.quantity
      }));

      console.log('Order payload being prepared:', orderItems);

      // // FE-3: Вызов метода сервиса (cartService.placeOrder), который обращается к API для размещения заказа; инициируется событием из шаблона.
      this.cartService.placeOrder(orderItems).subscribe({
        next: (response) => {
          this.orderPlaced = true;
          this.successMessage = 'Your order has been placed!';
          this.cartService.clearCart();
          this.router.navigate(['/order-history']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error placing order:', error);
          if (error.status === 0) {
             this.successMessage = 'Failed to connect to the server. Please try again later.';
          } else {
             this.successMessage = `Failed to place order (Error ${error.status}). Please try again.`;
          }
          this.orderPlaced = false;
        }
      });
    } else if (this.orderPlaced) {
      this.successMessage = 'This order has already been placed.';
    } else {
      this.successMessage = 'Your cart is empty. Please add items to place an order.';
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  }
}