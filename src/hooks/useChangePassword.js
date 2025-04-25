import Data from "../data/Data"

const useChangePassword = () => {

    const url = Data + "password/change_password_customer"
    const url_email = Data + "password/send_code_customer"

    const SendEmail = async (email) => { // Función para enviar el correo electrónico de restablecimiento de contraseña

        const response = await fetch(url_email, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({
                email,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data; // Retorna la respuesta completa para manejarla en el componente

    }

    const changePassword = async (customerData) => {


        const requestData = {
            email: customerData.email,
            password: customerData.password,
            password_confirmation: customerData.password_confirmation,
            token: customerData.token
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        const data = await response.json();
        return data; // Retorna la respuesta completa para manejarla en el componente

    };

    return { changePassword, SendEmail }
}

export default useChangePassword