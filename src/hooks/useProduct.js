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

    const addProduct = async (ProductData) => {

        const requestData = {
            id_category: ProductData.id_category,
            code: ProductData.code,
            name: ProductData.name,
            description: ProductData.description,
            imagen: ProductData.selectedImage,
            price: ProductData.price,
            stock: ProductData.stock
        }

        const response = await fetch(url_add, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data
    }

    const updateProduct = async (ProductData) => {

        const requestData = {
            id_product: ProductData.id_product,
            id_category: ProductData.id_category,
            code: ProductData.code,
            name: ProductData.name,
            description: ProductData.description,
            imagen: ProductData.imagen,
            price: ProductData.price,
            stock: ProductData.stock
        }

        const response = await fetch(url_update, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify(requestData)
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