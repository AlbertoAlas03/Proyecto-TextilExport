import { useState } from "react";
import Data from "../data/Data";

const useSalesDetails = () => {

    const url_get = Data + "list_sales_customer";
    const [sales, setSales] = useState([]);

    const get_sales = async (id_customer) => {

        try {
            const response = await fetch(url_get, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include", // Necesario para cookies (Sanctum)
                body: JSON.stringify({ id_customer }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en el servidor");
            }

            const data = await response.json();
            setSales(data.data);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return { get_sales, sales }
}

export default useSalesDetails;