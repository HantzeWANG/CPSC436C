import * as React from 'react';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {useEffect, useState} from "react";

const AttendanceDisplayGrid = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'profile',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'photo_url',
            headerName: 'Photo URL',
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
        fetch('http://127.0.0.1:8000/api/attendance/')
            .then(response => response.json())
            .then(data => {
                const processedData = processData(data);
                const groupedData = groupByDate(processedData);
                setRows(groupedData);
            })
            .catch(error => {
                setError(error);  // Handle errors
            });
    }, []);

    function processData(data) {
        return data.map(item => {
                const timestamp = new Date(item.timestamp);
                const date = timestamp.getDate();
                const month = timestamp.getMonth() + 1;
                const year = timestamp.getFullYear();

                return {
                    id: item.id,
                    profile: item.profile,
                    date: date,
                    month: month,
                    year: year,
                    photo_url: item.photo_url,
                }

        })
    }

    const groupByDate = (data) => {
        return data.reduce((acc, item) => {
            const dateKey = `${item.year}-${item.month}-${item.date}`;

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);

            return acc;
        }, {});
    };


    return (
        <Box sx={{height: 400, width: '100%'}}>
            {Object.keys(rows).map((dateKey) => {
                const tableRows = rows[dateKey];
                const [year, month, day] = dateKey.split('-');
                return (
                    <div key={dateKey} style={{ marginBottom: '20px' }}>
                        <h2>{`Date: ${month}-${day}-${year}`}</h2>
                    <DataGrid
                        rows={tableRows}
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
                    </div>
                );
            })}
        </Box>
    );
};

export default AttendanceDisplayGrid;