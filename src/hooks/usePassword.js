import Data from "../data/data";

const usePassword = () => {

    const url_send_code = Data + "password/email"
    const url_change_password = Data + "password/change"

    const sendCode = async (email) => {

        const response = await fetch(url_send_code, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include", // Necesario para cookies (Sanctum)
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();

        return data
    }


    const changePassword = async (Data) => {

        const requestData = {
            email: Data.email,
            password: Data.password,
            password_confirmation: Data.password_confirmation,
            token: Data.token
        }

        const response = await fetch(url_change_password, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
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

    return { sendCode, changePassword }
}

export default usePassword