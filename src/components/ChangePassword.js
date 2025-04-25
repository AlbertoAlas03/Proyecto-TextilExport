import React, { useEffect } from 'react';
import { useState } from 'react';
import useChangePassword from '../hooks/useChangePassword';
import { useNavigate } from 'react-router-dom';
import Change_password_img from '../assets/img/password.png'; // Importa la imagen de usuario
import { useAuth } from '../hooks/AuthContext';

const ChangePassword = () => {

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [token, SetToken] = useState('');
    const { changePassword } = useChangePassword(); // Hook para enviar el correo electrónico de restablecimiento de contraseña y cambio de contraseña
    const navigate = useNavigate(); // navegación entre rutas
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
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

        if (!email || !password || !token || !passwordConfirmation) {
            setError("Por favor, ingrese los campos requeridos");
            setLoading(false);
            return;
        }
        try {
            const customerData = {
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                token: token
            }
            const response = await changePassword(customerData);

            if (response) {
                alert("Contraseña restablecida con éxito");
                // Si la respuesta es exitosa, redirigir al usuario a la página de inicio
                navigate('/login');
            }
        } catch (err) {
            console.error("Error al cambiar contraseña:", err);
            setError(err.message || "Error al cambiar contraseña. Intente de nuevo.");
        } finally {
            setLoading(false); // Finaliza el loading después de la respuesta
        }
    };

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }


    const togglePasswordConfirmationVisibility = (e) => {
        e.preventDefault();
        setShowPasswordConfirmation(!showPasswordConfirmation);
    }



    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg rounded-3 w-75" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Restablece tu contraseña</h2>
                    <img src={Change_password_img} alt="Contraseña" className="img-fluid mx-auto d-block mb-4" style={{ width: '100px', height: '100px' }} />
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
                        <div className="mb-4">
                            <label className="form-label">Tu correo electrónico</label>
                            <input
                                type="email"
                                className="form-control email"
                                placeholder="Ingrese su correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Nueva contraseña</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control password"
                                    placeholder="Ingrese la nueva contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Confirmar contraseña</label>
                            <div className="input-group">
                                <input
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    className="form-control password"
                                    placeholder="Ingrese la nueva contraseña"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    disabled={loading}
                                />
                                <button className="input-group-text" onClick={togglePasswordConfirmationVisibility}><i className={showPasswordConfirmation ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="token" className="form-label">Código recibido</label>
                            <input
                                type="text"
                                id="token"
                                className="form-control"
                                placeholder="Ingrese el código recibido"
                                value={token}
                                onChange={(e) => SetToken(e.target.value)}
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
                                    <i className="bi bi-key me-2"></i>
                                    Restablecer contraseña
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;