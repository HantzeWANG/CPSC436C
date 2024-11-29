import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const WelcomePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleDashboardAccess = async () => {
        try {
            if (typeof window !== "undefined" && window.PublicKeyCredential) {
                const available =
                    await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                if (!available) {
                    setError("Touch ID is not available on this device");
                    return;
                }

                const registered = localStorage.getItem("touchIDRegistered");
                if (!registered) {
                    navigate("/verify-dashboard"); // Only navigate to registration if needed
                    return;
                }

                // Verify with Touch ID
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);

                const publicKeyCredentialRequestOptions = {
                    challenge,
                    rpId: window.location.hostname,
                    timeout: 60000,
                    userVerification: "required",
                };

                await navigator.credentials.get({
                    publicKey: publicKeyCredentialRequestOptions,
                });

                // If verification successful, navigate to dashboard
                navigate("/dashboard");
            } else {
                setError("WebAuthn is not supported in this browser");
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setError("Verification failed. Please try again.");
        }
    };

    const handleSignAttendance = () => {
        navigate("/checkin");
    };

    return (
        <div
            className="welcome-page"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center'
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Attendance System
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography gutterBottom sx={{ maxWidth: '50%' }}>
                    Register by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfersRegister by December 13, initiate your deposits or transfers
                </Typography>
            </div> 

			<br />

            <div className="options" style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<AccountBoxIcon style={{ fontSize: 40 }} />}
                    onClick={handleDashboardAccess}
                    style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '50px', background: '#000' }}
                >
                    Access Dashboard
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddAPhotoIcon style={{ fontSize: 40 }} />}
                    onClick={handleSignAttendance}
                    style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '50px', background: '#fff', color: '#000' }}
                >
                    TAKE ATTENDANCE
                </Button>
            </div>
            {error && <Typography variant="body1" color="error">{error}</Typography>}
        </div>
    );
};

export default WelcomePage;
