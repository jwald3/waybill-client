<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';
  import { colorMode } from '$lib/stores/theme';

  export let data: {
    label: string;
    value: number;
    color: string;
  }[];

  let canvas: HTMLCanvasElement;
  let totalValue = data.reduce((sum, item) => sum + item.value, 0);

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
              display: false,
              labels: {
                color: mode === 'dark' ? '#94a3b8' : '#64748b'
              }
            }
          },
          cutout: '65%',
          radius: '90%'
        }
      };

      chart = new Chart(ctx, config);
    }
  }
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
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .total-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }
</style> 