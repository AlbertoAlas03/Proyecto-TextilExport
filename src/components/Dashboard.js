import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Footer from "./Footer";
import Main from "./Main";
import Inventory from "./Inventory";

const Dashboard = () => {

    const [selectedView, setSelectedView] = useState(0);

    return (
        <>
            <Tabs selectedIndex={selectedView} onSelect={setSelectedView}>
                <header className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
                    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">TextilExport || El Salvador</a>
                </header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                            <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                                <div className="offcanvas-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                                    <TabList className="nav flex-column">
                                        <Tab className="nav-link d-flex align-items-center gap-2 active" aria-current="page">
                                            <i className="bi bi-speedometer2"></i>
                                            Dashboard
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-box-seam"></i>
                                            Inventario
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-bookmark"></i>
                                            Categorias
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-graph-up-arrow"></i>
                                            Ventas
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-person"></i>
                                            Usuarios
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-people"></i>
                                            Clientes
                                        </Tab>
                                    </TabList>
                                    <hr className="my-3" />
                                    <TabList className="nav flex-column mb-auto">
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-gear"></i>
                                            Ajustes
                                        </Tab>
                                        <Tab className="nav-link d-flex align-items-center gap-2">
                                            <i className="bi bi-box-arrow-in-left"></i>
                                            Cerrar sesión
                                        </Tab>
                                    </TabList>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4 pt-3">
                            <TabPanel>
                                <Main />
                            </TabPanel>
                            <TabPanel>
                                <Inventory />
                            </TabPanel>
                        </div>
                    </div>
                </div>
                <Footer />
            </Tabs>
        </>
    )
}

export default Dashboard