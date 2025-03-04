<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';
  import { colorMode } from '$lib/stores/theme';

  export let data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color: string;
    }[];
  };

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });

  $: if (canvas && data) {
    if (chart) {
      chart.destroy();
    }
    createChart(canvas, data, $colorMode);
  }

  function createChart(canvas: HTMLCanvasElement, data: any, mode: string) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gridColor = mode === 'dark' ? '#334155' : '#e2e8f0';
      const textColor = mode === 'dark' ? '#94a3b8' : '#64748b';

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.color,
            backgroundColor: dataset.color + '20',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: mode === 'dark' ? '#1e293b' : 'white',
            pointBorderWidth: 2,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: gridColor
              },
              ticks: {
                padding: 10,
                maxTicksLimit: 6,
                color: textColor
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                padding: 10,
                color: textColor
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
          }
        }
      };

      chart = new Chart(ctx, config);
    }
  }
</script>

<div class="chart-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style> 