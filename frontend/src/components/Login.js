import React from "react";
import { initiateLogin } from "../services/auth";

const Login = () => {
	return (
		<div>
			<h2>Welcome to the TripleSix Attendance System!</h2>
			<button onClick={initiateLogin}>Sign In</button>
		</div>
	);
};

export default Login;
