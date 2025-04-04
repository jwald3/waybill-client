import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'http://45.79.191.179:8000',
				changeOrigin: true,
				secure: false,
			},
		},
	},

	define: {
		// You can specify different API URLs for development vs production
		'import.meta.env.VITE_API_URL': JSON.stringify(process.env.NODE_ENV === 'production' 
		  ? 'http://45.79.191.179:8000/api/v1' 
		  : 'http://45.79.191.179:8000/api/v1')
	  }
});
