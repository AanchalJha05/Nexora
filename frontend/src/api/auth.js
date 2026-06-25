import axios from "axios";

const auth = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// REGISTER
export const registerUser = (data) => {
    return auth.post("register/", data);
};

// LOGIN
export const loginUser = (data) => {
    return auth.post("token/", data);
};

// LOGOUT (frontend only)
export const logoutUser = () => {
    localStorage.removeItem("token");
};