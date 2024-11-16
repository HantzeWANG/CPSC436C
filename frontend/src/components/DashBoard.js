import React, { useState, useEffect } from "react";
import { listUserFiles } from "../services/profilepics";

const DashBoard = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadFiles = async () => {
			try {
				const fileList = await listUserFiles();
				setFiles(fileList);
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
			<h2>Your Files</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Last Modified</th>
						<th>Size</th>
					</tr>
				</thead>
				<tbody>
					{files.map((file) => (
						<tr key={file.Key}>
							<td>{file.Key.split("/").pop()}</td>
							<td>{new Date(file.LastModified).toLocaleString()}</td>
							<td>{Math.round(file.Size / 1024)} KB</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DashBoard;
