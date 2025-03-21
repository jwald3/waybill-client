<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';
  import { colorMode } from '$lib/stores/theme';

  export let data: Array<{
    label: string;
    value: number;
    color: string;
  }>;

  // Add props for center label customization
  export let centerLabel: string | undefined = undefined;
  export let centerValue: string | number | undefined = undefined;

  let canvas: HTMLCanvasElement;
  let total = data.reduce((sum, item) => sum + item.value, 0);
  let availablePercentage = total > 0 
    ? Math.round((data.find(d => d.label === 'Available')?.value || 0) / total * 100)
    : 0;

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
          labels: data.map((d: {label: string}) => d.label),
          datasets: [{
            data: data.map((d: {value: number}) => d.value),
            backgroundColor: data.map((d: {color: string}) => d.color),
            hoverBackgroundColor: data.map((d: {color: string}) => d.color + 'ee'),
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
          // @ts-ignore
          cutout: '65%',
          // @ts-ignore
          radius: '90%'
        }
      };

      chart = new Chart(ctx, config);
    }
  }
</script>

<div class="pie-chart">
  <canvas bind:this={canvas}></canvas>
  {#if centerLabel !== undefined && centerValue !== undefined}
    <div class="center-label">
      <span class="percentage">{centerValue}</span>
      <span class="label">{centerLabel}</span>
    </div>
  {/if}
</div>

<style>
  .pie-chart {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .center-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .percentage {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style> 