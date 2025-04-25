import React, { useRef, useState } from "react";
import generatePDF from 'react-to-pdf';

const BillModal = ({ show, data, onClose }) => {

    const targetRef = useRef();
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }} ref={targetRef}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-receipt"></i> Factura #{data.id_sale}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">

                        <div className="container-fluid">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h4 className="text-primary">TextilExport || El Salvador</h4>
                                    <p className="mb-1">San Salvador</p>
                                    <p className="mb-1">San Salvador, El Salvador</p>
                                    <p className="mb-1">Tel: +503 2564-4898</p>
                                </div>
                                <div className="col-md-6 text-end">
                                    <h5 className="text-muted">FACTURA</h5>
                                    <p className="mb-1"><strong>No.:</strong> {data.id_sale}</p>
                                    <p className="mb-1"><strong>Fecha:</strong> {new Date(data.date).toLocaleDateString()}</p>
                                    <p className="mb-1"><strong>Cliente:</strong> {data.customer}</p>
                                </div>
                            </div>

                            <div className="table-responsive mb-4">
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th width="5%">Cant.</th>
                                            <th width="50%">Descripción</th>
                                            <th width="15%">P. Unitario</th>
                                            <th width="15%">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.amount}</td>
                                            <td>{data.product}</td>
                                            <td className="text-end">${data.unit_price}</td>
                                            <td className="text-end">${data.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="border p-3 text-center">
                                        <h6 className="text-muted">Estado</h6>
                                        <p style={{ color: 'green' }}><strong>{data.status}</strong></p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-muted small">Esta factura es un comprobante fiscal digital.
                                    <br />Gracias por su preferencia.</p>
                                <div className="d-flex justify-content-center mt-2">
                                    <button className="btn btn-success" onClick={() => {
                                        setIsProcessing(true)
                                        generatePDF(targetRef, { filename: 'Factura #' + data.id_sale })
                                    }
                                    }
                                    >
                                        <i className="bi bi-download"></i> Descargar PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillModal;