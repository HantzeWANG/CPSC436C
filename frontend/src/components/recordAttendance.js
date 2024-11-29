import React, { useState } from "react";
import Webcam from "react-webcam";
import { uploadAttedancePhoto } from "../services/api";
import TextField from "@mui/material/TextField";
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Container from '@mui/material/Container';

export const WebcamCapture = () => {
	const navigate = useNavigate();
	const [deviceId, setDeviceId] = useState({});
	const [devices, setDevices] = useState([]);
	const [profileID, setProfileID] = useState("");

	const handleDevices = (mediaDevices) => {
		const list = mediaDevices.filter(({ kind }) => kind === "videoinput")
		setDevices(list)
		setDeviceId(list[0].deviceId)
	}

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
	}, []);

	return (
		<>
			<AppBar position="static" sx={{ background: '#fff', marginBottom: '20px' }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#000', cursor: 'pointer' }} onClick={handleGoBackHomePage} />
						<h2 style={{ color: '#000', width: '100%' }}>Sign Attendance</h2>
					</Toolbar>
				</Container>
			</AppBar>
			<div>
				<Webcam
					audio={false}
					height={360}
					screenshotFormat="image/jpeg"
					width={640}
					videoConstraints={{
						width: 640,
						height: 360,
						facingMode: "user",
						deviceId: deviceId,
					}}
				>
					{({ getScreenshot }) => (
						<div
							style={{
								position: 'fixed',
								right: '10px',
								bottom: '10px'
							}}
						>
							<Button
								variant="contained"
								onClick={async () => {
									const imageBase64 = getScreenshot();
									console.log(imageBase64);
									await uploadAttedancePhoto(imageBase64, profileID);
									alert("Photo uploaded");
								}}
								sx={{ background: '#000' }}
							>
								Capture photo
							</Button>
						</div>
					)}
				</Webcam>
			</div>
			<div>
				<TextField
					required
					id="profileId"
					label="profile ID"
					value={profileID}
					onChange={handleNameChange}
					sx={{
						width: '210px',
						margin: '10px 0'
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ margin: '10px 0', width: "210px" }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">camera</InputLabel>
						<Select
							value={deviceId}
							label="camera"
							onChange={handleDeviceChange}
							>
							{devices.map((device, key) => (
								<MenuItem value={device.deviceId}>
									{device.label || `Device ${key + 1}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				</div>
			</div>
		</>
	);
};
