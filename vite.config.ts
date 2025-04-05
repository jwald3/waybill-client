import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: process.env.VITE_API_URL || 'http://localhost:8000',
				changeOrigin: true,
				secure: false // Allow self-signed certs if needed
			}
		}
	},

	define: {
		// You can specify different API URLs for development vs production
		'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 
			(process.env.NODE_ENV === 'production' 
				? 'https://getwaybill.com/api/v1' 
				: 'http://localhost:8000/api/v1')
		)
	}
});
