import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { HomepageComponent } from './components/homepage/homepage.component';

// // FE-6: Определение массива маршрутов (routes) для навигации в приложении.
export const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book/:id', component: BookDetailsComponent },
];

@NgModule({
  // // FE-6: Конфигурация корневого модуля маршрутизации с использованием определенного массива routes.
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }