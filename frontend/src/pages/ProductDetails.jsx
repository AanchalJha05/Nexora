import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/${id}/`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [id]);
    const handleAddToCart = () => {
        addToCart(product.id);
        toast.success("Added To Cart");
    };
    

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading product...
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 py-10 px-4">

                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* IMAGE SECTION */}
                        <div className="p-6 flex items-center justify-center bg-gray-50">

                            <img
                                src={
                                    product.image?.startsWith("http")
                                        ? product.image
                                        : `http://127.0.0.1:8000${product.image}`
                                }
                                alt={product.name}
                                className="w-full max-w-sm h-80 object-cover rounded-xl border"
                            />

                        </div>

                        {/* DETAILS SECTION */}
                        <div className="p-6 flex flex-col">

                            {/* TITLE */}
                            <h1 className="text-xl font-medium text-gray-700">
                                {product.name}
                            </h1>

                            {/* PRICE */}
                            <p className="text-2xl font-semibold text-gray-900 mt-2">
                                ₹{product.price}
                            </p>

                            {/* DESCRIPTION */}
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                                {product.description}
                            </p>

                            {/* DETAILS BOX */}
                            <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-500">

                                <p>Category: {product.category}</p>
                                <p>Product ID: {product.id}</p>
                                <p>✔ In Stock</p>
                                <p>🚚 Fast Delivery Available</p>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="mt-6 flex flex-col gap-3">

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium
                                               hover:bg-black transition active:scale-95"
                                >
                                    Add to Cart
                                </button>

                                <Link to="/cart">
                                    <button
                                        className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium
                                                   hover:bg-gray-50 transition"
                                    >
                                        Go to Cart
                                    </button>
                                </Link>

                            </div>

                            {/* BACK LINK */}
                            <div className="mt-6 text-center">
                                <Link
                                    to="/"
                                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                                >
                                    ← Back to Home
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ProductDetails;