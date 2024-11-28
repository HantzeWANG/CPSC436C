import React, { useState, useEffect } from "react";
import { listProfiles } from "../services/profilepics";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import AddProfileModal from "./AddProfileModal";
import EditProfileModal from "./EditProfileModal";
import Modal from "@mui/material/Modal";
import {useNavigate} from "react-router-dom";
import AttendanceDisplayGrid from "./AttendanceDisplayGrid";

const API_URL = process.env.REACT_APP_API_URL;

const DashBoard = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const columns = [
        { field: "profile_id", headerName: "ID", width: 120 },
        { field: "profile_name", headerName: "Name", width: 150 },
        {
            field: "profile_image",
            headerName: "Profile Image",
            width: 200,
            renderCell: (params) => (
                <button
                    onClick={() => setPreviewImageUrl(params.value)}
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
            ),
        },
    ];

    const handleSaveProfile = async (updatedProfile) => {
        try {
            const response = await fetch(`${API_URL}/update_profile/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profileID: updatedProfile.profile_id,
                    profileName: updatedProfile.profile_name,
                    profileImageUrl: updatedProfile.profile_image,
                }),
            });
            if (response.ok) {
                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.profile_id === updatedProfile.profile_id ? updatedProfile : file
                    )
                );
                setShowEditModal(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const loadFiles = async () => {
        try {
            const fileList = await listProfiles();

            // Step 1: Deduplicate fileList by profile_id
            const uniqueFiles = fileList.reduce((acc, file) => {
                const profile_id = file.Key.split("/")
                    .pop()
                    .split(".")
                    .slice(0, -1)
                    .join(".")
                    .split("_")
                    .slice(0, -1)
                    .join("_");

                if (!acc.has(profile_id)) {
                    acc.set(profile_id, file);
                }

                return acc;
            }, new Map());

            // Step 2: Fetch profile data for unique profile_ids
            const formattedFiles = await Promise.all(
                Array.from(uniqueFiles.entries()).map(async ([profile_id, file], index) => {
                    const response = await fetch(`${API_URL}/profiles/${profile_id}/`);
                    const profileData = await response.json();

                    return {
                        id: index + 1,
                        profile_id: profile_id,
                        profile_name: profileData[0]?.profile_name || "Unknown",
                        profile_image: profileData[0]?.profile_image || "",
                    };
                })
            );

            // Step 3: Update state with unique profiles
            setFiles(formattedFiles);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                <button
                    onClick={() => setShowEditModal(true)}
                    disabled={!selectedRow}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: selectedRow ? "#007bff" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: selectedRow ? "pointer" : "not-allowed",
                    }}
                >
                    Edit Profile
                </button>
            </div>
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={files}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    onRowClick={(params) => setSelectedRow(params.row)}
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
                <AddProfileModal
                    onClose={() => setShowAddModal(false)}
                    onProfileAdded={() => {
                        loadFiles();
                    }}
                />
            )}
            {showEditModal && (
                <EditProfileModal
                    profile={selectedRow}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveProfile}
                />
            )}
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
			<AttendanceDisplayGrid></AttendanceDisplayGrid>
        </div>
    );
};

export default DashBoard;
