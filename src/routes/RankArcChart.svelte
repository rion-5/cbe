<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";
    import "./DepartmentCountsBarChart.css";

    export let rankEconomics: { rank: string; count: number }[];
    // export let rankBusiness: { rank: string; count: number }[];
    onMount(() => {
        drawArc();
    });
    afterUpdate(() => {
        drawArc();
    });
    function drawArc() {
        const pieChartWidth = 300;
        const pieChartHeight = 300;
        const svg = d3
            .select("#arc")
            .append("svg")
            .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight]);

        const innerChart = svg
            .append("g")
            .attr(
                "transform",
                `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`,
            );

        const numberOfDays = rankEconomics.length;
        const numberOfDaysWithPrecipitations = rankEconomics.filter(
            (d) => d.count > 0,
        ).length;
        const percentageDaysWithPrecipitations = Math.round(
            (numberOfDaysWithPrecipitations / numberOfDays) * 100,
        );

        const angleDaysWithPrecipitations_deg =
            (percentageDaysWithPrecipitations * 360) / 100;
        const angleDaysWithPrecipitations_rad =
            (angleDaysWithPrecipitations_deg * Math.PI) / 180;

        const arcGenerator = d3
            .arc()
            .innerRadius(80)
            .outerRadius(120)
            .padAngle(0.02)
            .cornerRadius(6);

        innerChart
            .append("path")
            .attr(
                "d",
                arcGenerator({
                    innerRadius: 80,
                    outerRadius: 120,
                    startAngle: 0,
                    endAngle: angleDaysWithPrecipitations_rad,
                }),
            )
            .attr("fill", "#6EB7C2");

        innerChart
            .append("path")
            .attr(
                "d",
                arcGenerator({
                    innerRadius: 80,
                    outerRadius: 120,
                    startAngle: angleDaysWithPrecipitations_rad,
                    endAngle: 2 * Math.PI,
                }),
            )
            .attr("fill", "#DCE2E2");

        const centroid = arcGenerator.centroid({
            innerRadius: 80,
            outerRadius: 120,
            startAngle: 0,
            endAngle: angleDaysWithPrecipitations_rad,
        });

        innerChart
            .append("text")
            .text((d) =>
                d3.format(".0%")(percentageDaysWithPrecipitations / 100),
            )
            .attr("x", centroid[0])
            .attr("y", centroid[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "white")
            .style("font-weight", 500);
    }
</script>

<div id="arc" style="width: 400px; height: 400px;"></div>
