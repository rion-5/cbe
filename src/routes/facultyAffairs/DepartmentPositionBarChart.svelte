<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";

    interface PositionData {
        position: string;
        count: number;
    }

    interface DepartmentPosition {
        department: string;
        positionData: PositionData[];
    }

    export let departmentPosition: DepartmentPosition[] = [];
    let maxY: number;

    onMount(() => {
        drawAllCharts();
        window.addEventListener("resize", drawAllCharts);
    });

    afterUpdate(() => {
        drawAllCharts();
    });

    function drawAllCharts() {
        maxY =
            d3.max(
                departmentPosition.flatMap((dept) =>
                    dept.positionData.map((d) => d.count),
                ),
            ) || 0;

        departmentPosition.forEach((dept, index) => {
            drawBarChart(
                `#chart-${index}`,
                dept.positionData,
                dept.department,
                index,
            );
        });
    }

    function drawBarChart(
        selector: string,
        positionData: PositionData[],
        department: string,
        deptIndex: number, // 추가된 인덱스 파라미터
    ) {
        // 각 department의 count 합계를 계산
        const totalCount = d3.sum(positionData, (d) => d.count);
        const container = d3.select(selector);
        const element = container.node() as Element;
        const containerWidth = element?.getBoundingClientRect().width || 200;
        const containerHeight = containerWidth;

        // Clear previous chart
        container.selectAll("*").remove();

        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const svg = container
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(positionData.map((d) => d.position))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(0)")
            .style("font-size", `${containerWidth / 25}px`)
            // .style("text-anchor", "end");
            .style("text-anchor", "middle");

        // svg.append("g")
        //     .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(positionData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.position)!)
            .attr("y", (d) => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.count))
            .attr(
                "fill",
                d3.schemeTableau10[deptIndex % d3.schemeTableau10.length],
            );

        svg.selectAll(".label")
            .data(positionData)
            .enter()
            .append("text")
            .text((d) => d.count)
            .attr("x", (d) => x(d.position)! + x.bandwidth() / 2)
            .attr("y", (d) => y(d.count) - 5)
            .attr("text-anchor", "middle")
            .style("font-family", "san-serif")
            .style("font-size", `${containerWidth / 25}px`);
        // .style("font-size", "9px");

        // Add department name at the top
        const topText = svg
            .append("text")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold");

        topText
            .append("tspan")
            .attr("x", width / 2)
            .attr("y", -10)
            .text(department);

        topText
            .append("tspan")
            .attr("x", width / 2)
            .attr("dy", "1.5em")
            .text(`${totalCount} 명`)
            .style("font-size", "12px"); // department 이름 아래에 위치

        // // 라운드형 박스 추가
        // svg.append("rect")
        //     .attr("x", -margin.left) // 전체 SVG의 시작점으로 설정
        //     .attr("y", -margin.top) // 위쪽 마진까지 포함
        //     .attr("width", containerWidth) // 전체 너비
        //     .attr("height", containerHeight) // 전체 높이
        //     .attr("rx", 15) // 모서리를 둥글게 (15px 반경)
        //     .attr("ry", 15) // 모서리를 둥글게 (15px 반경)
        //     .attr("fill", "rgba(255, 182, 193, 0.2)"); // 연한 핑크 (투명도 0.2)
    }
</script>

<div class="grid-container">
    {#each departmentPosition as dept, index}
        <div class="chart-container">
            <div id={"chart-" + index}></div>
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

    .chart-container {
        width: 100%;
        height: 300px;
        padding-bottom: 70%; /* Maintain aspect ratio for the chart */
        position: relative;
    }
    .chart-container {
    border-radius: 15px;  /* 컨테이너 자체에도 라운드형 모양 추가 */
    background-color: rgba(173, 216, 230, 0.2);  /* 연한 하늘색 백그라운드 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  /* 박스에 그림자 추가 */
    padding: 20px;  /* 여백 추가 */
}

    .chart-container > div {
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
