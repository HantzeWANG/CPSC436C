import React from "react";
import { initiateLogin } from "../services/auth";
import Button from '@mui/material/Button';
import loginBackground from '../assets/558a1583-1cb9-4703-8e09-6cc2ecd04c70.mp4'

const Login = () => {
    const background = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    }
    const videoStyle = {
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    }
    return (
        <div>
            <div style={background}>
                <video autoPlay loop muted style={videoStyle}>
                    <source src={loginBackground} type="video/mp4" />
                </video>
            </div>
            <div
                style={{
                    zIndex: 1,
                        position: 'fixed',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 'xx-large',
                        left: '50px',
                        top: '50%',
                        display: 'flex',
                        flexDirection: 'column'
                }}
            >
                <h2 style={{ marginBottom: '10px' }}>Authenticate with Confidence, </h2>
                <h2 style={{
                    display: 'flex',
                    margin: '0 10px 20px 0'
                }}>Attend with Ease.</h2>
                <Button
                    variant="contained"
                    onClick={initiateLogin}
                    sx={{
                        color: '#000',
                        borderRadius: '10px',
                        width: '100px',
                        background: '#fff'
                    }}
                >
                    Sign in
                </Button>
            </div>
        </div>
    );
};

export default Login;
