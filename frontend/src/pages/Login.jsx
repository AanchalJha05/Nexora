import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("token/", {
                username,
                password,
            });

            localStorage.setItem("token", res.data.access);

            toast.success("Login Successful");
            navigate("/");
        } catch (err) {
            toast.error("Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* FLOATING CARD */}
            <form
                onSubmit={handleLogin}
                className="
                    w-full max-w-sm
                    bg-white
                    rounded-2xl
                    border border-gray-100
                    p-6

                    shadow-sm
                    hover:shadow-2xl
                    hover:-translate-y-2
                    hover:scale-[1.02]

                    transition-all duration-300 ease-out
                "
            >

                {/* HEADER */}
                <div className="mb-6 text-center">
                    <h2 className="text-lg font-medium text-gray-700">
                        Welcome back
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Login to your account
                    </p>
                </div>

                {/* USERNAME */}
                <input
                    placeholder="Username"
                    className="
                        w-full mb-3 px-3 py-2 rounded-xl
                        border border-gray-200 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-400
                        hover:border-gray-300 transition
                    "
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* PASSWORD */}
                <input
                    placeholder="Password"
                    type="password"
                    className="
                        w-full mb-4 px-3 py-2 rounded-xl
                        border border-gray-200 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-400
                        hover:border-gray-300 transition
                    "
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* BUTTON */}
                <button
                    disabled={loading}
                    className="
                        w-full py-2.5 rounded-xl
                        bg-gray-900 text-white text-sm font-medium

                        hover:bg-black
                        hover:shadow-lg
                        hover:scale-[1.01]

                        active:scale-95
                        transition-all duration-200
                    "
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* FOOTER */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Secure login powered by Nexora
                </p>

            </form>
        </div>
    );
}

export default Login;