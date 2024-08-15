<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";
    interface ProfessorRank {
        rank: string;
        count: number;
    }

    interface DepartmentRank {
        department: string;
        rankData: ProfessorRank[];
    }

    export let departmentRank: DepartmentRank[] = [];

    onMount(() => {
        drawAllArcs();
        window.addEventListener("resize", drawAllArcs);
    });

    afterUpdate(() => {
        drawAllArcs();
    });

    function drawAllArcs() {
        departmentRank.forEach((dept, index) => {
            drawArc(`#arc-${index}`, dept.rankData, dept.department);
        });
    }

    function drawArc(
        selector: string,
        rankData: ProfessorRank[],
        department: string,
    ) {
        const container = d3.select(selector);
        const element = container.node() as Element; // Assert that node is an Element
        const containerWidth = element?.getBoundingClientRect().width || 200;
        const pieChartWidth = containerWidth;
        const pieChartHeight = containerWidth;

        // Clear previous chart
        container.selectAll("*").remove();

        // Generate pie data
        const pieGenerator = d3.pie<ProfessorRank>().value((d) => d.count);
        const annotatedData = pieGenerator(rankData);

        // Create the SVG element
        const svg = container
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
        const arcGenerator = d3
            .arc<d3.PieArcDatum<ProfessorRank>>()
            .innerRadius(pieChartWidth / 4)
            .outerRadius(pieChartWidth / 2)
            .padAngle(0.02)
            .cornerRadius(3);

        // Bind data and create arcs
        innerChart
            .selectAll("path")
            .data(annotatedData)
            .enter()
            .append("path")
            .attr("d", arcGenerator)
            .attr("fill", (d, i) => d3.schemeTableau10[i]);

        // Add text labels to arcs
        innerChart
            .selectAll("text")
            .data(annotatedData)
            .enter()
            .append("text")
            .attr("x", (d) => arcGenerator.centroid(d)[0])
            .attr("y", (d) => arcGenerator.centroid(d)[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "white")
            .style("font-weight", 1000)
            .style("font-size", `${pieChartWidth / 20}px`)
            .each(function (d) {
                const text = d3.select(this);
                // Append rank text
                text.append("tspan")
                    .text(d.data.rank + d.data.count)
                    .attr("x", arcGenerator.centroid(d)[0])
                    .attr("dy", 0); // Position at the initial location
                // Append percentage text
                text.append("tspan")
                    .text(
                        d3.format(".1%")(
                            d.data.count / d3.sum(rankData, (d) => d.count),
                        ),
                    )
                    .attr("x", arcGenerator.centroid(d)[0])
                    .attr("dy", "1.2em"); // Move the percentage below the rank
            });
        // Add department name in the center of the chart
        innerChart
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .style("font-weight", "bold")
            .style("font-size", `${pieChartWidth / 12}px`)
            .text(department);
    }
</script>

<div class="grid-container">
    {#each departmentRank as dept, index}
        <div class="arc-container">
            <div id={"arc-" + index}></div>
        </div>
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .arc-container {
        width: 100%;
        height: 0;
        padding-bottom: 100%; /* Maintain a square aspect ratio */
        position: relative;
    }

    .arc-container > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 600px) {
        .grid-container {
            grid-template-columns: 1fr;
        }
    }
</style>
