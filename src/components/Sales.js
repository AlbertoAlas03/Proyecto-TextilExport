import React, { useEffect, useState } from "react";
import useSales from "../hooks/useSales";
import BillModal from "./BillModal";
import useSearch from "../hooks/useSearch";

const Sales = () => {

    const { sales, getSales } = useSales();
    const [ShowBill, setShowBill] = useState(false);
    const [data, setData] = useState([])
    const { getSaleByProduct, sale } = useSearch();
    const [dataSearched, setdataSearched] = useState("");
    const [error, setError] = useState(null);

    const handleShowBill = (Data) => {
        setShowBill(true)
        setData(Data)
    }

    useEffect(() => {
        getSales();
    }, [])


    const handleSearch = async (data) => {
        setError(null)
        try {
            const response = await getSaleByProduct(data);
            if (!response?.length) {
                setError("Este producto no tiene ventas");
            }
        } catch (error) {
            setError(error.message || "Error al filtar la venta");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-receipt-cutoff"></i> Ventas</h1>
            </div>
            <div className="col col-md-6 d-flex" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar venta por nombre del producto..."
                    value={dataSearched}
                    onChange={(e) => setdataSearched(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={() => handleSearch(dataSearched)}>
                    <i className="bi bi-search"></i>
                </button>
            </div>
            <div className="row g-4 mb-3">
                {
                    sale.length > 0 ? (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Monto</th>
                                    <th scope="col">Precio unitario</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Fecha registro</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.map((sale) => (
                                    <tr key={sale.id}>
                                        <th scope="row">{sale.id}</th>
                                        <td>{sale.customer?.name}</td>
                                        <td>{sale.product?.name}</td>
                                        <td>{sale.amount}</td>
                                        <td>${sale.unit_price}</td>
                                        <td>${sale.total}</td>
                                        <td>{sale.status}</td>
                                        <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                style={{ marginRight: '10px' }}
                                                onClick={() => {
                                                    const Data = {
                                                        id_sale: sale.id,
                                                        customer: sale.customer?.name,
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        sales.length === 0 ? (
                            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                                <div className="text-center">
                                    <i className="bi bi-receipt display-1 text-warning mb-4"></i>
                                    <h2 className="fw-bold text-muted">
                                        No hay ventas
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <>
                                {
                                    error && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="bi bi-x-circle-fill me-2"></i>
                                            {error}
                                        </div>
                                    )
                                }
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Monto</th>
                                            <th scope="col">Precio unitario</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col">Fecha registro</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <th scope="row">{sale.id}</th>
                                                <td>{sale.customer?.name}</td>
                                                <td>{sale.product?.name}</td>
                                                <td>{sale.amount}</td>
                                                <td>${sale.unit_price}</td>
                                                <td>${sale.total}</td>
                                                <td>{sale.status}</td>
                                                <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        style={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            const Data = {
                                                                id_sale: sale.id,
                                                                customer: sale.customer?.name,
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )
                    )
                }
            </div >
            <BillModal
                show={ShowBill}
                onClose={() => setShowBill(false)}
                data={data}
            />
        </>
    )
}

export default Sales