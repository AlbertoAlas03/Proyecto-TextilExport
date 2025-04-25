import React, { useState, useEffect } from "react";
import usuario from '../assets/img/bloqueo-de-usuario.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import useLogin from "../hooks/useLogin";

const Login = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { customer } = useAuth();
    const { login } = useLogin();
    const navigate = useNavigate();

    useEffect(() => {
        if (customer) {
            navigate('/', { replace: true });
        }
    }, [customer, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Inicia el loading al enviar el formulario

        if (!email || !password) {
            setError("Por favor, ingrese la información requerida");
            setLoading(false);
            return;
        }
        try {
            const response = await login(email, password);

            if (response.message === "Inicio de sesión exitoso") {
                // Si la respuesta es exitosa, redirigir al usuario a la página de inicio
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError(err.message || "Error al iniciar sesión. Intente de nuevo.");
        } finally {
            setLoading(false); // Finaliza el loading después de la respuesta
        }
    };

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg rounded-3 w-75" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Iniciar Sesión</h2>
                    <img src={usuario} alt="Usuario" className="img-fluid mx-auto d-block mb-4" style={{ width: '100px', height: '100px' }} />
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-x-circle-fill me-2"></i>
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <i className="bi bi-hourglass-split me-2"></i>
                            Iniciando sesión...
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label" style={{ fontSize: '1.1rem' }}>Correo electrónico</label>
                            <input type="email" className="form-control form-control-lg" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese su correo electrónico" style={{ fontSize: '1.1rem' }} disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label" style={{ fontSize: '1.1rem' }}>Contraseña</label>
                            <div className="input-group">
                                <input type={showPassword ? 'text' : 'password'} className="form-control form-control-lg" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingrese su contraseña" style={{ fontSize: '1.1rem' }} disabled={loading}
                                />
                                <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                            <a type="button" onClick={() => navigate('/send-email')} className="text-decoration-none text-primary" style={{ fontSize: '1rem' }}>
                                <i className="bi bi-envelope"></i> ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                            <a type="button" onClick={() => navigate('/change-password')} className="text-decoration-none text-primary" style={{ fontSize: '1rem' }}>
                                <i className="bi bi-key"></i> Restablecer contraseña
                            </a>
                        </div>

                        <div className="text-center mb-4">
                            <button type="submit" className="btn btn-primary w-100 btn-lg">
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat me-2 spin"></i> Iniciado sesión...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Iniciar Sesión
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4" style={{ fontSize: '1.1rem' }}>
                        ¿No tienes cuenta? <a type="button" onClick={() => navigate('/register')} className="text-decoration-none text-primary">Regístrate</a>
                    </p>
                </div>
            </div >
        </div >
    )
}

export default Login;