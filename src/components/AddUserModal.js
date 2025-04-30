import React, { useEffect, useState } from "react";

const AddUserModal = ({ show, onClose, addUser, getUser, setUserByLast_name, setdataSearched }) => {

    const [Name, setName] = useState("");
    const [Last_name, setLast_name] = useState("")
    const [Password, setPassword] = useState("");
    const [Password_confirmation, setPassword_confirmation] = useState("");
    const [Email, setEmail] = useState("");
    const [Type, setType] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const ClearForm = () => {
        setName("");
        setEmail("");
        setLast_name("");
        setPassword("");
        setPassword_confirmation("");
        setType("");
        setShowPassword(false);
        setShowPasswordConfirmation(false);
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(null)
        setIsProcessing(true)
        if (!Name || !Last_name || !Password || !Email || !Type) {
            setError("Por favor, ingrese la información solicitada");
            setIsProcessing(false)
            return;

        }
        try {
            const UserData = {
                name: Name,
                last_name: Last_name,
                password: Password,
                password_confirmation: Password_confirmation,
                email: Email,
                type: Type
            }

            const response = await addUser(UserData);

            if (response) {
                alert("Usuario agregado correctamente")
                onClose();
                getUser();
                ClearForm();
                setUserByLast_name([])
                setdataSearched('')
            }
        } catch (error) {
            setError(error.message || "Hubo un error al agregar el usuario")
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

    useEffect(() => {
        getUser();
    }, [])

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-person-plus"></i> Nuevo usuario</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleAddUser}>
                            <div className="row">

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-person-vcard"></i> Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control name"
                                        placeholder="Nombre del usuario"
                                        value={Name}
                                        disabled={isProcessing}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-person-badge"></i> Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control last_name"
                                        placeholder="Apellido del usuario"
                                        value={Last_name}
                                        disabled={isProcessing}
                                        onChange={(e) => setLast_name(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-envelope-at"></i> Correo eléctronico</label>
                                    <input
                                        type="text"
                                        className="form-control email"
                                        placeholder="example@gmail.com"
                                        value={Email}
                                        disabled={isProcessing}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-person-lock"></i> Rol</label>
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-outline-secondary form-control text-start dropdown-toggle category-dropdown"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {Type || "Seleccione el rol"}
                                        </button>
                                        <ul className="dropdown-menu w-100" aria-labelledby="category-dropdown">
                                            <li key={1}>
                                                <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setType("Administrador");
                                                    }}
                                                >
                                                    Administrador
                                                </button>
                                            </li>
                                            <li key={2}>
                                                <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setType("Empleado");
                                                    }}
                                                >
                                                    Empleado
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-lock"></i> Contraseña</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control password"
                                            placeholder="********"
                                            value={Password}
                                            disabled={isProcessing}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button className="input-group-text" onClick={togglePasswordVisibility}><i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-shield-lock"></i> Confirmar contraseña</label>
                                    <div className="input-group">
                                        <input
                                            type={showPasswordConfirmation ? 'text' : 'password'}
                                            className="form-control password_confirmation"
                                            placeholder="********"
                                            value={Password_confirmation}
                                            disabled={isProcessing}
                                            onChange={(e) => setPassword_confirmation(e.target.value)}
                                        />
                                        <button className="input-group-text" onClick={togglePasswordVisibilityConfirmation}><i className={showPasswordConfirmation ? 'bi bi-eye-slash' : 'bi bi-eye'}></i></button>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Procesando...</span>
                                        </>
                                    ) : (
                                        "Agregar usuario"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUserModal