import { useEffect, useState } from "react";
import PaymentModal from "./PaymentModal";
import useBuy from "../hooks/useBuy";
import useShoppingCart from "../hooks/useShoppingCart";
import useSearchBar from "../hooks/useSearchBar";

const Products = ({ products, customer, isVerified, getProducts }) => {

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { search, data } = useSearchBar();
    const [dataSearched, setDatasearched] = useState("");
    const [advice, setAdvice] = useState(null);
    const { add_item } = useShoppingCart();
    const { buy } = useBuy();

    const handleBuyClick = (product) => {
        if (!customer || !isVerified) { //verificar si el usuario esta logeado y autenticado
            alert("¡Debe iniciar sesión y estar verificado para poder comprar nuestros productos!");
            return;
        }
        setSelectedProduct(product);
        setShowPaymentModal(true);
    }

    const searchData = async (data) => {
        setAdvice(null)
        try {
            const response = await search(data);
            if (!response?.length) {
                setAdvice("No se encontraron productos");
            }
        } catch (error) {
            console.log("Error al buscar: ", error);
            setAdvice(error.message || "Error al buscar un producto")
        }
    }

    const handleAdd_item = async (id_product) => {
        if (!customer || !isVerified) {
            alert("¡Debe iniciar sesión y estar verificado para poder comprar nuestros productos!");
            return;
        }
        try {

            const dataItem = {
                id_customer: customer.id,
                id_product: id_product
            }

            const response = await add_item(dataItem);
            if (response) {
                alert("Producto añadido al carrito");
            }
        } catch (error) {
            console.log("Error al agregar el item: ", error);
        }
    }

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
            <div className="container py-3" style={{ marginTop: "100px", marginBottom: "50px" }}>
                <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                    <h1 className="display-4 fw-bold text-primary">TextilExport</h1>
                    <p className="fs-5 text-muted">"Viste con estilo, ahorra con sentido. ¡Descuentos que te quedan bien!"</p>
                    <hr className="my-4 w-50 mx-auto" style={{ borderTop: "2px solid #0d6efd" }} />
                    <h4 className="fw-semibold text-body-emphasis mt-4">Nuestros productos disponibles</h4>
                </div>

                <main>
                    {/* Search bar */}
                    <div className="row mb-4 justify-content-center">
                        <div className="col-md-6">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text"
                                    className="form-control rounded-start-pill"
                                    placeholder="Buscar productos por categoría..."
                                    value={dataSearched}
                                    onChange={(e) => setDatasearched(e.target.value)}
                                />
                                <button className="btn btn-primary rounded-end-pill" type="button"
                                    onClick={() => searchData(dataSearched)}
                                >
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        {
                            data.length > 0 ? (
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                                    {data.map((data) => (
                                        <div className="col d-flex" key={data.id} style={{ maxWidth: "360px", minWidth: "300px" }}>
                                            <div className="card h-100 shadow-sm rounded-4 border-0 overflow-hidden w-100">
                                                <div className="bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                                                    <img
                                                        src={data.image_url}
                                                        alt={data.name}
                                                        className="img-fluid w-100 h-100"
                                                        style={{ objectFit: 'contain', padding: '15px' }}
                                                    />
                                                </div>
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title fw-semibold">{data.name}</h5>
                                                    <p className="card-text text-muted small">{data.description}</p>

                                                    <div className="mt-2 mb-3">
                                                        <span className="badge bg-light text-dark rounded-pill">
                                                            {data.categories.name}
                                                        </span>
                                                        <span className={`badge rounded-pill ms-2 ${data.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {data.stock > 0 ? `Disponible: ${data.stock}` : 'Agotado'} unidades
                                                        </span>
                                                    </div>

                                                    <h4 className="text-primary mb-3">${data.price}</h4>

                                                    <div className="d-grid gap-2 mt-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary rounded-pill fw-semibold py-2"
                                                            onClick={() => handleBuyClick(data)}
                                                            disabled={data.stock === 0}
                                                        >
                                                            <i className="bi bi-bag-check me-2"></i> Comprar ahora
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary rounded-pill fw-semibold py-2"
                                                            onClick={() => handleAdd_item(data.id)}
                                                            disabled={data.stock === 0}
                                                        >
                                                            <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                products.length === 0 ? (
                                    <div className="container-fluid py-5 text-center">
                                        <i className="bi bi-emoji-frown display-1 text-warning mb-4"></i>
                                        <h2 className="fw-bold text-muted">
                                            ¡Ups! parece que no hay productos disponibles
                                        </h2>
                                        <p className="lead text-muted">
                                            Puede que no existan productos en stock, lo sentimos.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {
                                            advice && (
                                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                                    <i className="bi bi-x-circle-fill me-2"></i>
                                                    {advice}
                                                </div>
                                            )
                                        }
                                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">

                                            {products.map((product) => (
                                                <div className="col d-flex" key={product.id} style={{ maxWidth: "360px", minWidth: "300px" }}>
                                                    <div className="card h-100 shadow-sm rounded-4 border-0 overflow-hidden w-100">
                                                        <div className="bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="img-fluid w-100 h-100"
                                                                style={{ objectFit: 'contain', padding: '15px' }}
                                                            />
                                                        </div>
                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title fw-semibold">{product.name}</h5>
                                                            <p className="card-text text-muted small">{product.description}</p>

                                                            <div className="mt-2 mb-3">
                                                                <span className="badge bg-light text-dark rounded-pill">
                                                                    {product.categories.name}
                                                                </span>
                                                                <span className={`badge rounded-pill ms-2 ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                                    {product.stock > 0 ? `Disponible: ${product.stock}` : 'Agotado'} unidades
                                                                </span>
                                                            </div>

                                                            <h4 className="text-primary mb-3">${product.price}</h4>

                                                            <div className="d-grid gap-2 mt-auto">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary rounded-pill fw-semibold py-2"
                                                                    onClick={() => handleBuyClick(product)}
                                                                    disabled={product.stock === 0}
                                                                >
                                                                    <i className="bi bi-bag-check me-2"></i> Comprar ahora
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary rounded-pill fw-semibold py-2"
                                                                    onClick={() => handleAdd_item(product.id)}
                                                                    disabled={product.stock === 0}
                                                                >
                                                                    <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )
                            )
                        }
                    </div>
                </main >
            </div >

            <PaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
                product={selectedProduct}
            />
        </>
    )
}

export default Products;