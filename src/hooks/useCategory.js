import React, { useState } from "react";
import Data from "../data/data";

const useCategory = () => {

    const url = Data + "list_category"
    const url_delete = Data + "delete_category"
    const url_add = Data + "create_category"
    const url_update = Data + "update_category"

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

    const deleteCategory = async (id_category) => {

        const response = await fetch(url_delete, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ id_category })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data

    }

    const addCategory = async (CategoryData) => {

        const requestData = {
            name: CategoryData.name,
            description: CategoryData.description
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

    const updateCategory = async (CategoryData) => {

        const requestData = {
            id_category: CategoryData.id_category,
            name: CategoryData.name,
            description: CategoryData.description
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

    return { category, getCategory, deleteCategory, setCategory, addCategory, updateCategory }
}

export default useCategory