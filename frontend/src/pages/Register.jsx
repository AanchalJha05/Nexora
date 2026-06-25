import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                username,
                email,
                password,
                password2,
            });

            toast.success("Account Created Successfully");
            navigate("/login");
        } catch (err) {
            toast.success("Account Creation Failed");
            console.log(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* FLOATING CARD */}
            <form
                onSubmit={handleRegister}
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
                        Create account
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Join Nexora and start shopping
                    </p>
                </div>

                {/* INPUTS */}
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

                <input
                    placeholder="Email"
                    className="
                        w-full mb-3 px-3 py-2 rounded-xl
                        border border-gray-200 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-400
                        hover:border-gray-300 transition
                    "
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="
                        w-full mb-3 px-3 py-2 rounded-xl
                        border border-gray-200 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-400
                        hover:border-gray-300 transition
                    "
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    placeholder="Confirm Password"
                    type="password"
                    className="
                        w-full mb-4 px-3 py-2 rounded-xl
                        border border-gray-200 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-400
                        hover:border-gray-300 transition
                    "
                    onChange={(e) => setPassword2(e.target.value)}
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
                    {loading ? "Creating account..." : "Register"}
                </button>

                {/* FOOTER */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Secure registration powered by Nexora
                </p>

            </form>
        </div>
    );
}

export default Register;