import { Component, OnInit } from '@angular/core';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.errorMessage = '';
    this.books = [];

    // // FE-3: Вызов метода сервиса (bookService.getBooks), который обращается к API для получения данных (списка книг).
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        console.log('Книги успешно загружены:', books);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка при загрузке книг:', error);
        if (error.status === 0) {
          this.errorMessage = 'Не удалось подключиться к серверу API. Проверьте, запущен ли он и настройки CORS.';
        } else {
          this.errorMessage = `Ошибка сервера: ${error.status} - ${error.message}. Подробности в консоли.`;
        }
      }
    });
  }

  viewBookDetails(id: number): void {
    this.router.navigate(['/book', id]);
  }
}