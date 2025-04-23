from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Category, Book, Order, OrderItem
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core import serializers as django_serializers
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter


from .serializers import (
    UserRegistrationSerializer,
    CategorySerializer,
    BookSerializer,
    OrderSerializer,
    OrderItemSerializer,
)

# // BE-5a: Определение Function-Based View (FBV) для деталей книги.
@api_view(['GET'])
def book_detail_view(request, id):
    book = get_object_or_404(Book, pk=id)
    serializer = BookSerializer(book)
    return Response(serializer.data)


# // BE-5a: Определение Function-Based View (FBV) для регистрации пользователя.
@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# // BE-5a: Определение Function-Based View (FBV) для выхода пользователя.
# // BE-6b: Реализация логики выхода пользователя (добавление токена в черный список).
@api_view(['POST'])
def logout_user(request):
    try:
        # // BE-6b: Получение refresh токена из тела запроса.
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        # // BE-6b: Добавление токена в черный список Simple JWT.
        token.blacklist()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"detail": "Invalid token or other error."}, status=status.HTTP_400_BAD_REQUEST)


# // BE-5b: Определение Class-Based View (CBV) для списка и создания категорий.
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# // BE-5b: Определение Class-Based View (CBV) для получения, обновления и удаления категории.
class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# // BE-5b: Определение ViewSet для CRUD операций с книгами.
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'id']
    search_fields = ['title', 'author', 'description']
    ordering_fields = ['title', 'author', 'price']


# // BE-5b: Определение ViewSet для CRUD операций с заказами.
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns orders for the current authenticated user.
        Uses prefetch_related to efficiently fetch the related OrderItem instances
        and their associated Book details in a single query per relation.
        """
        user = self.request.user
        if user.is_authenticated:
             return Order.objects.filter(user=user).prefetch_related('order_items__book')
        return Order.objects.none()


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_instance = self.perform_create(serializer)
        response_serializer = self.get_serializer(order_instance)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_create(self, serializer):
        """
        Handles creating the Order instance and the related OrderItem instances
        from the 'items' list in the request data.
        """
        book_items_data = self.request.data.get('items', [])

        if not book_items_data or not isinstance(book_items_data, list):
             raise serializers.ValidationError({"items": "No items provided or items is not a list."})

        # // BE-7a: Создание объекта Order с привязкой к аутентифицированному пользователю (request.user).
        order = Order.objects.create(user=self.request.user)

        total_price = 0
        order_items_to_create = []

        for item_data in book_items_data:
            if not isinstance(item_data, dict):
                print(f"Skipping invalid item data (not a dictionary): {item_data}")
                continue

            book_id = item_data.get('book_id')
            quantity = item_data.get('quantity', 1)

            if book_id is None or not isinstance(quantity, int) or quantity <= 0:
                print(f"Skipping invalid item data (missing book_id or invalid quantity): {item_data}")
                continue

            try:
                book = Book.objects.get(pk=book_id)
                order_item = OrderItem(
                    order=order,
                    book=book,
                    quantity=quantity
                )
                order_items_to_create.append(order_item)
                total_price += book.price * quantity

            except Book.DoesNotExist:
                print(f"Book with ID {book_id} does not exist. Cleaning up order {order.id}.")
                order.delete()
                raise serializers.ValidationError(f"Book with ID {book_id} does not exist.")
            except Exception as e:
                print(f"Error processing item {item_data}: {e}. Cleaning up order {order.id}.")
                order.delete()
                raise serializers.ValidationError(f"Error processing item: {e}")


        if order_items_to_create:
            OrderItem.objects.bulk_create(order_items_to_create)
        else:
            print(f"No valid order items created. Cleaning up empty order {order.id}.")
            order.delete()
            raise serializers.ValidationError({"items": "No valid items provided to create order."})


        order.total_price = total_price
        order.save()

        return order