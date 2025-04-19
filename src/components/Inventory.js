import React, { useEffect, useState } from "react";
import useProduct from "../hooks/useProduct";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";

const Inventory = () => {

    const { product, getProduct, deleteProduct, setProduct, addProduct, updateProduct } = useProduct();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState([])

    useEffect(() => {
        getProduct();
    }, [])

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }
        try {
            const response = await deleteProduct(id)
            if (response) {
                alert("Producto eliminado con exito")
                setProduct(product.filter(product => product.id !== id));   //actualizamos el contenido de la tabla
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.message || "Error al eliminar el producto");
        }
    }

    const showModalAdd = async () => {
        setShowAddModal(true)
    }

    const showModalUpdate = async (updateData) => {
        setShowUpdateModal(true)
        setUpdateData(updateData)
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
                {
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
                                            <td>{product.imagen}</td>
                                            <td>{product.price}</td>
                                            <td>{product.stock}</td>
                                            <td>{product.created_at}</td>
                                            <td>
                                                <button type="button" className="btn btn-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteProduct(product.id)}>
                                                    <i className="bi bi-trash"></i> Eliminar
                                                </button>
                                                <button type="button" className="btn btn-warning" onClick={() => {
                                                    const UpdateData = {
                                                        product_id: product.id,
                                                        category_id: product.categories.id,
                                                        category_name: product.categories.name,
                                                        code: product.code,
                                                        name: product.name,
                                                        description: product.description,
                                                        imagen: product.imagen,
                                                        price: product.price,
                                                        stock: product.stock

                                                    }
                                                    showModalUpdate(UpdateData)
                                                }
                                                }>
                                                    <i className="bi bi-pencil-square"></i> Editar
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
            <AddProductModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                addProduct={addProduct}
                getProduct={getProduct}
            />
            <UpdateProductModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateProduct={updateProduct}
                getProduct={getProduct}
                updateData={updateData}
            />
        </>
    )
}

export default Inventory