from django.contrib import admin

from .models import Category,Product,Order,OrderItem,UserProfile,Cart,CartItem


from django.contrib.auth.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username","password","email", "is_staff", "is_active")
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)






