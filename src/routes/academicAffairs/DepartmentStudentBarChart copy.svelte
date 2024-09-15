<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import * as Plot from "@observablehq/plot";
    import { draw } from "svelte/transition";

    interface DepartmentStudentCounts {
        department: string;
        count: number;
    }
    export let studentCount: DepartmentStudentCounts[] = [];
    console.log(JSON.stringify(studentCount, null, 2));

    // API로 받은 데이터
    const data = [
        { department: "경제학부", count: 383 },
        { department: "경영학부", count: 850 },
        { department: "보험계리학과", count: 88 },
        { department: "회계세무학과", count: 240 },
    ];

    let chartElement: HTMLElement | null;

    // 차트를 그리는 함수
    onMount(() => {
        drawBarChart();
        window.addEventListener("resize", drawBarChart);
    });

    // afterUpdate(() => {
    //     drawBarChart();
    // });

    function drawBarChart(){
        const chart = Plot.plot({
            marks: [
                Plot.barY(data, {
                    x: "department",
                    y: "count",
                    fill: "steelblue",
                    title: (d) => `${d.department}: ${d.count}`, // 툴팁 표시
                }),
            ],
            x: {
                label: "학과",
                tickRotate: -45, // X축 레이블 각도 조정
            },
            y: {
                label: "학생 수",
            },
            style: {
                fontFamily: "sans-serif",
                fontSize: "12px",
            },
        });

        // DOM에 차트 삽입
        if (chartElement) {
            chartElement.appendChild(chart);
        }
    }
</script>

<div bind:this={chartElement}></div>
