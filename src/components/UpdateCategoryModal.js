import React, { useEffect, useState } from "react";

const UpdateCategoryModal = ({ show, onClose, updateCategory, getCategory, updateData }) => {

    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setError(null)
        setIsProcessing(true)
        if (!Name || !Description) {
            setError("Por favor, ingrese la información solicitada");
            setIsProcessing(false)
            return;

        }
        try {
            const CategoryData = {
                id_category: updateData.category_id,
                name: Name,
                description: Description
            }

            const response = await updateCategory(CategoryData);

            if (response) {
                alert("Categoría actualizado correctamente")
                onClose();
                getCategory();
            }
        } catch (error) {
            setError(error.message || "Hubo un error al actualizar la categoría")
        } finally {
            setIsProcessing(false);
        }

    }

    useEffect(() => {
        getCategory();
    }, [])

    useEffect(() => {
        if (updateData) {
            setName(updateData.name || '');
            setDescription(updateData.description || '');
        }
    }, [updateData]);

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-pencil-square"></i> Actualizar categoría</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleUpdateCategory}>
                            <div className="row">

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label"><i className="bi bi-tag"></i> Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Nombre de la categoría"
                                        value={Name}
                                        disabled={isProcessing}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label"><i className="bi bi-card-text"></i> Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        placeholder="Descripción de la categoría"
                                        value={Description}
                                        disabled={isProcessing}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                    />
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
                                        "Actualizar categoría"
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

export default UpdateCategoryModal