import React, { useState, useEffect } from "react";
import useUsers from "../hooks/UseUsers";
import AddUserModal from "./AddUserModal";
import UpdateUserModal from "./UpdateUserModal";

const Users = () => {

    const { user, getUser, deleteUser, setUser, addUser, updateUser } = useUsers();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState([])

    useEffect(() => {
        getUser();
    }, [])

    const handleDeleteUser = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
            return;
        }
        try {
            const response = await deleteUser(id)
            if (response) {
                alert("Usuario eliminado con exito")
                setUser(user.filter(user => user.id !== id));   //actualizamos el contenido de la tabla
            }
        } catch (error) {
            alert(error.message || "Error al eliminar el usuario");
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
                <h1 className="h2"><i className="bi bi-person"></i> Usuarios</h1>
            </div>
            <div className="row g-4 mb-3">
                <div className="col col-lg-2">
                    <button type="button" className="btn btn-success" onClick={() => showModalAdd()}><i className="bi bi-person-plus"></i> Agregar usuario</button>
                </div>
                {
                    user.length === 0 ? (
                        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                            <div className="text-center">
                                <i className="bi bi-person-x display-1 text-warning mb-4"></i>
                                <h2 className="fw-bold text-muted">
                                    No hay usuarios registrados
                                </h2>
                            </div>
                        </div>
                    ) : (
                        <>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Apellido</th>
                                        <th scope="col">Password</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Rol</th>
                                        <th scope="col">Fecha de registro</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.map((user) => (
                                        <tr key={user.id}>
                                            <th scope="row">{user.id}</th>
                                            <td>{user.name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.password}</td>
                                            <td>{user.email}</td>
                                            <td>{user.type}</td>
                                            <td>{user.created_at}</td>
                                            <td>
                                                <button type="button" className="btn btn-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteUser(user.id)}>
                                                    <i className="bi bi-trash"></i> Eliminar
                                                </button>
                                                <button type="button" className="btn btn-warning" onClick={() => {
                                                    const UpdateData = {
                                                        id_user: user.id,
                                                        name: user.name,
                                                        last_name: user.last_name,
                                                        password: user.password,
                                                        email: user.email,
                                                        type: user.type
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
            <AddUserModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                addUser={addUser}
                getUser={getUser}
            />
            <UpdateUserModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateUser={updateUser}
                getUser={getUser}
                updateData={updateData}
            />
        </>
    )
}


export default Users