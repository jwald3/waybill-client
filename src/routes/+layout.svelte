<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import ThemeProvider from '$lib/components/ThemeProvider.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let { data, children } = $props();
	
	onMount(() => {
		if (!data.token && !window.location.pathname.includes('/login')) {
			goto('/login');
		}
	});
</script>

<ThemeProvider>
	<div data-theme={$theme}>
		{@render children()}
	</div>
</ThemeProvider>
