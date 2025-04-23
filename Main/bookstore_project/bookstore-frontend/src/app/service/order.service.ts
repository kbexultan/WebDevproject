import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// // FE-2: Определение сервиса OrderService для взаимодействия с API заказов (получение истории).
export class OrderService {

  private apiUrl = 'http://127.0.0.1:8000/api/orders/'; // Используем 127.0.0.1 для единообразия

  constructor(private http: HttpClient) {}

  getOrderHistory(): Observable<any[]> {
    // // FE-3: Выполнение HTTP GET запроса к API для получения истории заказов. (Метод вызывается из компонента)
    return this.http.get<any[]>(this.apiUrl);
  }
}