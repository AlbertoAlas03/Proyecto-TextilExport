import React, { useEffect, useState } from "react";
import useCategory from "../hooks/useCategory";

const AddProductModal = ({ show, onClose, addProduct, getProduct }) => {

    const [Id, setId] = useState("");
    const [Code, setCode] = useState("");
    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState("");
    const [Stock, setStock] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [categorySeleted, setcategorySelected] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { category, getCategory } = useCategory()

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError(null)
        setIsProcessing(true)
        if (!Id || !Code || !Name || !Description || !Price || !Stock || !selectedImage) {
            setError("Por favor, ingrese la información solicitada");
            setIsProcessing(false)
            return;

        }
        try {
            const ProductData = {
                id_category: Id,
                code: Code,
                name: Name,
                description: Description,
                imagen: selectedImage,
                price: Price,
                stock: Stock
            }

            const response = await addProduct(ProductData);

            if (response) {
                alert("Producto agregado correctamente")
                onClose();
                getProduct();
                ClearForm();
            }
        } catch (error) {
            setError(error.message || "Hubo un error al agregar el producto")
        } finally {
            setIsProcessing(false);
        }

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const ClearForm = () => {
        setId("");
        setCode("");
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setcategorySelected("");
        setSelectedImage(null);
        setImagePreview(null);
    }

    useEffect(() => {
        getCategory();
    }, [])

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="bi bi-box-seam"></i> Nuevo producto</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleAddProduct}>
                            <div className="row">
                                {/* Columna izquierda */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label"><i className="bi bi-archive"></i> Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Nombre del producto"
                                            value={Name}
                                            disabled={isProcessing}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="code" className="form-label"><i className="bi bi-hash"></i> Código</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="code"
                                            placeholder="PROD00000"
                                            value={Code}
                                            disabled={isProcessing}
                                            maxLength="9"
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label"><i className="bi bi-coin"></i> Precio</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="price"
                                            placeholder="0.00"
                                            value={Price}
                                            disabled={isProcessing}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="stock" className="form-label"><i className="bi bi-boxes"></i> Stock</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="stock"
                                            placeholder="0"
                                            value={Stock}
                                            disabled={isProcessing}
                                            onChange={(e) => setStock(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Columna derecha */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label"><i className="bi bi-card-text"></i> Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            placeholder="Descripción del producto"
                                            value={Description}
                                            disabled={isProcessing}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="3"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label"><i className="bi bi-tag"></i> Categoría</label>
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-outline-secondary form-control text-start dropdown-toggle"
                                                type="button"
                                                id="category-dropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {categorySeleted || "Seleccione la categoría"}
                                            </button>
                                            <ul className="dropdown-menu w-100" aria-labelledby="category-dropdown">
                                                {category.length === 0 ? (
                                                    <li><span className="dropdown-item-text">No hay categorías</span></li>
                                                ) : (
                                                    category.map((category) => (
                                                        <li key={category.id}>
                                                            <button
                                                                className="dropdown-item"
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setId(category.id);
                                                                    setcategorySelected(category.name);
                                                                }}
                                                            >
                                                                {category.name}
                                                            </button>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="imagen" className="form-label">
                                            <i className="bi bi-image"></i> Imagen
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imagen"
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={handleImageChange}
                                            disabled={isProcessing}
                                        />
                                        {imagePreview && (
                                            <div className="mt-2 text-center">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                                                />
                                            </div>
                                        )}
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
                                        "Agregar producto"
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

export default AddProductModal