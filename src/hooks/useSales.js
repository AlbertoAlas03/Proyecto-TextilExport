import React, { useState } from "react";
import Data from "../data/data";

const useSales = () => {

    const url = Data + "list_sale"
    const [sales, setSales] = useState([]);

    const getSales = async () => {
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
            setSales(data.data); // Guardando las ventas
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return { sales, getSales }

}

export default useSales