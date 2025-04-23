from django.db import models
from django.contrib.auth.models import User

# // BE-1: Определение модели UserProfile.
class UserProfile(models.Model):
    # // BE-3: Определение связи OneToOneField с моделью User.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

# // BE-1: Определение модели Category.
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# // BE-1: Определение модели Book.
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # // BE-3: Определение связи ForeignKey с моделью Category.
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

# // BE-1: Определение модели OrderItem.
class OrderItem(models.Model):
    # // BE-3: Определение связи ForeignKey с моделью Order.
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='order_items')
    # // BE-3: Определение связи ForeignKey с моделью Book.
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
         return f"{self.quantity} x {self.book.title} in Order #{self.order.id}"

    class Meta:
        unique_together = ('order', 'book')

# // BE-1: Определение модели Order.
class Order(models.Model):
    # // BE-3: Определение связи ForeignKey с моделью User.
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # // BE-3: Определение связи ManyToManyField с моделью Book через промежуточную модель OrderItem.
    items = models.ManyToManyField(Book, through='OrderItem')

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"