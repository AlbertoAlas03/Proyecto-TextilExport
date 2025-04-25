import { useState } from "react";
import Data from "../data/Data";

const useShoppingCart = () => {

    const url = Data + "list_cart_items"
    const url_delete = Data + "delete_cart_item"
    const url_add = Data + "add_cart_item"
    const [items, setItems] = useState([]);

    const get_items = async (id_customer) => {

        try {
            const response = await fetch(url, {
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
            setItems(data.data);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    const delete_item = async (id) => {
        try {
            const response = await fetch(url_delete, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include", // Necesario para cookies (Sanctum)
                body: JSON.stringify({ id })
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

    const add_item = async (dataItem) => {

        const AddData = {
            id_customer: dataItem.id_customer,
            id_product: dataItem.id_product
        }

        const response = await fetch(url_add, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify(AddData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data
    }

    return { get_items, items, delete_item, add_item }
}

export default useShoppingCart;