from django.contrib import admin
from .models import Order, OrderItem, Book, Category, UserProfile
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
admin.site.register(User, CustomUserAdmin)

admin.site.register(UserProfile)

admin.site.register(Book)
admin.site.register(Category)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    fields = ['book_details', 'quantity']
    readonly_fields = ['book_details', 'quantity']

    def book_details(self, instance):
        if instance.book:
             return f"{instance.book.title} by {instance.book.author} (${instance.book.price})"
        return "N/A"
    book_details.short_description = 'Book'

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_date', 'total_price')
    list_filter = ('order_date', 'user')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]
    readonly_fields = ('user', 'order_date', 'total_price')

try:
    admin.site.unregister(Order)
except admin.sites.NotRegistered:
    pass

admin.site.register(Order, OrderAdmin)