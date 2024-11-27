import React, { useState, useCallback } from "react";
import { uploadProfilePicture } from "../services/profilepics";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const DragDrop = ({ profileID, onUploadSuccess }) => {
	const [image, setImage] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
	const [isDragging, setIsDragging] = useState(false);

	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

	const validateFile = (file) => {
		if (!file.type.startsWith("image/")) {
			throw new Error("Please select an image file.");
		}
		if (file.size > MAX_FILE_SIZE) {
			throw new Error("File size exceeds 5MB limit.");
		}
		if (!profileID) {
			throw new Error("Please enter a Profile ID first.");
		}
	};

	const handleDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((event) => {
		event.preventDefault();
		setIsDragging(false);
	}, []);

	const handleFileProcess = async (file) => {
		try {
			validateFile(file);
			const reader = new FileReader();
			reader.onload = async (e) => {
				setImage(e.target.result);
				try {
					setIsUploading(true);
					const s3Url = await uploadProfilePicture(file, profileID);
					setUploadStatus({ type: "success", message: "Upload successful!!" });
					if (onUploadSuccess) {
						await onUploadSuccess(s3Url);
					}
				} catch (error) {
					console.log("line 52")
					console.log(error.message)
					setUploadStatus({
						type: "error",
						message: error.message || "Upload failed. Please try again.",
					});
					setImage(null);
				} finally {
					setIsUploading(false);
					setIsDragging(false);
				}
			};
			reader.readAsDataURL(file);
		} catch (error) {
			setUploadStatus({ type: "error", message: error.message });
		}
	};

	const handleDrop = useCallback(async (event) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) {
			await handleFileProcess(file);
		}
	}, []);

	const handleFileSelect = async (event) => {
		const file = event.target.files[0];
		if (file) {
			await handleFileProcess(file);
		}
	};

	return (
		<div style={{ textAlign: "center", marginTop: "20px" }}>
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => document.getElementById("fileInput").click()}
				style={{
					width: "300px",
					height: "200px",
					border: `2px dashed ${isDragging ? "#007bff" : "#ccc"}`,
					borderRadius: "10px",
					margin: "auto",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: isDragging ? "#f0f8ff" : "#f9f9f9",
					cursor: "pointer",
					transition: "all 0.3s ease",
					position: "relative",
					userSelect: "none",
				}}
			>
				{isUploading ? (
					<CircularProgress />
				) : image ? (
					<img
						src={image}
						alt="Preview"
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							borderRadius: "8px",
							pointerEvents: "none",
						}}
					/>
				) : (
					<p style={{ pointerEvents: "none" }}>
						Drag and drop an image here or click to select
					</p>
				)}
			</div>

			<input
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				style={{ display: "none" }}
				id="fileInput"
			/>

			<button
				onClick={() => document.getElementById("fileInput").click()}
				disabled={isUploading}
				style={{
					marginTop: "10px",
					padding: "10px 20px",
					border: "none",
					backgroundColor: isUploading ? "#ccc" : "#007bff",
					color: "#fff",
					borderRadius: "5px",
					cursor: isUploading ? "not-allowed" : "pointer",
					transition: "background-color 0.3s ease",
				}}
			>
				{isUploading ? "Uploading..." : "Select an Image"}
			</button>

			<Snackbar
				open={!!uploadStatus.message}
				autoHideDuration={6000}
				onClose={() => setUploadStatus({ type: "", message: "" })}
			>
				<Alert
					severity={uploadStatus.type}
					onClose={() => setUploadStatus({ type: "", message: "" })}
				>
					{uploadStatus.message}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default DragDrop;
