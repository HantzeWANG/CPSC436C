import React from "react";
import { initiateLogin } from "../services/auth";

const Login = () => {
	return (
		<div>
			<h2>Admin Login</h2>
			<button onClick={initiateLogin}>Sign In with Cognito</button>
		</div>
	);
};

export default Login;
