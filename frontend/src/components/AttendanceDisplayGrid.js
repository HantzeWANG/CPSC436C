import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';


const AttendanceDisplayGrid = () => {
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

    // Define rows
    const rows = [
        { id: 1, name: 'Alice', userId: 24565, date: 'Dec.18', attendance:"Attended"},
        { id: 2, name: 'Bob', userId: 123456, date: 'Dec.20', attendance:"Attended"},
        { id: 3, name: 'Charlie', userId: 456789, date: 'Dec.18', attendance:"Attended"},
        { id: 4, name: 'David', userId: 281042, date: 'Dec.20',attendance:"Not Attended"},
    ];

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