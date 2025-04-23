// // FE-1: Определение интерфейса Book для структурирования данных книги от API.
export interface Book {
  id: number;
  category: Category;
  title: string;
  author: string;
  price: number;
  description: string;
}

export interface Category {
  id: number;
  name: string;
}