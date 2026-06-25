
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/',views.register_view),
    path('token/',TokenObtainPairView.as_view(),name ='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name = 'token_refresh'),
    path("products/", views.product_list),
    path("products/<int:pk>/", views.get_product),
    path("categories/", views.category_list),
    path("cart/",views.get_cart),
    path("cart/add/",views.add_to_cart),
    path("cart/remove/",views.remove_from_cart),
    path("cart/update/",views.update_cart_quantity),
    path("orders/create/",views.create_order),
    path("orders/", views.my_orders),
    path('profile/',views.get_profile),
    path('profile/update/',views.update_profile),
    path('wishlist/',views.get_wishlist),
    path("wishlist/add/",views.add_to_wishlist),
    path("wishlist/remove/",views.remove_wishlist)
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)