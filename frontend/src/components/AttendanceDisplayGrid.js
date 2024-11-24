import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {useEffect, useState} from "react";

const AttendanceDisplayGrid = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'userId',
            headerName: 'User ID',
            width: 110,
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 200,
        },
        {
            field: 'attendance',
            headerName: 'Attendance',
            width: 200,
            editable: true,
        },
    ];

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch('http://localhost:3000/attendanceData')
            .then(response => response.json())
            .then(data => {
                setRows(data)
            })
            .catch(error => {
                setError(error);  // Handle errors
            });
    }, []);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                    boxShadow: 2,
                    border: 1,
                    borderColor: 'grey.400',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                }}
            />
        </Box>
    );
};

export default AttendanceDisplayGrid;