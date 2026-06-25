import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
    const { cartItems } = useCart();
    const { logout } = useAuth();

    const token = localStorage.getItem("token");

    const cartItemCount = (cartItems || []).reduce(
        (total, item) => total + item.quantity,
        0
    );
    const handleLogout = () => {
        logout();
        toast.success("Logged Out");
    };

    return (
        <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center">

            {/* BRAND */}
            <Link
                to="/"
                className="text-xl font-medium tracking-wide text-gray-800 hover:text-gray-600 transition"
            >
                NEXORA
            </Link>

            {/* RIGHT MENU */}
            <div className="flex items-center gap-6 text-sm">

                {/* CART */}
                <Link
                    to="/cart"
                    className="relative text-gray-700 hover:text-gray-900 transition"
                >
                    🛒

                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-gray-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            {cartItemCount}
                        </span>
                    )}
                </Link>

                {/* ORDERS */}
                {token && (
                    <Link
                        to="/orders"
                        className="text-gray-600 hover:text-gray-900 transition"
                    >
                        Orders
                    </Link>
                )}
                {token && (
                    <Link
                        to="/wishlist"
                        className="text-gray-600 hover:text-red-500 transition"
                    >
                        ❤️
                    </Link>
                )}

                {/* AUTH */}
                {!token ? (
                    <>
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black transition"
                        >
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/profile"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Profile
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-500 transition"
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;