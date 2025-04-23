Kalabay Bexultan 23B031512
Dinmukhamed Zhiger 23B031277
Kopbergen Ashirali-Dulat 23b031345


📚 Bookuing Store — Full-Stack Web Project (Angular + Django REST)
🧩 Overview
Bookuing Store — это полнофункциональное веб-приложение для покупки книг, разработанное с использованием Angular на фронтенде и Django REST Framework на бэкенде. Пользователи могут регистрироваться, просматривать книги, добавлять их в корзину, оформлять заказы и отслеживать историю своих покупок.

✅ Project Implementation Requirements
🔸 Front-End (Angular)
✅ Сервисы и интерфейсы: реализованы Angular-сервисы (auth.service.ts, book.service.ts, cart.service.ts, order.service.ts), которые взаимодействуют с REST API.

✅ (click)-события с запросами: реализовано не менее 4 событий:

Добавить книгу в корзину

Удалить из корзины

Оформить заказ

Выйти из аккаунта

✅ [(ngModel)]: формы с двусторонней привязкой:

Форма логина, регистрации, поиска книги и оформления заказа.

✅ CSS стилизация: реализован стиль в духе Bookmate с использованием SCSS и кастомной темой.

✅ Маршрутизация: AppRoutingModule обеспечивает переходы между страницами (/books, /login, /cart, /orders).

✅ **ngFor и ngIf: используются для отображения списков книг, заказов, истории, условий загрузки и ошибок.

✅ JWT-аутентификация: реализован Interceptor для токенов, авторизация, logout-кнопка, защита маршрутов.

🔸 Back-End (Django + DRF)
✅ 4 модели:

Book, CartItem, Order, User

✅ Custom Model Manager (опционально): может быть реализован для фильтрации доступных книг.

✅ 2 ForeignKey-связи:

CartItem.book → Book

CartItem.user → User, Order.user → User

✅ Сериализаторы:

BookSerializer, OrderSerializer (используют ModelSerializer)

LoginSerializer, CartItemManualSerializer (на основе Serializer)

✅ FBV и CBV:

Function-Based Views: book_list_view, order_create_view

Class-Based Views: CartAPIView, OrderHistoryAPIView

✅ JWT (token-based authentication):

Используется rest_framework_simplejwt

Включены login, logout, token refresh

✅ CRUD: реализован для модели Book (создание, просмотр, редактирование, удаление).

✅ Привязка к пользователю:

При оформлении заказа или добавлении в корзину, объекты связываются с request.user.

---------------------------------------------------------------------------------------------------------------------------------------------------------------

📚 Bookuing Store — Full-Stack Web Application (Angular + Django REST Framework)
🧩 Overview
Bookuing Store is a full-featured online book shopping web application built using Angular for the frontend and Django REST Framework for the backend. Users can register, log in, browse books, add them to a cart, place orders, and view their order history.

✅ Project Implementation Requirements
🔸 Front-End (Angular)
✅ Interfaces and Services: Implemented Angular services like auth.service.ts, book.service.ts, cart.service.ts, and order.service.ts to interact with backend APIs.

✅ (click) events triggering API requests: Includes 4+ click-based actions:

Add book to cart

Remove from cart

Place order

Log out

✅ [(ngModel)] bindings: Used in forms for:

Login, registration, book filtering, and checkout

✅ CSS styling: All components styled with a clean, Bookmate-inspired CSS aesthetic using SCSS.

✅ Routing module: Configured navigation between routes (/books, /login, /cart, /orders) using AppRoutingModule.

✅ Directives: Uses *ngFor to render book/order lists, and *ngIf for conditional UI (e.g., errors, empty lists, loading states).

✅ JWT authentication:

Includes an HTTP interceptor

Login, logout, and route guards for protected pages

🔸 Back-End (Django + DRF)
✅ Defined 4+ models:

Book, CartItem, Order, User

✅ Optional: Custom model manager:

Can be added to filter available books or search

✅ 2+ ForeignKey relationships:

CartItem.book → Book, CartItem.user → User

Order.user → User

✅ Serializers:

ModelSerializer: BookSerializer, OrderSerializer

Serializer: LoginSerializer, CartItemSerializer

✅ Views:

Function-Based Views (FBV): book_list_view, order_create_view

Class-Based Views (CBV): CartAPIView, OrderHistoryAPIView

✅ Token-based authentication:

Implemented using SimpleJWT

Supports login, logout, and token refresh

✅ CRUD operations:

Full CRUD implemented for Book

✅ Authenticated user linkage:

Orders and cart items are associated with request.user
