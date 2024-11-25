import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

	return (
		<div className="welcome-page">
			<h1>Welcome to Attendance System</h1>
			<div className="options">
				<button onClick={handleDashboardAccess}>Access Dashboard</button>
				<button onClick={() => navigate("/checkin")}>Check In</button>
			</div>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default WelcomePage;
