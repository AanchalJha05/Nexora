import { Link } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";

function ProductCard({ product }) {

    const addToWishlist = async (productId) => {
        try {
            await api.post("wishlist/add/", {
                product_id: productId,
            });

            toast.success("Added To Wishlist ❤️");

        } catch (err) {
            toast.error("Failed To Add");
        }
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div
                className="
                    bg-white
                    rounded-lg
                    shadow-sm
                    hover:shadow-2xl
                    hover:scale-105
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    p-2
                    w-full
                "
            >
                <img
                    src={
                        product.image?.startsWith("http")
                            ? product.image
                            : `http://127.0.0.1:8000${product.image}`
                    }
                    alt={product.name}
                    className="
                        w-full
                        h-28
                        object-cover
                        rounded-md
                        mb-2
                    "
                />

                <div className="flex justify-between items-center gap-2">

                    <h2 className="text-xs font-semibold text-gray-800 truncate">
                        {product.name}
                    </h2>

                    <button
                        className="text-red-500 hover:scale-125 transition"
                        onClick={(e) => {
                            e.preventDefault();
                            addToWishlist(product.id);
                        }}
                    >
                        ❤️
                    </button>

                </div>

                <p className="text-xs font-semibold text-gray-600">
                    ₹{product.price}
                </p>

            </div>
        </Link>
    );
}

export default ProductCard;