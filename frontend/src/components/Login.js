import React from "react";
import { initiateLogin } from "../services/auth";
import SideNav from "./SideNav";
import Button from '@mui/material/Button';

const Login = () => {
    return (
        <div>
            <SideNav />
            <h2>Welcome to the TripleSix Attendance System!</h2>
            <Button variant="contained" onClick={initiateLogin}>Sign in</Button>
        </div>
    );
};

export default Login;
