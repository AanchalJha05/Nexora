import { useEffect, useState } from "react";
import api from "../api/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("orders/")
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusIndex = (status) => {
        switch (status) {
            case "pending":
                return 1;
            case "confirmed":
                return 2;
            case "shipped":
                return 3;
            case "delivered":
                return 4;
            default:
                return 1;
        }
    };

    const steps = ["Confirmed", "Packed", "Shipped", "Delivered"];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-lg font-medium text-gray-600">
                        Order History
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Track your purchases in real time
                    </p>
                </div>

                <div className="space-y-5">

                    {orders.map((order) => {
                        const activeStep = getStatusIndex(order.status);

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                            >

                                {/* TOP */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-sm font-medium text-gray-700">
                                        Order #{order.id}
                                    </h2>

                                    <span className="text-sm font-semibold text-gray-800">
                                        ₹{order.total_amount}
                                    </span>
                                </div>

                                {/* TRACKING TIMELINE */}
                                <div className="mt-5">

                                    <div className="flex justify-between relative">

                                        {/* LINE BACKGROUND */}
                                        <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-200"></div>

                                        {/* PROGRESS LINE */}
                                        <div
                                            className="absolute top-2 left-0 h-0.5 bg-green-500 transition-all duration-700"
                                            style={{
                                                width: `${
                                                    ((activeStep - 1) / (steps.length - 1)) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>

                                        {steps.map((step, index) => {
                                            const isActive = index < activeStep;

                                            return (
                                                <div
                                                    key={step}
                                                    className="flex flex-col items-center relative z-10"
                                                >
                                                    {/* DOT */}
                                                    <div
                                                        className={`
                                                            w-4 h-4 rounded-full border-2
                                                            transition-all duration-500
                                                            ${
                                                                isActive
                                                                    ? "bg-green-500 border-green-500 scale-110"
                                                                    : "bg-white border-gray-300"
                                                            }
                                                        `}
                                                    ></div>

                                                    {/* LABEL */}
                                                    <p
                                                        className={`
                                                            text-[10px] mt-2
                                                            transition-all duration-300
                                                            ${
                                                                isActive
                                                                    ? "text-green-600 font-medium"
                                                                    : "text-gray-400"
                                                            }
                                                        `}
                                                    >
                                                        {step}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ITEMS */}
                                <div className="mt-6 border-t pt-4 space-y-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-gray-600">
                                                {item.product.name} × {item.quantity}
                                            </span>

                                            <span className="text-gray-800 font-medium">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default Orders;

//django me 401 aa rha h kyuki
//that means Chrome is navigating to the page like a normal website.
//And notice what's missing:

//Authorization: Bearer eyJ...

//There is no Authorization header.
//so Django correctly responds:

//{
  //  "detail": "Authentication credentials were not provided."
//}
//

// IN SHORT 
//This sends NO token → Django correctly responds:

//401 Unauthorized
//Authentication credentials were not provided.

// This is EXPECTED BEHAVIOR