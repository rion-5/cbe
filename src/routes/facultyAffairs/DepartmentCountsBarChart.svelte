<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";
    // import './DepartmentCountsBarChart.css';

    export let departmentCounts: { department: string; count: number }[];

    onMount(() => {
        drawChart();
    });

    afterUpdate(() => {
        drawChart();
    });

    function drawChart() {
        const margin = { top: 40, right: 30, bottom: 70, left: 40 };
        const width = 300;
        const height = 300;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Remove existing SVG elements before drawing new ones
        d3.select("#bar-chart").selectAll("*").remove();

        const chart = d3
            .select("#bar-chart")
            .append("svg")
            .attr("viewBox", `0, 0, ${width}, ${height}`)
            .attr("width", width) //viewport
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        const x = d3
            .scaleBand()
            .domain(departmentCounts.map((d) => d.department))
            .range([0, innerWidth])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(departmentCounts, (d) => d.count) || 0])
            .nice()
            .range([innerHeight, 0]);

        // chart.append('g')
        //     .attr('class', 'x-axis')
        //     .attr('transform', `translate(0,${innerHeight})`)
        //     .call(d3.axisBottom(x));

        chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-45)");

        chart.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

        chart
            .selectAll(".bar")
            .data(departmentCounts)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.department)!)
            .attr("y", (d) => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", (d) => innerHeight - y(d.count))
            .attr("fill", "steelblue");

        chart
            .selectAll(".label")
            .data(departmentCounts)
            .enter()
            .append("text")
            .text((d) => d.count)
            .attr("x", (d) => x(d.department)! + x.bandwidth() / 2)
            .attr("y", (d) => y(d.count) - 5)
            .attr("text-anchor", "middle")
            .style("font-family", "san-serif")
            .style("font-size", "9px");
    }
</script>

<!-- <div id='bar-chart' style='width: 100%; height: 400px;'></div> -->
<div id="bar-chart"></div>
