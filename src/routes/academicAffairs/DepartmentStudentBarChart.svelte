<script lang="ts">
    import { onMount } from "svelte";
    import * as Plot from "@observablehq/plot";
  
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
          marks: [
            Plot.barY(studentCount, {
              x: "department",
              y: "count",
              fill: "steelblue",
              title: (d) => `${d.department}: ${d.count}`,
            }),
          ],
          x: {
            label: "학과",
            tickRotate: -45,
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
  