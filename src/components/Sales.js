import React, { useEffect, useState } from "react";
import useSales from "../hooks/useSales";

const Sales = () => {

    const { sales, getSales } = useSales();

    useEffect(() => {
        getSales();
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i class="bi bi-receipt-cutoff"></i> Ventas</h1>
            </div>
            <div className="row g-4 mb-3">
                {
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
                                            <td>{sale.unit_price}</td>
                                            <td>{sale.total}</td>
                                            <td>{sale.status}</td>
                                            <td>{sale.created_at}</td>
                                            <td>
                                                <button type="button" className="btn btn-danger" style={{ marginRight: '10px' }}>
                                                    <i className="bi bi-trash"></i> Generar PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )
                }
            </div >
        </>
    )
}

export default Sales