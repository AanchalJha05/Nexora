import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
const CartContext = createContext();
import { Link } from "react-router-dom";
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    
    // FETCH CART FROM BACKEND
    
    const fetchCartFromBackend = async () => {
        try {
            const res = await api.get("cart/");
            setCartItems(res.data.items || []);
        } catch (err) {
            console.log("Cart fetch error:", err.response?.data);
        }
    };
    

    // Load cart on first render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchCartFromBackend();
        }
    }, []);

    
    // ADD TO CART
    
    const addToCart = async (productId) => {
        try {
            console.log("ADDING PRODUCT ID:", productId);
            await api.post("cart/add/", {
                product_id: productId,
            });

            fetchCartFromBackend(); // refresh UI
        } catch (err) {
            console.log("ADD TO CART ERROR:",err.response?.data);
        }
    };

    
    // REMOVE FROM CART
    
    const removeFromCart = async (itemId) => {
        try {
            await api.post("cart/remove/", {
                item_id: itemId,
            });

            fetchCartFromBackend();
        } catch (err) {
            console.log("Cart fetch error:", err.response?.data || err.message);
        }
    };

    
    // UPDATE QUANTITY
    
    const updateQuantity = async (itemId, quantity) => {
        try {
            if (quantity < 1) return;

            await api.post("cart/update/", {
                item_id: itemId,
                quantity: quantity,
            });

            fetchCartFromBackend();
        } catch (err) {
            console.log("Cart fetch error:", err.response?.data || err.message);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                fetchCartFromBackend,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);