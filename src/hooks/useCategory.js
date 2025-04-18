import React, { useState } from "react";
import Data from "../data/data";

const useCategory = () => {

    const url = Data + "list_category"
    const [category, setCategory] = useState([])

    const getCategory = async () => {
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
            setCategory(data.data); // Guardando las categorias
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return { category, getCategory }
}

export default useCategory