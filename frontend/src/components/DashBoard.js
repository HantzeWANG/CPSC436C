import React, { useState, useEffect } from "react";
import { listProfiles } from "../services/profilepics";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import AddProfileModal from "./AddProfileModal";

const DashBoard = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "name",
			headerName: "Name",
			width: 150,
		},
		{
			field: "lastModified",
			headerName: "Last Modified",
			width: 200,
		},
		{
			field: "size",
			headerName: "Size (KB)",
			width: 110,
		},
	];

	useEffect(() => {
		const loadFiles = async () => {
			try {
				const fileList = await listProfiles();
				const formattedFiles = fileList.map((file, index) => ({
					id: index + 1,
					name: file.Key.split("/").pop(),
					lastModified: new Date(file.LastModified).toLocaleString(),
					size: Math.round(file.Size / 1024),
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
				<h2>DashBoard</h2>
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
