import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../service/book.service';
import { Book } from '../../models/book.model';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null;
  book: Book | null = null;
  errorMessage = '';
  authError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId = Number(id);
        this.loadBookDetails(this.bookId);
      } else {
        this.errorMessage = 'Book ID not found in route.';
        this.cdr.markForCheck();
      }
    });
  }

  loadBookDetails(id: number): void {
    this.errorMessage = '';
    this.book = null;
    // // FE-3: Вызов метода сервиса (bookService.getBookById), который обращается к API для получения данных.
    this.bookService.getBookById(id).subscribe({
      next: (response: any) => {
        console.log('Данные от API:', response);
        if (response) {
          if (response.id && response.title && response.author && response.price) {
            this.book = {
              id: response.id,
              title: response.title,
              author: response.author,
              description: response.description || '',
              price: parseFloat(response.price),
              category: response.category || null
            };
            console.log('this.book после присвоения:', this.book);
          } else {
             this.errorMessage = 'Received incomplete book data from API.';
             this.book = null;
          }
        } else {
          this.errorMessage = 'Failed to load book details (empty response).';
          this.book = null;
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || error?.message || 'An unknown error occurred while fetching book details.';
        this.book = null;
        console.error('Ошибка API:', error);
        this.cdr.markForCheck();
      }
    });
  }

  addToCart(): void {
    this.authError = null;

    if (!this.book) {
      console.error('Cannot add to cart: Book data is not loaded.');
      this.errorMessage = 'Book details are not available, cannot add to cart.';
      this.cdr.markForCheck();
      return;
    }

    if (!!this.authService.getToken()) {
      const itemToAdd: CartItem = {
        book: this.book,
        quantity: 1,
      };
      this.cartService.addToCart(itemToAdd);
      console.log(`'${this.book.title}' added to cart!`);

    } else {
      const message = 'Please log in or register to add items to the cart.';
      alert(message);
      console.warn(message);
    }
  }
}