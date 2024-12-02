import React from 'react';
import SideNav from './SideNav';
import "./css/Layout.css"

const Layout = ({ children, showSideNav }) => {
    return (
        <div className="layout-container">
            {showSideNav && <SideNav />}
            <div className="content">{children}</div>
        </div>
    );
};

export default Layout;