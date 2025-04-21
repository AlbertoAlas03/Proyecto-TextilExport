import React, { useEffect, useState } from 'react';
import useLogin from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import usuario from '../assets/img/usuario.png'; // Importa la imagen de usuario
import { useAuth } from '../hooks/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useLogin();
    const navigate = useNavigate(); // navegación entre rutas
    const { user } = useAuth(); // Hook para verificar el estado del usuario
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Verifica si el usuario ya logueado
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]); //se ejecuta cuando el usuario cambia

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
                navigate('/dashboard', { replace: true });
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
                </div>
            </div >
        </div >
    );
}

export default Login;