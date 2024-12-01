import React from 'react';
import BarChart from './BarChart';

const Analysis = () => {
    const data = [
        { label: 'A', value: 30 },
        { label: 'B', value: 80 },
        { label: 'C', value: 45 },
        { label: 'D', value: 60 },
    ];

    return (
        <div>
            <h1>Bar Chart Example</h1>
            <BarChart data={data} />
        </div>
    );
};

export default Analysis;