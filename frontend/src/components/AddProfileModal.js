import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import DragDrop from "./DragDrop";
import TextField from "@mui/material/TextField";
import { createProfile } from "../services/api";
import { getTokens } from "../services/auth";

const AddProfileModal = ({ onClose, onProfileAdded }) => {
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

            setTimeout(() => {
                onClose();
                if (typeof onProfileAdded === 'function') {
                    onProfileAdded();
                } else {
                    console.error("onProfileAdded is not a function");
                }
            }, 2000);
        } catch (error) {
            setUploadStatus({ type: "error", message: error.message });
        }
    };

	return (
		<Modal open={true} onClose={onClose}>
			<Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
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
			</Box>
		</Modal>
	);
};

export default AddProfileModal;
