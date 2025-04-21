import React, { useEffect, useState } from "react";

const UpdateCustomerModal = ({ show, onClose, updateCustomer, getCustomers, updateData }) => {

    const [Last_name, setLast_name] = useState("");
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [Password_confirmation, setPassword_confirmation] = useState("");
    const [Address, setAddress] = useState("");
    const [Phone_number, setPhone_number] = useState("");
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        setError(null)
        setIsProcessing(true)
        if (!Name || !Last_name || !Email || !Password || !Password_confirmation || !Address || !Phone_number) {
            setError("Por favor, ingrese la información solicitada");
            setIsProcessing(false)
            return;

        }
        try {
            const CustomerData = {
                id_customer: updateData.id_customer,
                name: Name,
                last_name: Last_name,
                email: Email,
                password: Password,
                password_confirmation: Password_confirmation,
                address: Address,
                phone_number: Phone_number
            }

            const response = await updateCustomer(CustomerData);

            if (response) {
                alert("Cliente actualizado correctamente")
                onClose();
                getCustomers();
            }
        } catch (error) {
            setError(error.message || "Hubo un error al actualizar el cliente")
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
        getCustomers();
    }, [])

    useEffect(() => {
        if (updateData) {
            setName(updateData.name || '');
            setLast_name(updateData.last_name || '');
            setEmail(updateData.email || '');
            setPassword(updateData.password || '');
            setAddress(updateData.address || '');
            setPhone_number(updateData.phone_number || '');
        }
    }, [updateData]);

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-pencil-square"></i> Actualizar cliente</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleUpdateCustomer}>
                            <div className="row">

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-person-vcard"></i> Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control name"
                                        placeholder="Nombre del cliente"
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
                                        placeholder="Apellido del cliente"
                                        value={Last_name}
                                        disabled={isProcessing}
                                        onChange={(e) => setLast_name(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-house"></i> Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control address"
                                        placeholder="Dirección del cliente"
                                        value={Address}
                                        disabled={isProcessing}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-envelope-at"></i> Correo eléctronico</label>
                                    <input
                                        type="email"
                                        className="form-control stock"
                                        placeholder="example@gmail.com"
                                        value={Email}
                                        disabled={isProcessing}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><i className="bi bi-telephone"></i> Número de teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control description"
                                        placeholder="Número de télefono"
                                        value={Phone_number}
                                        disabled={isProcessing}
                                        onChange={(e) => setPhone_number(e.target.value)}
                                    />
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
                                        "Actualizar cliente"
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

export default UpdateCustomerModal