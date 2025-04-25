import { useEffect, useState } from "react";
import useBuy from "../hooks/useBuy";
import PaymentModal from "./PaymentModal";

const ShoppingCart = ({ customer, get_items, items, delete_item, getProducts }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saleSelected, setsaleSelected] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { buy } = useBuy();

    const handleDeleteItem = async (saleSelected) => {
        try {
            const response = await delete_item(saleSelected);
            if (response) {
                alert("Producto eliminado con exito");
                get_items(customer.id);
                setShowModal(false);
            }
        } catch (error) {
            console.log("Error al eliminar el producto del carrito: ", error);
        }
    }

    const handleBuyClick = async (product) => {
        setSelectedProduct(product);
        setShowPaymentModal(true);
    }

    useEffect(() => {
        get_items(customer.id);
    }, [])

    const handlePaymentSubmit = async (paymentData) => { //procesar compra
        setIsProcessing(true);
        try {

            const purchaseData = {
                id_customer: customer.id,
                id_product: selectedProduct.id,
                amount: paymentData.amount,
                paymentMethod: "credit_card",
                cardDetails: {
                    number: paymentData.cardNumber.replace(/\s/g, ""),
                    expMonth: paymentData.expiryDate.split("/")[0],
                    expYear: paymentData.expiryDate.split("/")[1],
                    cvc: paymentData.cvc
                }
            };

            const response = await buy(purchaseData);

            if (response.success && response.message) {
                alert("¡Compra exitosa!");
                setShowPaymentModal(false);
                get_items(customer.id);
                getProducts();
            } else {
                throw new Error("La compra no pudo ser procesada correctamente");
            }
        } catch (error) {
            alert(`Error en la compra: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <>
            <div className="container py-4" style={{ marginBottom: "50px" }}>
                <h2 className="mb-4">Tu carrito de compras</h2>
                <hr className="mb-4" style={{ borderTop: "2px solidrgb(0, 6, 16)" }} />
                <div className="row">
                    {items.length === 0 ? (
                        <div className="text-center py-5 my-4 bg-light rounded-3">
                            <div className="container-fluid py-5">
                                <i className="bi bi-cart2 display-1 text-warning mb-4"></i>
                                <h2 className="fw-bold text-muted">No has añadido ningún producto</h2>
                                <p className="lead text-muted">Cuando añadas productos, aparecerán aquí.</p>
                            </div>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div className="col d-flex" key={item.id} style={{ maxWidth: "360px", minWidth: "300px" }}>
                                <div className="card h-100 shadow-sm rounded-4 border-0 overflow-hidden w-100">
                                    <div className="bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            className="img-fluid w-100 h-100"
                                            style={{ objectFit: 'contain', padding: '15px' }}
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-semibold">{item.product.name}</h5>
                                        <p className="card-text text-muted small">{item.product.description}</p>

                                        <div className="mt-2 mb-3">
                                            <span className={`badge rounded-pill ms-2 ${item.product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                {item.product.stock > 0 ? `Disponible: ${item.product.stock}` : 'Agotado'} unidades
                                            </span>
                                        </div>

                                        <h4 className="text-primary mb-3">${item.product.price}</h4>

                                        <div className="d-grid gap-2 mt-auto">
                                            <button
                                                type="button"
                                                className="btn btn-primary rounded-pill fw-semibold py-2"
                                                onClick={() => handleBuyClick(item.product)
                                                }
                                                disabled={item.product.stock === 0}
                                            >
                                                <i className="bi bi-bag-check me-2"></i> Comprar ahora
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger rounded-pill fw-semibold py-2"
                                                onClick={() => {
                                                    setsaleSelected(item.id)
                                                    setShowModal(true)
                                                }
                                                }
                                            >
                                                <i className="bi bi-cart-x"></i> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <PaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
                product={selectedProduct}
            />

            {showModal && (
                <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar producto del carrito</h5>
                                <button type="button" className="btn-close" onClick={() => {
                                    setShowModal(false)
                                    setsaleSelected(null);
                                }}></button>
                            </div>
                            <div className="modal-body">¿Estás seguro que quieres eliminar este producto?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => {
                                    setShowModal(false)
                                    setsaleSelected(null);
                                }}>
                                    <i className="bi bi-x"></i> Cancelar
                                </button>
                                <button type="button" className="btn btn-success" onClick={() => handleDeleteItem(saleSelected)}>
                                    <i className="bi bi-check2"></i> Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ShoppingCart;