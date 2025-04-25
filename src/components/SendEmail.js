import React, { useState, useEffect } from 'react';
import Email from '../assets/img/email.png';
import useChangePassword from '../hooks/useChangePassword'; // Importa el hook para cambiar la contraseña
import { useNavigate } from 'react-router-dom'; // Importa el hook para la navegación entre rutas
import { useAuth } from '../hooks/AuthContext';

const SendEmail = () => {

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const { SendEmail } = useChangePassword(); // Hook para enviar el correo electrónico de restablecimiento de contraseña y cambio de contraseña
    const navigate = useNavigate(); // navegación entre rutas
    const [loading, setLoading] = useState(false);
    const { customer } = useAuth(); // Hook para verificar el estado del usuario

    // Verifica si el usuario ya está autenticado y redirige a la página de inicio
    useEffect(() => {
        if (customer) {
            navigate('/', { replace: true }); // Redirige a la página de inicio si el usuario ya está autenticado
        }
    }, [customer, navigate]); //se ejecuta cuando el usuario cambia

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Inicia el loading al enviar el formulario

        if (!email) {
            setError("Por favor, ingrese su correo electrónico");
            setLoading(false);
            return;
        }
        try {
            const response = await SendEmail(email);

            if (response) {
                alert("Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico, porfavor revisa tu bandeja de entrada.");
                // Si la respuesta es exitosa, redirigir al usuario a la página de inicio
                navigate('/login');
            }
        } catch (err) {
            console.error("Error al enviar correo:", err);
            setError(err.message || "Error al enviar el correo electrónico. Intente de nuevo.");
        } finally {
            setLoading(false); // Finaliza el loading después de la respuesta
        }
    };


    
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg rounded-3 w-75" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Restablece tu contraseña</h2>
                    <img src={Email} alt="Contraseña" className="img-fluid mx-auto d-block mb-4" style={{ width: '100px', height: '100px' }} />
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-x-circle-fill me-2"></i>
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <i className="bi bi-hourglass-split me-2"></i>
                            Procesando...
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Tu correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Ingrese su correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            {loading ? (
                                <>
                                    <i className="bi bi-arrow-repeat me-2 spin"></i> Procesando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-envelope-fill me-2"></i>
                                    Enviar código de restablecimiento
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SendEmail;