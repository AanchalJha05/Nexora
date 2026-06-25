import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    // LOGIN
    const login = (accessToken, userData = null) => {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
        setUser(userData);
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    // LOAD ON REFRESH
    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);

            
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isLoggedIn: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);