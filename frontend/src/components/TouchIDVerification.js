import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TouchIDVerification = () => {
	const [isSupported, setIsSupported] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [error, setError] = useState("");
	const [isRegistered, setIsRegistered] = useState(false);
	const navigate = useNavigate();

	const verifyWithTouchID = async () => {
		try {
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

			console.log("Verification successful");
			setIsVerified(true);
			navigate("/dashboard");
		} catch (error) {
			console.error("Touch ID verification failed:", error);
			setError("Verification failed. Please try again.");

			navigate("/welcome");
		}
	};

	// Single useEffect for initial setup
	useEffect(() => {
		const checkSupport = async () => {
			if (typeof window !== "undefined" && window.PublicKeyCredential) {
				try {
					const available =
						await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
					console.log("Touch ID available:", available);
					setIsSupported(available);
					const registered = localStorage.getItem("touchIDRegistered");
					setIsRegistered(!!registered);

					if (available && registered) {
						verifyWithTouchID();
					}
				} catch (err) {
					console.error("Error checking Touch ID support:", err);
					setIsSupported(false);
					setError("Touch ID is not available on this device");
				}
			} else {
				console.log("WebAuthn is not supported");
				setIsSupported(false);
				setError("WebAuthn is not supported in this browser");
			}
		};

		checkSupport();
	}, []); // Empty dependency array - only run once on mount

	const registerTouchID = async () => {
		try {
			const userId = new Uint8Array(16);
			window.crypto.getRandomValues(userId);

			const publicKeyCredentialCreationOptions = {
				challenge: new Uint8Array(32),
				rp: {
					name: "Attendance App",
					id: window.location.hostname,
				},
				user: {
					id: userId,
					name: "admin@example.com",
					displayName: "Admin User",
				},
				pubKeyCredParams: [
					{
						type: "public-key",
						alg: -7,
					},
				],
				authenticatorSelection: {
					authenticatorAttachment: "platform",
					userVerification: "required",
				},
				timeout: 60000,
			};

			await navigator.credentials.create({
				publicKey: publicKeyCredentialCreationOptions,
			});

			console.log("Registration successful");
			localStorage.setItem("touchIDRegistered", "true");
			setIsRegistered(true);
			// Verify after registration
			verifyWithTouchID();
		} catch (error) {
			console.error("Registration failed:", error);
			setError("Touch ID registration failed. Please try again.");
			navigate("/welcome");
		}
	};

	if (!isSupported) {
		return (
			<div className="touch-id-error">
				<h2>Device Not Supported</h2>
				<p>{error}</p>
				<button onClick={() => navigate("/welcome")}>
					Back to Welcome Page
				</button>
			</div>
		);
	}

	if (!isRegistered) {
		return (
			<div className="touch-id-registration">
				<h2>Touch ID Setup Required</h2>
				<p>Please register your Touch ID for admin access</p>
				<button onClick={registerTouchID}>Register Touch ID</button>
				{error && <p className="error">{error}</p>}
				<button onClick={() => navigate("/welcome")}>Cancel</button>
			</div>
		);
	}

	return (
		<div className="touch-id-verification">
			<h2>Verifying Admin Access...</h2>
			<p>Please use Touch ID when prompted</p>
			{error && <p className="error">{error}</p>}
			<button onClick={() => navigate("/welcome")}>Cancel</button>
		</div>
	);
};

export default TouchIDVerification;
