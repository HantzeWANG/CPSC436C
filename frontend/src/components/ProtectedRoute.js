import React from "react";
import { Navigate } from "react-router-dom";
import { getTokens, getUserEmail } from "../services/auth";

const ProtectedRoute = ({ children }) => {
	const { idToken } = getTokens();
	const userEmail = getUserEmail();

	if (!idToken) {
		// Redirect to login if no token exists
		return <Navigate to="/login" replace />;
	}

	// Clone the child element with the userEmail prop
	return React.cloneElement(children, { userEmail });
};

export default ProtectedRoute;
