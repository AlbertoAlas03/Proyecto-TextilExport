import React, { useState, useEffect } from "react";
import useCategory from "../hooks/useCategory";
import AddCategoryModal from "./AddCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import useSearch from "../hooks/useSearch";

const Category = () => {

    const { category, getCategory, deleteCategory, setCategory, addCategory, updateCategory } = useCategory();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState([])
    const { getCategoryByName, categoryByname } = useSearch();
    const [dataSearched, setdataSearched] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategory();
    }, [])

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            return;
        }
        try {
            const response = await deleteCategory(id)
            if (response) {
                alert("Categoría eliminada con exito")
                setCategory(category.filter(category => category.id !== id));   //actualizamos el contenido de la tabla
            }
        } catch (error) {
            alert(error.message || "Error al eliminar la categoría");
        }
    }

    const showModalAdd = async () => {
        setShowAddModal(true)
    }

    const showModalUpdate = async (updateData) => {
        setShowUpdateModal(true)
        setUpdateData(updateData)
    }

    const handleSearch = async (data) => {
        setError(null)
        try {
            const response = await getCategoryByName(data);
        } catch (error) {
            setError(error.message || "Error al filtar la categoria");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-tags"></i> Categorías</h1>
            </div>
            <div className="row g-4 mb-3">
                <div className="col col-lg-2">
                    <button type="button" className="btn btn-success" onClick={() => showModalAdd()}> <i className="bi bi-plus"></i> Agregar categoría</button>
                </div>

                <div className="col col-md-6 d-flex">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Buscar categoría por nombre..."
                        value={dataSearched}
                        onChange={(e) => setdataSearched(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => handleSearch(dataSearched)}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>

                {
                    categoryByname.length > 0 ? (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Fecha registro</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryByname.map((categorybyname) => (
                                    <tr key={categorybyname.id}>
                                        <th scope="row">{categorybyname.id}</th>
                                        <td>{categorybyname.name}</td>
                                        <td>{categorybyname.description}</td>
                                        <td>{new Date(categorybyname.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button type="button" className="btn btn-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteCategory(categorybyname.id)}>
                                                <i className="bi bi-trash"></i> Eliminar
                                            </button>
                                            <button type="button" className="btn btn-warning" onClick={() => {
                                                const UpdateData = {
                                                    category_id: categorybyname.id,
                                                    name: categorybyname.name,
                                                    description: categorybyname.description
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
                    ) : (
                        category.length === 0 ? (
                            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                                <div className="text-center">
                                    <i className="bi bi-tags display-1 text-warning mb-4"></i>
                                    <h2 className="fw-bold text-muted">
                                        No hay categorias registradas
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
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Descripción</th>
                                            <th scope="col">Fecha registro</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.map((category) => (
                                            <tr key={category.id}>
                                                <th scope="row">{category.id}</th>
                                                <td>{category.name}</td>
                                                <td>{category.description}</td>
                                                <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button type="button" className="btn btn-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteCategory(category.id)}>
                                                        <i className="bi bi-trash"></i> Eliminar
                                                    </button>
                                                    <button type="button" className="btn btn-warning" onClick={() => {
                                                        const UpdateData = {
                                                            category_id: category.id,
                                                            name: category.name,
                                                            description: category.description
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
                    )
                }
            </div >
            <AddCategoryModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                addCategory={addCategory}
                getCategory={getCategory}
            />
            <UpdateCategoryModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateCategory={updateCategory}
                getCategory={getCategory}
                updateData={updateData}
            />
        </>
    )
}


export default Category