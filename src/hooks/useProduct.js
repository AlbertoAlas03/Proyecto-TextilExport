import { useState } from "react";
import Data from "../data/data";

const useProduct = () => {

    const url = Data + "list_product"
    const [product, setProduct] = useState([])

    const getProduct = async () => {
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
            setProduct(data.data); // Guardar las ofertas en el estado
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return { product, getProduct }

}

export default useProduct