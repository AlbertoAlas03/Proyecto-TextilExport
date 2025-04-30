import Data from "../data/Data";

const useBuy = () => {

    const url_buy = Data + "buy"

    const buy = async (purchaseData) => {

            if (purchaseData.cardDetails.number.length !== 16) {
                throw new Error("Número de tarjeta inválido");
            }

            if (purchaseData.cardDetails.cvc.length < 3) {
                throw new Error("Código de seguridad inválido");
            }

            const requestData = {
                id_customer: purchaseData.id_customer,
                id_product: purchaseData.id_product,
                amount: purchaseData.amount
            }

            const response = await fetch(url_buy, {
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
                throw new Error(errorData.message || "Error en el servidor");
            }

            const data = await response.json();
            return data; //retornando data
    }

    return { buy }

}

export default useBuy;