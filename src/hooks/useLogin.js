import Data from "../data/data";
import { useAuth } from "./AuthContext"; // Importa el contexto de autenticación

const useLogin = () => {

    const url_login = Data + "login_user"

    const { setUser } = useAuth();

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

        const DataUser = {
            id: data.usuario.id,
            name: data.usuario.name,
            last_name: data.usuario.last_name,
            email: data.usuario.email,
            type: data.usuario.type
        }


        sessionStorage.setItem("user", JSON.stringify(DataUser)); // Guarda el usuario en sessionStorage
        setUser(DataUser);
        console.log("Usuario autenticado:", DataUser);
        return DataUser; // Retorna la respuesta completa para manejarla en el componente
    };

    return { login }
}

export default useLogin;