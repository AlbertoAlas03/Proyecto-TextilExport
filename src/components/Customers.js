import React, { useEffect, useState } from "react";
import useCustomer from "../hooks/useCustomer";
import UpdateCustomerModal from "./UpdateCustomerModal";
import useSearch from "../hooks/useSearch";

const Customers = () => {

    const { customer, getCustomers, disableCustomer, updateCustomer, enableCustomer } = useCustomer();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState([])
    const { getCustomerByLast_name, customerByLast_name, setCustomerByLast_name } = useSearch();
    const [dataSearched, setdataSearched] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        getCustomers();
    }, [])

    const handleDisableCustomer = async (id_customer) => {
        setError(null)
        if (!window.confirm('¿Estás seguro de que quieres inhabilitar a este cliente?')) {
            return;
        }
        try {
            const response = await disableCustomer(id_customer)
            if (response) {
                alert("Cliente inhabilitado con exito")
                getCustomers() //actualizamos el contenido de la tabla
                setCustomerByLast_name([]);
                setdataSearched('')
            }
        } catch (error) {
            console.error("Error disable customer:", error);
            alert(error.message || "Error al inhabilitar al cliente");
        }
    }

    const handleEnableCustomer = async (id_customer) => {
        setError(null)
        if (!window.confirm('¿Estás seguro de que quieres habilitar a este cliente?')) {
            return;
        }
        try {
            const response = await enableCustomer(id_customer)
            if (response) {
                alert("Cliente habilitado con exito")
                getCustomers()   //actualizamos el contenido de la tabla
                setCustomerByLast_name([]);
                setdataSearched('')
            }
        } catch (error) {
            console.error("Error enable customer:", error);
            alert(error.message || "Error al habilitar al cliente");
        }
    }

    const showModalUpdate = async (updateData) => {
        setError(null)
        setShowUpdateModal(true)
        setUpdateData(updateData)
    }

    const handleSearch = async (data) => {
        setError(null)
        try {
            const response = await getCustomerByLast_name(data);
            if (!response?.length) {
                setError("Este usuario no existe");
            }
        } catch (error) {
            setError(error.message || "Error al filtar el cliente");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-people"></i> Clientes</h1>
            </div>
            <div className="col col-md-6 d-flex" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar cliente por apellido..."
                    value={dataSearched}
                    onChange={(e) => setdataSearched(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={() => handleSearch(dataSearched)}>
                    <i className="bi bi-search"></i>
                </button>
            </div>
            <div className="row g-4 mb-3">
                {
                    customerByLast_name.length > 0 ? (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Password</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col">Numero de teléfono</th>
                                    <th scope="col">Verificación</th>
                                    <th scope="col">Estado actual</th>
                                    <th scope="col">Fecha registro</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerByLast_name.map((customer) => (
                                    <tr key={customer.id}>
                                        <th scope="row">{customer.id}</th>
                                        <td>{customer.name}</td>
                                        <td>{customer.last_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.password}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.phone_number}</td>
                                        <td>{customer.verify}</td>
                                        <td>{customer.status}</td>
                                        <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex">
                                                <button type="button" className={customer.status === 'habilitado' ? 'btn btn-danger' : 'btn btn-success'} style={{ marginRight: '10px' }} onClick={() => {
                                                    if (customer.status === 'habilitado') {
                                                        handleDisableCustomer(customer.id);
                                                    } else {
                                                        handleEnableCustomer(customer.id);
                                                    }
                                                }
                                                }>
                                                    <i className={customer.status === 'habilitado' ? 'bi bi-x-circle' : 'bi bi-check2'}></i>
                                                    {customer.status === 'habilitado' ? ' Inhabilitar' : ' Habilitar'}
                                                </button>

                                                <button type="button" className="btn btn-warning" onClick={() => {
                                                    const UpdateData = {
                                                        id_customer: customer.id,
                                                        name: customer.name,
                                                        last_name: customer.last_name,
                                                        email: customer.email,
                                                        password: customer.password,
                                                        address: customer.address,
                                                        phone_number: customer.phone_number
                                                    }
                                                    showModalUpdate(UpdateData)
                                                }
                                                }>
                                                    <i className="bi bi-pencil-square"></i> Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        customer.length === 0 ? (
                            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                                <div className="text-center">
                                    <i className="bi bi-person-x display-1 text-warning mb-4"></i>
                                    <h2 className="fw-bold text-muted">
                                        No hay clientes registrados
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
                                            <th scope="col">Apellido</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Password</th>
                                            <th scope="col">Dirección</th>
                                            <th scope="col">Numero de teléfono</th>
                                            <th scope="col">Verificación</th>
                                            <th scope="col">Estado actual</th>
                                            <th scope="col">Fecha registro</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer.map((customer) => (
                                            <tr key={customer.id}>
                                                <th scope="row">{customer.id}</th>
                                                <td>{customer.name}</td>
                                                <td>{customer.last_name}</td>
                                                <td>{customer.email}</td>
                                                <td>{customer.password}</td>
                                                <td>{customer.address}</td>
                                                <td>{customer.phone_number}</td>
                                                <td>{customer.verify}</td>
                                                <td>{customer.status}</td>
                                                <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <button type="button" className={customer.status === 'habilitado' ? 'btn btn-danger' : 'btn btn-success'} style={{ marginRight: '10px' }} onClick={() => {
                                                            if (customer.status === 'habilitado') {
                                                                handleDisableCustomer(customer.id);
                                                            } else {
                                                                handleEnableCustomer(customer.id);
                                                            }
                                                        }
                                                        }>
                                                            <i className={customer.status === 'habilitado' ? 'bi bi-x-circle' : 'bi bi-check2'}></i>
                                                            {customer.status === 'habilitado' ? ' Inhabilitar' : ' Habilitar'}
                                                        </button>

                                                        <button type="button" className="btn btn-warning" onClick={() => {
                                                            const UpdateData = {
                                                                id_customer: customer.id,
                                                                name: customer.name,
                                                                last_name: customer.last_name,
                                                                email: customer.email,
                                                                password: customer.password,
                                                                address: customer.address,
                                                                phone_number: customer.phone_number
                                                            }
                                                            showModalUpdate(UpdateData)
                                                        }
                                                        }>
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

            <UpdateCustomerModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                updateCustomer={updateCustomer}
                getCustomers={getCustomers}
                updateData={updateData}
                setCustomerByLast_name={setCustomerByLast_name}
                setdataSearched={setdataSearched}
            />
        </>
    )
}

export default Customers