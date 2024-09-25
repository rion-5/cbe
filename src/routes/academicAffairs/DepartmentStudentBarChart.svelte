<script lang="ts">
  import { onMount } from "svelte";
  import * as Plot from "@observablehq/plot";
  import "./DepartmentStudentBarChart.css";
  interface DepartmentStudentCounts {
    department: string;
    count: number;
  }

  export let studentCount: DepartmentStudentCounts[] = [];

  let chart: any;

  const createChart = () => {
    const chartContainer = document.getElementById("barchart");

    if (chartContainer) {
      chart = Plot.plot({
        width: 500, // 차트의 너비
        height: 300, // 차트의 높이
        marginBottom: 60, // x 레이블이 잘리지 않도록 하단 여백 추가
        insetLeft: 10, // 좌측 바깥 여백 조정
        insetRight: 50, // 우측 바깥 여백 조정
        marks: [
          Plot.barY(studentCount, {
            x: "department",
            y: "count",
            fill: "steelblue",
            title: (d) => `${d.department}: ${d.count}`,
          }),
          // Text labels on top of bars
          Plot.text(studentCount, {
            x: "department",
            y: (d) => d.count + 20, // Adjust Y position slightly above the bar
            text: (d) => `${d.count}`, // Show the count as the text
            textAnchor: "middle", // Center the text above the bar
            fill: "black",
          }),
        ],
        x: {
          label: "",
          tickRotate: -15,
          tickSize: 5, // 축의 틱 크기 조정
          labelOffset: 10, // 레이블 위치를 조금 아래로 이동
        },
        y: {
          label: "학생 수",
        },
        style: {
          fontFamily: "sans-serif",
          fontSize: "12px",
        },
      });

      chartContainer.innerHTML = ""; // 기존 차트 제거
      chartContainer.appendChild(chart);
    }
  };

  // Use reactive statement to update the chart when studentCount changes
  $: if (studentCount.length > 0) {
    console.log("studentCount updated:", studentCount);
    createChart();
  }
</script>

<div id="barchart"></div>
