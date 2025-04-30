import { useState } from "react";
import Data from "../data/Data";

const useSearchBar = () => {

    const [data, setData] = useState([]);
    const [searchSale, setSearchSale] = useState([]);
    const url = Data + "search_products_category";
    const url_sale = Data + "search_sale_customer"

    const search = async (category) => {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ category })
        })

        if (!response.ok) {
            const errorData = await response.json();
            setData([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setData(data.data);
        return data.data
    }

    const searchSaleCustomer = async (saleData) => {

        const requestData = {
            id_customer: saleData.id_customer,
            code: saleData.code
        }

        const response = await fetch(url_sale, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify(requestData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            setSearchSale([]); // Limpia los datos anteriores en caso de error
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        setSearchSale(data.data);
        return data.data
    }

    return { search, data, searchSaleCustomer, searchSale, setData }

}

export default useSearchBar;