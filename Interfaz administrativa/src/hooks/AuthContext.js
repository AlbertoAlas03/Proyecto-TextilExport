import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(); // Creación del contexto de autenticación para compartir el estado de autenticación entre componentes

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = sessionStorage.getItem("user"); //obtener usuarios del sesión storage
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);