import { Book } from './book.model';

// // FE-1: Определение интерфейса CartItem для структурирования данных элемента корзины.
export interface CartItem {
  book: Book;
  quantity: number;
}