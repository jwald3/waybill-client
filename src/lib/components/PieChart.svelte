<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';

  export let data: {
    label: string;
    value: number;
    color: string;
  }[];

  let canvas: HTMLCanvasElement;
  let totalValue = data.reduce((sum, item) => sum + item.value, 0);

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const config: ChartConfiguration = {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
            hoverBackgroundColor: data.map(d => d.color + 'ee'),
            borderWidth: 0,
            borderRadius: 4,
            spacing: 2,
            hoverOffset: 5
          }]
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
          cutout: '65%',
          radius: '90%'
        }
      };

      new Chart(ctx, config);
    }
  });
</script>

<div class="chart-wrapper">
  <canvas bind:this={canvas}></canvas>
  <div class="total-indicator">
    <span class="total-label">Total</span>
    <span class="total-value">{totalValue}%</span>
  </div>
</div>

<style>
  .chart-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .total-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .total-label {
    font-size: 0.875rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .total-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
</style> 