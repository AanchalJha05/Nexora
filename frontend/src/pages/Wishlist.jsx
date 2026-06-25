import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, fetchCartFromBackend } = useCart();

    const fetchWishlist = () => {
        api.get("wishlist/")
            .then((res) => {
                console.log("WISHLIST API RESPONSE:", res.data);
                setWishlist(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.response?.data);
                setWishlist([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            await api.post("wishlist/remove/",{
                product_id: productId,

            });

            toast.success("Removed From Wishlist");
            setWishlist((prev) =>
                prev.filter((item) => item.product.id !== productId)
        );
            

            
        }catch (err) {
            console.log(err.response?.data);
            toast.error("Failed To Remove");
        }
            

        
    };

    const moveToCart = async (productId) => {
        try {
            await api.post("cart/add/", {
                product_id: productId,
                quantity: 1,
            });

            toast.success("Added To Cart 🛒");
            
            await fetchCartFromBackend();

        } catch (err) {
            console.log(err.response?.data);
            toast.error("Failed To Add");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="p-8 text-center">
                    Loading Wishlist...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto p-6">

                <h1 className="text-2xl font-bold mb-6">
                    My Wishlist ❤️
                </h1>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow">
                        <h2 className="text-lg font-medium text-gray-600">
                            Your Wishlist Is Empty
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Save products you like here.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow
                                    overflow-hidden
                                    hover:shadow-lg
                                    transition
                                "
                            >
                                <img
                                    src={
                                        item.product.image?.startsWith("http")
                                            ? item.product.image
                                            : `http://127.0.0.1:8000${item.product.image}`
                                    }
                                    alt={item.product.name}
                                    className="
                                        w-full
                                        h-52
                                        object-cover
                                    "
                                />

                                <div className="p-4">

                                    <h2 className="font-semibold text-gray-800">
                                        {item.product.name}
                                    </h2>

                                    <p className="mt-2 text-lg font-bold text-gray-700">
                                        ₹{item.product.price}
                                    </p>

                                    <div className="flex gap-2 mt-4">

                                        <button
                                            onClick={() =>
                                                moveToCart(
                                                    item.product.id
                                                )
                                            }
                                            className="
                                                flex-1
                                                bg-gray-900
                                                text-white
                                                py-2
                                                rounded-xl
                                                hover:bg-black
                                                transition
                                            "
                                        >
                                            Move To Cart
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeFromWishlist(
                                                    item.product.id
                                                )
                                            }
                                            className="
                                                px-4
                                                bg-red-100
                                                text-red-600
                                                rounded-xl
                                                hover:bg-red-200
                                                transition
                                            "
                                        >
                                            ✕
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </>
    );
}

export default Wishlist;