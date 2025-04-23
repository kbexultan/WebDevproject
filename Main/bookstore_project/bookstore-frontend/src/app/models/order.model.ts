import { Book } from './book.model';

// // FE-1: Определение интерфейса OrderItem для структурирования данных элемента заказа от API.
export interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
}

// // FE-1: Определение интерфейса Order для структурирования данных заказа от API.
export interface Order {
  id: number;
  user: string;
  order_date: string;
  total_price: number;
  order_items: OrderItem[];
}