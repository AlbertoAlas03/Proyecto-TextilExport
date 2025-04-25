import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [customer, setCustomer] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const savedCustomer = sessionStorage.getItem("customer"); //obtener cliente del sessionStorage
        if (savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
            setIsVerified(JSON.parse(savedCustomer).verify === "verificado")
        }
    }, []);

    return (
        <AuthContext.Provider value={{ customer, isVerified, setCustomer, setIsVerified }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);