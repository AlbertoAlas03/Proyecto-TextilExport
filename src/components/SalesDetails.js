import { useEffect, useState } from "react";
import useSalesDetails from "../hooks/useSalesDetails";
import BillModal from "./BillModal";
import useSearchBar from "../hooks/useSearchBar";

const SalesDetails = ({ customer }) => {

    const { get_sales, sales } = useSalesDetails();
    const [ShowBill, setShowBill] = useState(false);
    const [data, setData] = useState([])
    const { searchSaleCustomer, searchSale } = useSearchBar();
    const [dataSearched, setdataSearched] = useState("");
    const [error, setError] = useState(null);

    const handleShowBill = (Data) => {
        setError(null)
        setShowBill(true)
        setData(Data)
    }

    useEffect(() => {
        get_sales(customer.id);
    }, [])

    const handleSearch = async (data) => {
        try {
            const response = await searchSaleCustomer(data);
            if (!response?.length) {
                setError("No tienes historial de compra con este producto");
            }
        } catch (error) {
            setError(error.message || "Hubo un error al buscar la compra");
        }
    }

    return (
        <>
            <div className="container py-4" style={{ marginBottom: "50px" }}>
                <h2 className="mb-4">Tus productos comprados</h2>
                <hr className="mb-4" style={{ borderTop: "2px solidrgb(0, 6, 16)" }} />
                <div className="col col-md-6 d-flex" style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar productos comprados por código..."
                        value={dataSearched}
                        onChange={(e) => setdataSearched(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => {
                        const data = {
                            id_customer: customer.id,
                            code: dataSearched
                        }
                        handleSearch(data)
                    }
                    }>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <div className="row">
                    {/* Validación de si hay productos */}
                    {
                        searchSale.length > 0 ? (
                            searchSale.map((sale) => (
                                <div className="col-md-4 mb-4" key={sale.id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                                            <img
                                                src={sale.product.image_url}
                                                alt={sale.product.name}
                                                className="img-fluid w-100 h-100"
                                                style={{ objectFit: 'contain', }}
                                            />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title text-primary d-flex align-items-center">
                                                <i className="bi bi-bag-check me-2"></i>
                                                {sale.product.name}
                                            </h5>
                                            <p className="card-text text-muted">{sale.product.description}</p>

                                            <div className="mb-2">
                                                <strong>Código del producto:</strong>{" "}
                                                <code className="bg-light px-2 py-1 rounded">{sale.product.code}</code>
                                            </div>

                                            <div className="mb-2">
                                                <strong>Cantidad:</strong>{" "}
                                                <code className="bg-light px-2 py-1 rounded">{sale.amount}</code>
                                            </div>

                                            <div className="mb-2">
                                                <strong>Precio unitario:</strong>{" "}
                                                <code className="bg-light px-2 py-1 rounded">${parseFloat(sale.unit_price).toFixed(2)}</code>
                                            </div>

                                            <div className="mb-2">
                                                <strong>Total:</strong>{" "}
                                                <code className="bg-light px-2 py-1 rounded">${parseFloat(sale.total).toFixed(2)}</code>
                                            </div>

                                            <p className="text-muted small">
                                                <i className="bi bi-calendar-check me-1"></i> Fecha de compra:{" "}
                                                {new Date(sale.created_at).toLocaleDateString()}
                                            </p>
                                            <span className={`badge bg-${sale.status === "completada" ? "success" : "secondary"}`}>
                                                {sale.status}
                                            </span>
                                            <div className="mb-2" style={{ marginTop: '10px' }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => {
                                                        const Data = {
                                                            id_sale: sale.id,
                                                            product: sale.product?.name,
                                                            amount: sale.amount,
                                                            unit_price: sale.unit_price,
                                                            total: sale.total,
                                                            status: sale.status,
                                                            date: sale.created_at
                                                        }
                                                        handleShowBill(Data)
                                                    }
                                                    }
                                                >
                                                    <i className="bi bi-eye"></i> Ver factura
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            sales.length === 0 ? (
                                <div className="text-center py-5 my-4 bg-light rounded-3">
                                    <div className="container-fluid py-5">
                                        <i className="bi bi-box display-1 text-warning mb-4"></i>
                                        <h2 className="fw-bold text-muted">No has comprado productos aún</h2>
                                        <p className="lead text-muted">Cuando compres productos, aparecerán aquí.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="bi bi-x-circle-fill me-2"></i>
                                            {error}
                                        </div>
                                    )}
                                    {
                                        sales.map((sale) => (
                                            <div className="col-md-4 mb-4" key={sale.id}>
                                                <div className="card shadow-sm h-100">
                                                    <div className="bg-light" style={{ height: '250px', overflow: 'hidden' }}>
                                                        <img
                                                            src={sale.product.image_url}
                                                            alt={sale.product.name}
                                                            className="img-fluid w-100 h-100"
                                                            style={{ objectFit: 'contain', }}
                                                        />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title text-primary d-flex align-items-center">
                                                            <i className="bi bi-bag-check me-2"></i>
                                                            {sale.product.name}
                                                        </h5>
                                                        <p className="card-text text-muted">{sale.product.description}</p>

                                                        <div className="mb-2">
                                                            <strong>Código del producto:</strong>{" "}
                                                            <code className="bg-light px-2 py-1 rounded">{sale.product.code}</code>
                                                        </div>

                                                        <div className="mb-2">
                                                            <strong>Cantidad:</strong>{" "}
                                                            <code className="bg-light px-2 py-1 rounded">{sale.amount}</code>
                                                        </div>

                                                        <div className="mb-2">
                                                            <strong>Precio unitario:</strong>{" "}
                                                            <code className="bg-light px-2 py-1 rounded">${parseFloat(sale.unit_price).toFixed(2)}</code>
                                                        </div>

                                                        <div className="mb-2">
                                                            <strong>Total:</strong>{" "}
                                                            <code className="bg-light px-2 py-1 rounded">${parseFloat(sale.total).toFixed(2)}</code>
                                                        </div>

                                                        <p className="text-muted small">
                                                            <i className="bi bi-calendar-check me-1"></i> Fecha de compra:{" "}
                                                            {new Date(sale.created_at).toLocaleDateString()}
                                                        </p>
                                                        <span className={`badge bg-${sale.status === "completada" ? "success" : "secondary"}`}>
                                                            {sale.status}
                                                        </span>
                                                        <div className="mb-2" style={{ marginTop: '10px' }}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-warning"
                                                                onClick={() => {
                                                                    const Data = {
                                                                        id_sale: sale.id,
                                                                        product: sale.product?.name,
                                                                        amount: sale.amount,
                                                                        unit_price: sale.unit_price,
                                                                        total: sale.total,
                                                                        status: sale.status,
                                                                        date: sale.created_at
                                                                    }
                                                                    handleShowBill(Data)
                                                                }
                                                                }
                                                            >
                                                                <i className="bi bi-eye"></i> Ver factura
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>

                            )
                        )
                    }
                </div>
            </div>
            <BillModal
                show={ShowBill}
                onClose={() => {
                    setData([])
                    setShowBill(false)
                }}
                data={data}
                customer={customer}
            />
        </>
    )
}

export default SalesDetails;