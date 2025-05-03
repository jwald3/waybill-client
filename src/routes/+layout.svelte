<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import ThemeProvider from '$lib/components/ThemeProvider.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let { data, children } = $props();
	
	onMount(() => {
		const publicPaths = ['/login', '/register'];
		const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));
		if (!data.token && !isPublicPath) {
			goto('/login');
		}
	});
</script>

<ThemeProvider>
	<div data-theme={$theme}>
		{@render children()}
	</div>
</ThemeProvider>