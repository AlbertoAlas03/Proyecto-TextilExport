import React, { useEffect, useState } from "react";
import useProduct from "../hooks/useProduct";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";
import useSearch from "../hooks/useSearch";

const Inventory = () => {

    const { product, getProduct, deleteProduct, setProduct, addProduct, updateProduct } = useProduct();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState([])
    const [dataSearched, setdataSearched] = useState("");
    const [error, setError] = useState(null);
    const { getProductByCode, productBycode, setproductBycode } = useSearch();

    useEffect(() => {
        getProduct();
    }, [])

    const handleDeleteProduct = async (id) => {
        setError(null);
        if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }
        try {
            const response = await deleteProduct(id)
            if (response) {
                alert("Producto eliminado con exito")
                setProduct(product.filter(product => product.id !== id));//actualizamos el contenido de la tabla
                setproductBycode([]);
                setdataSearched('');
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.message || "Error al eliminar el producto");
        }
    }

    const showModalAdd = async () => {
        setError(null);
        setShowAddModal(true)
    }

    const showModalUpdate = async (updateData) => {
        setError(null);
        setShowUpdateModal(true)
        setUpdateData(updateData)
    }

    const handleSearch = async (data) => {
        setError(null)
        try {
            const response = await getProductByCode(data);
        } catch (error) {
            setError(error.message || "Error al filtar el producto");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-box-seam"></i> Inventario</h1>
            </div>
            <div className="row g-4 mb-3">
                <div className="col col-lg-2">
                    <button type="button" className="btn btn-success" onClick={() => showModalAdd()}> <i className="bi bi-plus"></i> Agregar producto</button>
                </div>

                <div className="col col-md-6 d-flex">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar producto por código..."
                        value={dataSearched}
                        onChange={(e) => setdataSearched(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => handleSearch(dataSearched)}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                {
                    productBycode.length > 0 ? (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Foto</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col">Fecha registro</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productBycode.map((productbyId) => (
                                    <tr key={productbyId.id}>
                                        <th scope="row">{productbyId.id}</th>
                                        <td>{productbyId.categories?.name}</td>
                                        <td>{productbyId.code}</td>
                                        <td>{productbyId.name}</td>
                                        <td>{productbyId.description}</td>
                                        <td>
                                            <img
                                                src={productbyId.image_url}
                                                alt={productbyId.categories?.name}
                                                className="img-fluid"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{productbyId.price}</td>
                                        <td>{productbyId.stock}</td>
                                        <td>{new Date(productbyId.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteProduct(productbyId.id)}
                                                >
                                                    <i className="bi bi-trash"></i> Eliminar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => {
                                                        const UpdateData = {
                                                            id_product: productbyId.id,
                                                            category_id: productbyId.categories.id,
                                                            category_name: productbyId.categories.name,
                                                            code: productbyId.code,
                                                            name: productbyId.name,
                                                            description: productbyId.description,
                                                            imagen: productbyId.image_url,
                                                            price: productbyId.price,
                                                            stock: productbyId.stock
                                                        }
                                                        showModalUpdate(UpdateData)
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square"></i> Editar
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        product.length === 0 ? (
                            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                                <div className="text-center">
                                    <i className="bi bi-box-seam display-1 text-warning mb-4"></i>
                                    <h2 className="fw-bold text-muted">
                                        No hay productos en inventario
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
                                            <th scope="col">Categoría</th>
                                            <th scope="col">Codigo</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Descripción</th>
                                            <th scope="col">Foto</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Stock</th>
                                            <th scope="col">Fecha registro</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.map((product) => (
                                            <tr key={product.id}>
                                                <th scope="row">{product.id}</th>
                                                <td>{product.categories?.name}</td>
                                                <td>{product.code}</td>
                                                <td>{product.name}</td>
                                                <td>{product.description}</td>
                                                <td>
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.categories?.name}
                                                        className="img-fluid"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td>{product.price}</td>
                                                <td>{product.stock}</td>
                                                <td>{new Date(product.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Eliminar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-warning"
                                                            onClick={() => {
                                                                const UpdateData = {
                                                                    id_product: product.id,
                                                                    category_id: product.categories.id,
                                                                    category_name: product.categories.name,
                                                                    code: product.code,
                                                                    name: product.name,
                                                                    description: product.description,
                                                                    imagen: product.image_url,
                                                                    price: product.price,
                                                                    stock: product.stock
                                                                }
                                                                showModalUpdate(UpdateData)
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil-square"></i> Editar
                                                        </button>
                                                    </div>

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
            <AddProductModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                addProduct={addProduct}
                getProduct={getProduct}
                setproductBycode={setproductBycode}
                setdataSearched={setdataSearched}
            />
            <UpdateProductModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateProduct={updateProduct}
                getProduct={getProduct}
                updateData={updateData}
                setproductBycode={setproductBycode}
                setdataSearched={setdataSearched}
            />
        </>
    )
}

export default Inventory