import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Products from "./Products";
import useProduct from "../hooks/useProduct";
import SalesDetails from "./SalesDetails";
import ShoppingCart from "./ShoppingCart";
import useShoppingCart from "../hooks/useShoppingCart";

const Home = () => {
    const { customer, isVerified } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { logout } = useLogin();
    const [selectedView, setSelectedView] = useState(1);
    const { getProducts, products } = useProduct();
    const { get_items, items, delete_item } = useShoppingCart();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response) {
                setShowModal(false);
                setSelectedView(1);
                navigate('/');
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                await getProducts();
            } catch (err) {
                setError("Error al cargar productos");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Tabs selectedIndex={selectedView} onSelect={setSelectedView}>
                <nav className="navbar navbar-dark bg-dark fixed-top">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">TextilExport Shop</a>
                        {customer && isVerified ? (
                            <>
                                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar">
                                    <div className="offcanvas-header">
                                        <h5 className="offcanvas-title">Bienvenido usuario {customer?.name || "Invitado"} {customer.last_name}</h5>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                                    </div>
                                    <div className="offcanvas-body">
                                        <TabList className="nav flex-column">
                                            <Tab className="nav-link text-white" selectedClassName="active" key="sales">
                                                <i className="bi bi-receipt-cutoff"></i> Historial de compras
                                            </Tab>
                                            <Tab className="nav-link text-white" selectedClassName="active" key="products">
                                                <i className="bi bi-bag"></i> Productos ofertados
                                            </Tab>
                                            <Tab className="nav-link text-white" selectedClassName="active" key="cart">
                                                <i className="bi bi-cart"></i> Carrito de compras
                                            </Tab>
                                        </TabList>
                                        <hr />
                                        <button className="nav-link btn btn-link text-danger" onClick={() => setShowModal(true)}>
                                            <i className="bi bi-box-arrow-left"></i> Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-success" onClick={() => navigate('/login')}>
                                    <i className="bi bi-box-arrow-in-right"></i> Iniciar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="mt-5 pt-4">
                    {isLoading ? (
                        <div>Cargando...</div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <>
                            <TabPanel key="sales">
                                <SalesDetails customer={customer} />
                            </TabPanel>
                            <TabPanel key="products">
                                <Products products={products} customer={customer} isVerified={isVerified} getProducts={getProducts} />
                            </TabPanel>
                            <TabPanel key="cart">
                                <ShoppingCart customer={customer} get_items={get_items} items={items} delete_item={delete_item} getProducts={getProducts} />
                            </TabPanel>
                        </>
                    )}
                </div>
            </Tabs>

            {showModal && (
                <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cerrar sesión</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">¿Estás seguro que deseas cerrar sesión?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    <i className="bi bi-x"></i> Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-left"></i> Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;