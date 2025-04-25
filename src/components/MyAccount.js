import { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import usePassword from '../hooks/usePassword';

const MyAccount = () => {

    const { user } = useAuth();
    const { sendCode, changePassword } = usePassword();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [token, setToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFormPassword, setShowFormPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSendCode = async () => {
        setError(null);
        setIsProcessing(true);
        setShowModal(false);
        setEmail(email);
        try {
            const response = await sendCode(email);
            if (response.message === "Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico") {
                alert("Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico");
                setIsProcessing(false);
                setShowFormPassword(true);
            }

        } catch (error) {
            setError(error.message);
            console.log("Error al enviar el codigo: ", error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    const ChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);
        if (!password || !passwordConfirmation || !token) {
            setError("Por favor ingresa la información requerida");
            setIsProcessing(false);
            return;
        }

        try {

            const Data = {
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                token: token
            }

            const response = await changePassword(Data);

            if (response.message === "Contraseña restablecida con éxito") {
                alert("Contraseña restablecida con éxito");
                setIsProcessing(false);
                setShowFormPassword(false);
                ClearForm();
            }
        } catch (error) {
            setError(error.message);
            console.log("Error al cambiar la contraseña: ", error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibilityConfirmation = (e) => {
        e.preventDefault();
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const ClearForm = () => {
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        setToken("");
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-person-circle"></i> Mi cuenta</h1>
            </div>
            <div className="row">

                <div className="mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header text-center">
                            <strong>Datos Generales</strong>
                        </div>
                        <div className="card-body">
                            <p><strong>Usuario:</strong> {user?.name} {user?.last_name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Rol:</strong> {user?.type}</p>
                            <p><strong>Fecha de creación:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                            <hr className="my-3" />
                            {
                                showFormPassword ? (
                                    <>
                                        <p><strong>Cambiar Contraseña</strong></p>
                                        {error && (
                                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                                <i className="bi bi-x-circle-fill me-2"></i>
                                                {error}
                                            </div>
                                        )}
                                        <form onSubmit={ChangePassword}>
                                            <div className="mb-3">
                                                <label className="form-label">Nueva Contraseña</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control"
                                                        name="newPassword"
                                                        placeholder="********"
                                                        value={password}
                                                        disabled={isProcessing}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Confirmar nueva contraseña</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                                        className="form-control"
                                                        placeholder="********"
                                                        name="confirmNewPassword"
                                                        disabled={isProcessing}
                                                        value={passwordConfirmation}
                                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                    />
                                                    <button className="input-group-text" onClick={togglePasswordVisibilityConfirmation}><i className={showPasswordConfirmation ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Código de confirmación</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="token"
                                                    value={token}
                                                    placeholder='######'
                                                    disabled={isProcessing}
                                                    onChange={(e) => setToken(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-success">
                                                {
                                                    isProcessing ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span className="ms-2">Procesando...</span>
                                                        </>
                                                    ) : (
                                                        "Cambiar contraseña"
                                                    )
                                                }
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <p>Puedes cambiar tu contraseña dando click aquí, se te enviará un código a tu correo eléctronico.</p>
                                        <button type="submit" className="btn btn-warning" onClick={() => {
                                            setEmail(user?.email)
                                            setShowModal(true);

                                        }}>
                                            {
                                                isProcessing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span className="ms-2">Procesando...</span>
                                                    </>
                                                ) : (
                                                    " Cambiar contraseña"
                                                )
                                            }
                                        </button>
                                    </>
                                )
                            }


                        </div>
                    </div>
                </div>
            </div>

            {
                showModal && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Cambio de contraseña</h5>
                                    <button type="button" className="btn-close" onClick={() => {
                                        setEmail("");
                                        setShowModal(false)
                                    }}></button>
                                </div>
                                <div className="modal-body">¿Estás seguro que deseas cambiar la contraseña?</div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        setEmail("");
                                        setShowModal(false)
                                    }
                                    }>
                                        <i className="bi bi-x"></i> Cancelar
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={handleSendCode}>
                                        <i className="bi bi-check2"></i> Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MyAccount;