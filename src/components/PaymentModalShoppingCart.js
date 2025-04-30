import React, { useState } from "react";
import useBuy from "../hooks/useBuy";

const PaymentModalShoppingCart = ({ show, onClose, product, setSelectedProduct, customer, getProducts, get_items }) => {

    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");
    const [cardName, setCardName] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { buy } = useBuy();

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (e) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        setExpiryDate(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);
        if (!cardNumber || !expiryDate || !cvc || !cardName) {
            setError("Por favor, ingrese la información solicitada");
            setIsProcessing(false)
            return;
        }

        const purchaseData = {
            id_customer: customer.id,
            id_product: product.id,
            amount: amount,
            paymentMethod: "credit_card",
            cardDetails: {
                number: cardNumber.replace(/\s/g, ""),
                expMonth: expiryDate.split("/")[0],
                expYear: expiryDate.split("/")[1],
                cvc: cvc
            }
        };

        try {
            const response = await buy(purchaseData);
            if (response) {
                alert("¡Compra exitosa!");
                onClose()
                getProducts()
                setIsProcessing(false)
                clearForm()
                get_items()
            }
        } catch (error) {
            console.log("Error al comprar: ", error.message)
            setError(error.message)
            setIsProcessing(false)
        }

    };

    const clearForm = () => {
        setCardName('')
        setAmount('')
        setExpiryDate('')
        setCvc('')
        setCardNumber('')
    }

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-bag"></i> Compra de producto</h5>
                        <button type="button" className="btn-close" onClick={() => {
                            setSelectedProduct()
                            setError(null)
                            onClose()
                            clearForm()
                        }}></button>
                    </div>
                    <div className="modal-body">
                        {product && (
                            <div className="mb-4">
                                <h5>Nombre: {product.name}</h5>
                                <h5>Description: {product.description}</h5>
                                <p className="mb-1"><strong>Precio:</strong> ${product.price}</p>
                            </div>
                        )}
                        {
                            error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-x-circle-fill me-2"></i>
                                    {error}
                                </div>
                            )
                        }
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="cardName" className="form-label"><i className="bi bi-basket"></i> Cantidad a comprar</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cardName"
                                    placeholder="0"
                                    value={amount}
                                    disabled={isProcessing}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="cardName" className="form-label"><i className="bi bi-person"></i> Nombre en la tarjeta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="cardName"
                                    placeholder="Ej. Juan Pérez"
                                    value={cardName}
                                    disabled={isProcessing}
                                    onChange={(e) => setCardName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="cardNumber" className="form-label"><i className="bi bi-credit-card"></i> Número de tarjeta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    disabled={isProcessing}
                                    maxLength="19"
                                />
                            </div>

                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="expiryDate" className="form-label"><i className="bi bi-credit-card-2-front"></i> Fecha de expiración (MM/AA)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="expiryDate"
                                        placeholder="MM/AA"
                                        value={expiryDate}
                                        onChange={handleExpiryDateChange}
                                        disabled={isProcessing}
                                        maxLength="5"
                                    />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label htmlFor="cvc" className="form-label"><i className="bi bi-credit-card-2-back"></i> Código de seguridad (CVC)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cvc"
                                        placeholder="123"
                                        value={cvc}
                                        disabled={isProcessing}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                                        maxLength="4"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Procesando pago...</span>
                                    </>
                                ) : (
                                    "Confirmar Pago"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PaymentModalShoppingCart