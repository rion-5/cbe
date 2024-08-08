<!-- src/lib/DepartmentCounts.svelte -->
<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    import './DepartmentCounts.css';
    export let departmentCounts: { department: string, count: number }[];

    let svg: SVGSVGElement | null = null;

    onMount(() => {
        drawChart();
    });

    afterUpdate(() => {
        drawChart();
    });

    function drawChart() {
        // svg가 null이면 함수를 종료합니다.
        if (!svg) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        // Remove existing SVG elements before drawing new ones
        d3.select(svg).selectAll("*").remove();
        
        const chart = d3.select(svg)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(departmentCounts.map(d => d.department))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(departmentCounts, d => d.count) || 0])
            .nice()
            .range([height, 0]);

        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        chart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        chart.selectAll(".bar")
            .data(departmentCounts)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.department)!)
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count))
            .attr("fill", "steelblue");
    }
</script>

<svg bind:this={svg}></svg>
<div id="bar-chart" style="width: 100%; height: 400px;"></div>