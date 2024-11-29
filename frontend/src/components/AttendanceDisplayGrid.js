import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getUserId } from "../services/profilepics";
import { Alert, Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Modal from "@mui/material/Modal";

const API_URL = process.env.REACT_APP_API_URL;

const AttendanceDisplayGrid = () => {
	const [rows, setRows] = useState([]);
	const [error, setError] = useState(null);
	const [expandedDates, setExpandedDates] = useState({});
	const [previewImageUrl, setPreviewImageUrl] = useState(null);
	const columns = [
		{
			field: "profile_id",
			headerName: "ID",
			width: 90,
		},
		{
			field: "profile_name",
			headerName: "Name",
			width: 150,
		},
		{
			field: "attendance",
			headerName: "Attendance",
			width: 200,
			valueGetter: (params) => {
				return params ? "✅" : "❌";
			},
		},
		{
			field: "check_in_time",
			headerName: "Check-in Time",
			width: 200,
		},
		{
			field: "check_in_image",
			headerName: "Check-in Image",
			width: 200,
			renderCell: (params) => {
				console.log("params: ", params);
				return params.row.check_in_image ? (
					<button
						onClick={() => setPreviewImageUrl(params.row.check_in_image)}
						style={{
							background: "none",
							border: "none",
							color: "#007bff",
							cursor: "pointer",
							textDecoration: "underline",
						}}
					>
						Preview Image
					</button>
				) : null;
			},
		},
	];

	function processData(profiles, attendanceRecords) {
		console.log("Processing - Profiles:", profiles);
		console.log("Processing - Attendance Records:", attendanceRecords);

		const attendanceByDate = attendanceRecords.reduce((acc, record) => {
			const date = new Date(record.timestamp);
			const dateKey = date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});

			if (!acc[dateKey]) {
				acc[dateKey] = new Map();
			}
			acc[dateKey].set(record.profile.profile_id, {
				present: true,
				photo: record.photo_url,
				time: date.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				}),
			});
			return acc;
		}, {});

		console.log("Attendance by date:", attendanceByDate);

		// Create a map of dates and their corresponding rows
		const groupedData = {};
		Object.keys(attendanceByDate).forEach((dateKey) => {
			// For each date, create a row for each profile
			groupedData[dateKey] = profiles.map((profile) => {
				const attendanceInfo = attendanceByDate[dateKey].get(
					profile.profile_id
				);
				return {
					id: `${dateKey}-${profile.profile_id}`,
					profile_id: profile.profile_id,
					profile_name: profile.profile_name,
					check_in_time: attendanceInfo?.time || null,
					attendance: attendanceInfo?.present || false,
					check_in_image: attendanceInfo?.photo || null,
				};
			});
		});

		// Sort dates in descending order
		const sortedData = Object.fromEntries(
			Object.entries(groupedData).sort((a, b) => {
				const dateA = new Date(a[0]);
				const dateB = new Date(b[0]);
				return dateB - dateA;
			})
		);

		return sortedData;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userid = await getUserId();

				// Fetch all profiles under this admin
				const profilesResponse = await fetch(
					`${API_URL}/profiles_by_admin/${userid}/`
				);
				if (!profilesResponse.ok) {
					throw new Error("Failed to fetch profiles");
				}
				const profiles = await profilesResponse.json();

				// Fetch attendance records
				const attendanceResponse = await fetch(
					`${API_URL}/attendance/${userid}/`
				);
				if (!attendanceResponse.ok) {
					throw new Error("Failed to fetch attendance data");
				}
				const attendanceData = await attendanceResponse.json();

				// Process the data
				const processedData = processData(profiles, attendanceData);
				setRows(processedData);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error.message);
			}
		};

		fetchData();
	}, []);

	const handleToggleCollapse = (dateKey) => {
		setExpandedDates((prevState) => ({
			...prevState,
			[dateKey]: !prevState[dateKey], // Toggle the collapse state
		}));
	};

	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<Box sx={{ height: 400, width: "100%" }}>
				{Object.keys(rows).length === 0 ? (
					<div style={{ textAlign: "center", margin: "20px", color: "gray" }}>
						<Alert severity="info">
							No associated attendance has been retrieved.
						</Alert>
						<DataGrid
							rows={[]}
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
					</div>
				) : (
					Object.keys(rows).map((dateKey) => {
						const tableRows = rows[dateKey];
						const isExpanded = expandedDates[dateKey];

						return (
							<div key={dateKey} style={{ marginBottom: "20px" }}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<h2>{`Date: ${dateKey}`}</h2>
									<IconButton
										onClick={() => handleToggleCollapse(dateKey)}
										color="primary"
									>
										{isExpanded ? <ExpandLess /> : <ExpandMore />}
									</IconButton>
								</div>

								{/* Collapsible DataGrid */}
								<Collapse in={isExpanded}>
									<DataGrid
										rows={tableRows}
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
								</Collapse>
							</div>
						);
					})
				)}
			</Box>
			<Modal open={!!previewImageUrl} onClose={() => setPreviewImageUrl(null)}>
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
					<img src={previewImageUrl} alt="Preview" style={{ width: "100%" }} />
				</Box>
			</Modal>
		</>
	);
};

export default AttendanceDisplayGrid;
