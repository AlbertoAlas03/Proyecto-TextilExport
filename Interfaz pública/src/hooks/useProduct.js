import React, { useState } from "react";
import Data from "../data/Data";

const useProduct = () => {

    const url_product = Data + "list_product";
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await fetch(url_product, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include"
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en el servidor");
            }

            const data = await response.json();
            setProducts(data.data);
        } catch (error) {
            console.log("Error al obtener los productos: ", error);
        }
    }

    return { getProducts, products }
}

export default useProduct;