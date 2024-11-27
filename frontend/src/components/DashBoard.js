import React, { useState, useEffect } from "react";
import { listProfiles } from "../services/profilepics";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import AddProfileModal from "./AddProfileModal";
const API_URL = process.env.REACT_APP_API_URL;

const DashBoard = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);

	const columns = [
		{ 	field: "profile_id", 
			headerName: "ID", 
			width: 120 },
		{
			field: "profile_name",
			headerName: "Name",
			width: 150,
		},
		{
			field: "profile_image",
			headerName: "profile_image",
			width: 200,
		},
	];

	useEffect(() => {
		const loadFiles = async () => {
			try {
				const fileList = await listProfiles();
				const formattedFiles = await Promise.all(fileList.map(async (file, index) => {
					const profile_id = file.Key.split("/").pop().split(".").slice(0, -1).join(".");
					
					// Fetch profile data from the endpoint
					const response = await fetch(`${API_URL}/profiles/${profile_id}/`);
					console.log(response)
					const profileData = await response.json();
					console.log(profileData[0])

					return {
						id: index + 1,
						profile_id: profile_id,
						profile_name: profileData[0].profile_name,
						profile_image: profileData[0].profile_image,
					};
				}));
				setFiles(formattedFiles);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadFiles();
	}, []);

	if (loading) return <div>Loading files...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Dashboard</h2>
				<button
					onClick={() => setShowAddModal(true)}
					style={{
						padding: "10px 20px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					Add Profile
				</button>
			</div>
			<Box sx={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={files}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					disableSelectionOnClick
					sx={{
						boxShadow: 2,
						border: 1,
						borderColor: "grey.400",
						"& .MuiDataGrid-cell:hover": {
							color: "primary.main",
						},
					}}
				/>
			</Box>
			{showAddModal && (
				<AddProfileModal onClose={() => setShowAddModal(false)} />
			)}
		</div>
	);
};

export default DashBoard;
