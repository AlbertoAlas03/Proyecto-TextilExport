import { useState } from "react"
import Data from "../data/data"

const useSearch = () => {

    const url_search_product = Data + "search_products_code"
    const url_search_category = Data + "search_category_name"
    const url_search_user = Data + "search_user_last_name"
    const url_search_customer = Data + "search_customer_last_name"
    const url_search_sale = Data + "search_sale"
    const [productBycode, setproductBycode] = useState([]);
    const [categoryByname, setCategoryByName] = useState([]);
    const [userByLast_name, setUserByLast_name] = useState([]);
    const [customerByLast_name, setCustomerByLast_name] = useState([]);
    const [sale, setSale] = useState([]);

    const getProductByCode = async (code) => {

        const response = await fetch(url_search_product, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ code })

        })

        if (!response.ok) {
            const errorData = await response.json();
            setproductBycode([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setproductBycode(data.data);
        return data.data
    }


    const getCategoryByName = async (name) => {

        const response = await fetch(url_search_category, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ name })

        })

        if (!response.ok) {
            const errorData = await response.json();
            setCategoryByName([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setCategoryByName(data.data);
        return data.data
    }

    const getUserByLast_name = async (last_name) => {

        const response = await fetch(url_search_user, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ last_name })

        })

        if (!response.ok) {
            const errorData = await response.json();
            setUserByLast_name([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setUserByLast_name(data.data);
        return data.data
    }

    const getCustomerByLast_name = async (last_name) => {

        const response = await fetch(url_search_customer, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ last_name })

        })

        if (!response.ok) {
            const errorData = await response.json();
            setCustomerByLast_name([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setCustomerByLast_name(data.data);
        return data.data
    }

    const getSaleByProduct = async (name) => {

        const response = await fetch(url_search_sale, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ name })

        })

        if (!response.ok) {
            const errorData = await response.json();
            setSale([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setSale(data.data);
        return data.data
    }

    return { getProductByCode, productBycode, getCategoryByName, categoryByname, getUserByLast_name, userByLast_name, getCustomerByLast_name, customerByLast_name, getSaleByProduct, sale, setproductBycode, setCategoryByName, setUserByLast_name, setCustomerByLast_name }
}

export default useSearch