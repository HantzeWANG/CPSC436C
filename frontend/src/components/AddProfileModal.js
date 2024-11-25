import React, { useState } from "react";
import Modal from "./Modal";
import DragDrop from "./DragDrop";
import TextField from "@mui/material/TextField";
import { createProfile } from "../services/api";
import { getTokens } from "../services/auth";

const AddProfileModal = ({ onClose }) => {
	const [profileID, setProfileID] = useState("");
	const [profileName, setProfileName] = useState("");
	const [uploadStatus, setUploadStatus] = useState(null);

	const handleProfileCreation = async (s3ImageUrl) => {
		try {
			const { idToken } = getTokens();
			const payload = JSON.parse(atob(idToken.split(".")[1]));
			const adminID = payload.sub;

			await createProfile({
				profileID: profileID,
				profileName: profileName,
				profileImageUrl: s3ImageUrl,
				adminID: adminID,
			});

			setUploadStatus({
				type: "success",
				message: "Profile created successfully!",
			});
			setTimeout(onClose, 2000);
		} catch (error) {
			setUploadStatus({ type: "error", message: error.message });
		}
	};

	return (
		<Modal>
			<div className="add-profile-modal">
				<h2>Add New Profile</h2>
				<TextField
					required
					id="profileID"
					label="Profile ID"
					value={profileID}
					onChange={(e) => setProfileID(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>
				<TextField
					required
					id="profileName"
					label="Profile Name"
					value={profileName}
					onChange={(e) => setProfileName(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>
				<DragDrop
					profileID={profileID}
					onUploadSuccess={handleProfileCreation}
				/>
				<div className="button-container">
					<button onClick={onClose}>Close</button>
				</div>
				{uploadStatus && (
					<div className={`status-message ${uploadStatus.type}`}>
						{uploadStatus.message}
					</div>
				)}
			</div>
		</Modal>
	);
};

export default AddProfileModal;
