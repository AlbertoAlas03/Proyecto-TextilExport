import React, { useEffect } from "react";
import useCount from "../hooks/useCount";

const Main = () => {

    const { count, getCount } = useCount();

    useEffect(() => {
        getCount();
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-speedometer2"></i> Dashboard</h1>
            </div>
            <div className="row g-4 mb-3">
                <div className="col-md-6">
                    <div className="card text-white bg-primary shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Inventario</h5>
                                <i className="bi bi-box-seam display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count[0]?.Cantidad_de_productos ?? 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card text-white bg-success shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Ventas</h5>
                                <i className="bi bi-cart-check display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count[0]?.Cantidad_de_ventas ?? 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card text-white bg-warning shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Usuarios</h5>
                                <i className="bi bi-person display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count[0]?.Cantidad_de_usuarios ?? 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card text-white bg-info shadow-lg p-3" style={{ minHeight: '180px' }}>
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fs-4 mb-0">Clientes</h5>
                                <i className="bi bi-people display-3"></i>
                            </div>
                            <h2 className="fw-bold">{count[0]?.Cantidad_de_clientes ?? 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Main