import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';


const BarChart = ({data}) => {
    const svgRef = useRef();
    const width = 400;
    const height = 200;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        // Clear previous elements
        svg.selectAll('*').remove();

        // Draw bars
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.value))
            .attr('fill', 'steelblue');

        // Add Axes
        const xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .call(yAxis);

    }, [data]);

    return <svg ref={svgRef} width={400} height={200}></svg>;
};

export default BarChart;
