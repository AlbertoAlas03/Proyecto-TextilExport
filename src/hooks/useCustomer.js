import { useState } from 'react';
import Data from '../data/data';

const useCustomer = () => {

    const url_list = Data + "list_customer"
    const url_disable = Data + "disable_customer"
    const url_update = Data + "update_customer"
    const url_enable = Data + "enable_customer"

    const [customer, setCustomer] = useState([]);

    const getCustomers = async () => {
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
            setCustomer(data.data); // Guardando los clientes
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    const disableCustomer = async (id_customer) => {

        const response = await fetch(url_disable, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ id_customer })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data;
    }


    const enableCustomer = async (id_customer) => {

        const response = await fetch(url_enable, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ id_customer })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data;
    }

    const updateCustomer = async (updateData) => {

        const responseData = {
            id_customer: updateData.id_customer,
            name: updateData.name,
            last_name: updateData.last_name,
            email: updateData.email,
            password: updateData.password,
            password_confirmation: updateData.password_confirmation,
            address: updateData.address,
            phone_number: updateData.phone_number
        }

        const response = await fetch(url_update, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify(responseData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data;
    }

    return { customer, getCustomers, disableCustomer, updateCustomer, enableCustomer }
}

export default useCustomer