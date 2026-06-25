import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Checkout() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        api.get("profile/")
            .then((res) => {
                setProfile(res.data);
                setLoadingProfile(false);
            })
            .catch((err) => {
                console.log(err.response?.data);
                setLoadingProfile(false);
            });
    }, []);

    const total = cartItems.reduce(
        (acc, item) =>
            acc + Number(item.product.price) * item.quantity,
        0
    );

    const placeOrder = async () => {
        try {
            await api.post("orders/create/", {
                phone: profile?.phone,
                address: profile?.address,
            });
            toast.success("Order Placed Successfully 🎉");

            navigate("/success");
        } catch (err) {
            console.log(err.response?.data);
            toast.error("Order Failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT PANEL */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-md border border-gray-100 p-8">

                    <div className="mb-8">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Delivery
                        </h1>

                        <p className="text-sm text-gray-400 mt-1">
                            Verify your delivery details before placing the order
                        </p>
                    </div>

                    {loadingProfile ? (
                        <p className="text-gray-500">
                            Loading profile...
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-gray-50 border rounded-2xl p-4 hover:shadow-md transition">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                                        Username
                                    </p>

                                    <p className="font-medium text-gray-700">
                                        {profile?.username || "-"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 border rounded-2xl p-4 hover:shadow-md transition">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                                        Email
                                    </p>

                                    <p className="font-medium text-gray-700 overflow-hidden">
                                        {profile?.email || "-"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 border rounded-2xl p-4 hover:shadow-md transition">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                                        Phone
                                    </p>

                                    <p className="font-medium text-gray-700">
                                        {profile?.phone || "Not Added"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 border rounded-2xl p-4 hover:shadow-md transition">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                                        Address
                                    </p>

                                    <p className="font-medium text-gray-700">
                                        {profile?.address || "Not Added"}
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/profile")}
                                className="
                                    mt-6
                                    px-5
                                    py-3
                                    rounded-xl
                                    bg-gray-900
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-black
                                    hover:shadow-lg
                                    transition
                                "
                            >
                                Edit Profile
                            </button>
                        </>
                    )}

                </div>

                {/* RIGHT PANEL */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 p-6 h-fit sticky top-6">

                    <h2 className="text-sm font-medium text-gray-500 mb-5">
                        Summary
                    </h2>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">

                        {cartItems.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Your cart is empty
                            </p>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        bg-gray-50
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-sm
                                    "
                                >
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            {item.product.name}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <span className="font-semibold text-gray-700">
                                        ₹
                                        {Number(item.product.price) *
                                            item.quantity}
                                    </span>
                                </div>
                            ))
                        )}

                    </div>

                    <div className="border-t my-5"></div>

                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">

                        <span className="text-gray-500">
                            Total Amount
                        </span>

                        <span className="text-lg font-semibold text-gray-800">
                            ₹{total.toFixed(2)}
                        </span>

                    </div>

                    <button
                        onClick={placeOrder}
                        disabled={
                            !profile?.phone ||
                            !profile?.address ||
                            cartItems.length === 0
                        }
                        className={`
                            w-full
                            mt-5
                            py-3
                            rounded-xl
                            font-medium
                            transition-all
                            duration-200
                            ${
                                profile?.phone && profile?.address && cartItems.length>0
                                    ? "bg-gray-900 text-white hover:bg-black hover:shadow-lg"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }
                        `}
                    >
                        Place Order
                    </button>

                    {(!profile?.phone || !profile?.address && cartItems.length ===0) &&
                        !loadingProfile && (
                            <p className="text-xs text-red-500 text-center mt-3">
                                Please complete your profile before checkout
                            </p>
                        )}

                </div>

            </div>

        </div>
    );
}

export default Checkout;