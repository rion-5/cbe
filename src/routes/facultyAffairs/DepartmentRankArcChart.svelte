<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";

    interface RankData {
        rank: string;
        count: number;
    }

    interface DepartmentRank {
        department: string;
        rankData: RankData[];
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
        rankData: RankData[],
        department: string,
    ) {
        const rankOrder = ["교수", "부교수", "조교수"];
        const colorMap = {
            교수: "#1f77b4", // 예: 파란색
            부교수: "#ff7f0e", // 예: 주황색
            조교수: "#2ca02c", // 예: 녹색
        };

        rankData.sort((a, b) => {
            return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
        });

        // 각 department의 count 합계를 계산
        const totalCount = d3.sum(rankData, (d) => d.count);

        const container = d3.select(selector);
        const element = container.node() as Element;
        const containerWidth = element?.getBoundingClientRect().width || 200;
        const pieChartWidth = containerWidth; // 차트 크기를 줄임
        const pieChartHeight = pieChartWidth; // 차트 높이도 동일하게 줄임

        // Clear previous chart
        container.selectAll("*").remove();

        const pieGenerator = d3
            .pie<RankData>()
            .value((d) => d.count)
            .sort(null)
            .startAngle(0);
        const annotatedData = pieGenerator(rankData);

        const svg = container
            .append("svg")
            .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight + 60}`); // 추가 공간 확보

        const innerChart = svg
            .append("g")
            .attr(
                "transform",
                `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`,
            );

        const arcGenerator = d3
            .arc<d3.PieArcDatum<RankData>>()
            .innerRadius(pieChartWidth / 4.5)
            .outerRadius(pieChartWidth / 2.5)
            .padAngle(0.02)
            .cornerRadius(3);

        innerChart
            .selectAll("path")
            .data(annotatedData)
            .enter()
            .append("path")
            .attr("d", arcGenerator)
            // .attr("fill", (d) => colorMap[d.data.rank as keyof typeof colorMap]);
            .attr("fill", (d, i) => d3.schemeTableau10[i]);

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
            .style("font-size", `${pieChartWidth / 28}px`)
            .each(function (d) {
                const text = d3.select(this);
                text.append("tspan")
                    .text(d.data.rank)
                    .attr("x", arcGenerator.centroid(d)[0])
                    .attr("dy", 0);
                text.append("tspan")
                    .text(
                        d.data.count,
                        // d3.format(".1%")(
                        //     d.data.count / d3.sum(rankData, (d) => d.count),
                        // ),
                    )
                    .attr("x", arcGenerator.centroid(d)[0])
                    .attr("dy", "1.2em");
            });

        // innerChart
        //     .append("text")
        //     .attr("text-anchor", "middle")
        //     .attr("dominant-baseline", "middle")
        //     .attr("fill", "black")
        //     .style("font-weight", "bold")
        //     .style("font-size", `${pieChartWidth / 20}px`)
        //     .text(department);

        // Department 이름과 totalCount를 차트 중앙에 추가
        const centerText = innerChart
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .style("font-weight", "bold")
            .style("font-size", `${pieChartWidth / 20}px`);

        centerText.append("tspan").text(department).attr("x", 0).attr("dy", 0); // 위치 설정

        centerText
            .append("tspan")
            .text(`${totalCount}`)
            .attr("x", 0)
            .attr("dy", "1.5em"); // department 이름 아래에 위치

        // // 범례 추가
        // const legend = svg
        //     .append("g")
        //     .attr("transform", `translate(${pieChartWidth / 4}, ${pieChartHeight + 10})`)
        //     .attr("class", "legend");

        // rankOrder.forEach((rank, i) => {
        //     const legendRow = legend
        //         .append("g")
        //         .attr("transform", `translate(${i * (pieChartWidth / 3)}, 0)`);

        //     legendRow
        //         .append("rect")
        //         .attr("width", 18)
        //         .attr("height", 18)
        //         .attr("fill", colorMap[rank as keyof typeof colorMap]);

        //     legendRow
        //         .append("text")
        //         .attr("x", 24)
        //         .attr("y", 9)
        //         .attr("dy", "0.35em")
        //         .text(rank)
        //         .style("font-size", "12px")
        //         .attr("fill", "black");
        // });
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
