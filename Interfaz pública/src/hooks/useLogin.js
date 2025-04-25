import Data from "../data/Data";
import { useAuth } from "./AuthContext";

const useLogin = () => {

    const url_login = Data + "login_customer"
    const { setCustomer, setIsVerified } = useAuth();

    const login = async (email, password) => {

        const response = await fetch(url_login, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();

        sessionStorage.setItem("customer", JSON.stringify(data.usuario)); // Guarda el usuario en sessionStorage
        setCustomer(data.usuario);
        setIsVerified(data.usuario.verify === "verificado");
        return data; // Retorna la respuesta completa para manejarla en el componente
    }

    const logout = async () => {
        try {
            sessionStorage.removeItem("customer");
            setCustomer(null);
            setIsVerified(false);
            return { message: "cliente deslogueado" }
        } catch (error) {
            console.log("error al cerrar sesión: ", error);
        }
    }


    return { login, logout }

}

export default useLogin;