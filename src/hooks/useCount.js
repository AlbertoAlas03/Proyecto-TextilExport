import { useState } from "react";
import Data from '../data/data';

const useCount = () => {

    const url = Data + "count"
    const [count, setCount] = useState([]);

    const getCount = async () => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include", // Necesario para cookies (Sanctum)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en el servidor");
            }

            const data = await response.json();
            setCount(data.data); // Guardar las ofertas en el estado
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return { count, getCount };
}

export default useCount