<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";
    import "./DepartmentCountsBarChart.css";
    
    interface ProfessorRank {
        rank: string;
        count: number;
    }
    export let rankEconomics: ProfessorRank[];

    onMount(() => {
        drawArc();
    });
    afterUpdate(() => {
        drawArc();
    });

    function drawArc() {
        const pieChartWidth = 200;
        const pieChartHeight = 200;

        // Clear previous chart
        d3.select('#arc').selectAll('*').remove();

        // Generate pie data
        const pieGenerator = d3.pie<ProfessorRank>()
            .value(d => d.count);
        const annotatedData = pieGenerator(rankEconomics);

        // Create the SVG element
        const svg = d3
            .select("#arc")
            .append("svg")
            .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight}`);

        // Create a group to center the pie chart
        const innerChart = svg
            .append("g")
            .attr(
                "transform",
                `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`,
            );

        // Define arc generator
        const arcGenerator = d3.arc<d3.PieArcDatum<ProfessorRank>>()
            .innerRadius(60)
            .outerRadius(100)
            .padAngle(0.02)
            .cornerRadius(3);

        // Bind data and create arcs
        innerChart
            .selectAll('path')
            .data(annotatedData)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => d3.schemeTableau10[i]);

        // Add text labels to arcs
        innerChart
            .selectAll('text')
            .data(annotatedData)
            .enter()
            .append('text')
            .attr('x', d => arcGenerator.centroid(d)[0])
            .attr('y', d => arcGenerator.centroid(d)[1])
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .style('font-weight', 1000)
            .style('font-size', '10px')
            .each(function(d) {
                const text = d3.select(this);
                // Append rank text
                text.append('tspan')
                    .text(d.data.rank)
                    .attr('x', arcGenerator.centroid(d)[0])
                    .attr('dy', 0); // Position at the initial location
                // Append percentage text
                text.append('tspan')
                    .text(d3.format(".1%")(d.data.count / d3.sum(rankEconomics, d => d.count)))
                    .attr('x', arcGenerator.centroid(d)[0])
                    .attr('dy', '1.2em'); // Move the percentage below the rank
            });
    }
</script>

<div id="arc" style="width: 200px; height: 200px;"></div>
