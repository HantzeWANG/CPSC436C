import React, { useState } from "react";
import Webcam from "react-webcam";
import { uploadAttedancePhoto } from "../services/api";
import TextField from "@mui/material/TextField";
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export const WebcamCapture = () => {
	const navigate = useNavigate();
	const [deviceId, setDeviceId] = useState({});
	const [devices, setDevices] = useState([]);
	const [profileID, setProfileID] = useState("");

	const handleDevices = React.useCallback(
		(mediaDevices) =>
			setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
		[setDevices]
	);

	const handleDeviceChange = (event) => {
		setDeviceId(event.target.value);
	};

	const handleNameChange = (event) => {
		setProfileID(event.target.value);
	};

	const handleGoBackHomePage = () => {
		navigate("/welcome");
	};

	React.useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(handleDevices);
	}, [handleDevices]);

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "10px 20px",
					marginBottom: "20px",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
						flex: 1,
					}}
				>
					<Button
						variant="contained"
						startIcon={<HomeIcon style={{ fontSize: 20 }} />}
						onClick={handleGoBackHomePage}
						style={{
							fontSize: "0.8rem",
							padding: "5px 15px",
							backgroundColor: "#007bff",
							color: "#fff",
							borderRadius: "5px",
							cursor: "pointer",
						}}
					>
						Home
					</Button>
				</div>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<h2 style={{ margin: 0 }}>Sign Attendance</h2>
				</div>
				<div style={{ flex: 1 }}></div>
			</div>
			<div>
				<p>Please enter your profile ID:</p>
				<TextField
					required
					id="outlined-required"
					label="Required"
					value={profileID}
					onChange={handleNameChange}
				/>
				<select onChange={handleDeviceChange}>
					{devices.map((device, key) => (
						<option key={key} value={device.deviceId}>
							{device.label || `Device ${key + 1}`}
						</option>
					))}
				</select>
				<div>
					<Webcam
						audio={false}
						height={720}
						screenshotFormat="image/jpeg"
						width={1280}
						videoConstraints={{
							width: 1280,
							height: 720,
							facingMode: "user",
							deviceId: deviceId,
						}}
					>
						{({ getScreenshot }) => (
							<button
								onClick={async () => {
									const imageBase64 = getScreenshot();
									console.log(imageBase64);
									await uploadAttedancePhoto(imageBase64, profileID);
									alert("Photo uploaded");
								}}
							>
								Capture photo
							</button>
						)}
					</Webcam>
				</div>
			</div>
		</>
	);
};
