<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import ThemeProvider from '$lib/components/ThemeProvider.svelte';
	let { children } = $props();
</script>

<ThemeProvider>
	<div data-theme={$theme}>
		{@render children()}
	</div>
</ThemeProvider>
