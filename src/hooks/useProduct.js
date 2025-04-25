import { useState } from "react";
import Data from "../data/data";

const useProduct = () => {

    const url = Data + "list_product"
    const url_delete = Data + "delete_product"
    const url_add = Data + "create_product"
    const url_update = Data + "update_product"

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
            setProduct(data.data); // Guardando los productos
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    const deleteProduct = async (id_product) => {
        try {
            const response = await fetch(url_delete, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include", // Necesario para cookies (Sanctum)
                body: JSON.stringify({ id_product })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en el servidor");
            }

            const data = await response.json();
            return data
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    const addProduct = async (formData) => {

        const response = await fetch(url_add, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data
    }

    const updateProduct = async (formData) => {

        const response = await fetch(url_update, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-HTTP-Method-Override": "PUT"
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data
    }

    return { product, getProduct, deleteProduct, setProduct, addProduct, updateProduct }

}

export default useProduct