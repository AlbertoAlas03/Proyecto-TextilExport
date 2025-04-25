import Data from "../data/Data"

const useRegister = () => {

    const url_register = Data + "register"

    const register = async (customerData) => {

        const requestData = {
            name: customerData.name,
            last_name: customerData.last_name,
            email: customerData.email,
            password: customerData.password,
            password_confirmation: customerData.password_confirmation,
            address: customerData.address,
            phone_number: customerData.phone_number
        }

        try {
            const response = await fetch(url_register, {
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
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    }

    return { register }
}

export default useRegister