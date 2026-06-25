import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const total = cartItems.reduce(
        (acc, item) =>
            acc + Number(item.product.price) * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            {/* NARROWER + MORE PREMIUM CARD */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                {/* HEADER */}
                <div className="mb-4">
                    <h1 className="text-base font-medium text-gray-600">
                        My Cart
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Review your items before checkout
                    </p>
                </div>

                {/* ITEMS */}
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">

                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-10">
                            Your cart is empty
                        </p>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="
                                    flex items-center gap-3
                                    bg-gray-50
                                    border border-gray-100
                                    rounded-xl
                                    p-3
                                "
                            >

                                {/* IMAGE */}
                                <img
                                    src={`http://127.0.0.1:8000${item.product.image}`}
                                    className="w-14 h-14 object-cover rounded-lg border"
                                    alt=""
                                />

                                {/* NAME + PRICE */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-medium text-gray-700 truncate">
                                        {item.product.name}
                                    </h2>

                                    <p className="text-xs text-gray-500 mt-1">
                                        ₹{item.product.price}
                                    </p>
                                </div>

                                {/* QTY CONTROL (COMPACT) */}
                                <div className="flex items-center border rounded-lg overflow-hidden bg-white">

                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity - 1)
                                        }
                                        className="px-2 py-1 text-sm hover:bg-gray-100"
                                    >
                                        −
                                    </button>

                                    <span className="px-2 text-sm">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                        className="px-2 py-1 text-sm hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* REMOVE */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-xs text-gray-400 hover:text-red-500 ml-1"
                                >
                                    ✕
                                </button>

                            </div>
                        ))
                    )}
                </div>

                {/* SUMMARY */}
                <div className="mt-5 border-t pt-4">

                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Total Items</span>
                        <span>{cartItems.length}</span>
                    </div>

                    <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span className="text-gray-800">
                            ₹{total.toFixed(2)}
                        </span>
                    </div>

                    <Link to="/checkout">
                        <button className="w-full mt-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition active:scale-95">
                            Proceed to Checkout
                        </button>
                    </Link>

                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Secure checkout powered by Nexora
                    </p>

                </div>

            </div>
        </div>
    );
}

export default CartPage;