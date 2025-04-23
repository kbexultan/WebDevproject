import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

// // FE-1: Определение интерфейса Category для структурирования данных категории (используется внутри BookService).
export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
// // FE-2: Определение сервиса BookService для взаимодействия с API книг.
export class BookService {
  private apiUrl = 'http://127.0.0.1:8000/api/books/';

  constructor(private http: HttpClient) { }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}${id}/`);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Omit<Book, 'id' | 'category'> & { category_id: number }): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Omit<Book, 'category'> & { category_id?: number }): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}${id}/`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}