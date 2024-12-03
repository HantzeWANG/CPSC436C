import React, { useState, useEffect } from "react";
import SideNav from "./SideNav";
import { Collapse, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./css/Layout.css";

const Layout = ({ children, showSideNav }) => {
	const [isNavOpen, setIsNavOpen] = useState(showSideNav);

	useEffect(() => {
		setIsNavOpen(showSideNav);
	}, [showSideNav]);

	return (
		<div className="layout-container">
			<div className="sidebar-container">
				<Collapse
					in={isNavOpen}
					orientation="horizontal"
					className="sidebar-collapse"
				>
					<div className="sidebar-content">
						<SideNav />
					</div>
				</Collapse>

				<IconButton
					onClick={() => setIsNavOpen(!isNavOpen)}
					className="toggle-button"
				>
					{isNavOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</IconButton>
			</div>

			<main
				className="main-content"
				style={{ marginLeft: isNavOpen ? "240px" : "40px" }}
			>
				{children}
			</main>
		</div>
	);
};

export default Layout;
