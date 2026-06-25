from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product, Category, Cart, CartItem,Order,OrderItem,UserProfile,Wishlist
from .serializer import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    UserSerializer,
    RegisterSerializer,
    OrderSerializer,
    UserProfileSerializer,
    WishlistSerializer
)


# REGISTER

@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created successfully",
            "user": UserSerializer(user).data
        }, status=201)

    return Response(serializer.errors, status=400)



# LOGIN (JWT)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })



# PRODUCTS

@api_view(["GET"])
def product_list(request):

    products = Product.objects.all()

    # Search
    search = request.GET.get("search")

    if search:
        products = products.filter(
            name__icontains=search
        )

    # Category Filter
    category = request.GET.get("category")

    if category:
        products = products.filter(
            category__id=category
        )

    # Sorting
    sort = request.GET.get("sort")

    if sort == "price_low":
        products = products.order_by("price")

    elif sort == "price_high":
        products = products.order_by("-price")

    serializer = ProductSerializer(products,many=True,context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def get_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)



# CART


@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response(CartSerializer(cart).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")

    product = Product.objects.get(id=product_id)

    cart, _ = Cart.objects.get_or_create(user=request.user)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not created:
        item.quantity += 1
        item.save()

    return Response({"message": "Added to cart"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get("item_id")
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message": "Removed"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    item = CartItem.objects.get(id=item_id)
    item.quantity = quantity
    item.save()

    return Response({"message": "Updated"})   


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):

    print("USER:", request.user)
    profile, _ = UserProfile.objects.get_or_create(
        user=request.user
    )

    if not profile.phone:
        return Response(
            {"error": "Please add phone number in profile"},
            status=400
        )

    if not profile.address:
        return Response(
            {"error": "Please add address in profile"},
            status=400
        )

    try:
        cart = Cart.objects.get(user=request.user)
        print("CART FOUND:", cart.id)

    except Cart.DoesNotExist:
        return Response(
            {"error": "Cart not found"},
            status=404
        )

    cart_items = cart.items.all()

    print("ITEM COUNT:", cart_items.count())

    if not cart_items.exists():
        return Response(
            {"error": "Cart is empty"},
            status=400
        )

    total_amount = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    print("TOTAL:", total_amount)

    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
    )

    print("ORDER CREATED:", order.id)

    for item in cart_items:

        print("ADDING:", item.product.name)

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )
    cart_items.delete()
    cart_items = cart.items.all()

    serializer = OrderSerializer(order)

    return Response(
        {
            "message": "Order created successfully",
            "order": serializer.data,
        }
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):

    profile, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    serializer = UserProfileSerializer(profile)

    return Response(serializer.data)



@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    profile, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    serializer = UserProfileSerializer(
        profile,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=400
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get("product_id")
    product = Product.objects.get(id=product_id)
    Wishlist.objects.get_or_create(
        user = request.user,
        product= product

    )
    return Response({"message":"Added to Wishlist"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    items = Wishlist.objects.filter(user = request.user)
    serializer = WishlistSerializer(items,many =True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_wishlist(request):
    product_id = request.data.get("product_id")

    print("REMOVE PRODUCT ID:", product_id)

    item = Wishlist.objects.filter(
        user=request.user,
        product_id=product_id
    )

    if item.exists():
        item.delete()
        return Response({"message": "Removed"})
    
    return Response({"error": "Not found"}, status=404)




