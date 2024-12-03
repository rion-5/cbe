<script lang="ts">
  import { onMount } from "svelte";
  import * as Plot from "@observablehq/plot";
  interface NationalityCounts {
    nationality: string;
    count: number;
  }

  // export let studentCount: NationalityCounts[] = [];
  export let studentCount: {
    nationality: string;
    count: number;
  }[];
  export let chartId: string; // Add unique ID prop
  let chart: HTMLElement;

  $: {
    if (chart) {
      // Clear previous chart if exists
      while (chart.firstChild) {
        chart.firstChild.remove();
      }
      
      // Create new plot
      const plotElement = Plot.plot({
        width: 500,
        height: 300,
        marginBottom: 60,
        insetLeft: 10,
        insetRight: 50,
        marks: [
          Plot.barY(studentCount, {
            x: "nationality",
            y: "count",
            fill: "orange",
            title: (d) => `${d.nationality}: ${d.count}`,
          }),
          Plot.text(studentCount, {
            x: "nationality",
            y: (d) => d.count + 20,
            text: (d) => `${d.count}`,
            textAnchor: "middle",
            fill: "black",
          }),
        ],
        x: {
          label: chartId,
          tickRotate: -15,
          tickSize: 5,
          labelOffset: 55,
        },
        y: {
          label: "학생 수",
        },
        style: {
          fontFamily: "sans-serif",
          fontSize: "12px",
        }
      });
      
      chart.appendChild(plotElement);
    }
  }
</script>

<div bind:this={chart} id={chartId} />

<style>
  div {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
</style>
