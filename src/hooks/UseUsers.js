import React, { useState } from "react";
import Data from "../data/data";

const UseUsers = () => {

    const url_list = Data + "list_user"
    const url_delete = Data + "delete_user"
    const url_add = Data + "create_user"
    const url_update = Data + "update_user"
    const [User, setUser] = useState([]);

    const getUser = async () => {
        try {
            const response = await fetch(url_list, {
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
            setUser(data.data); // Guardando las ventas
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    const deleteUser = async (id_user) => {
        try {
            const response = await fetch(url_delete, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include", // Necesario para cookies (Sanctum)
                body: JSON.stringify({ id_user })
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

    const addUser = async (UserData) => {

        const requestData = {
            name: UserData.name,
            last_name: UserData.last_name,
            password: UserData.password,
            password_confirmation: UserData.password_confirmation,
            email: UserData.email,
            type: UserData.type
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

    const updateUser = async (UserData) => {

        const requestData = {
            id_user: UserData.id_user,
            name: UserData.name,
            last_name: UserData.last_name,
            password: UserData.password,
            password_confirmation: UserData.password_confirmation,
            email: UserData.email,
            type: UserData.type
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

    return { User, getUser, deleteUser, setUser, addUser, updateUser }

}

export default UseUsers