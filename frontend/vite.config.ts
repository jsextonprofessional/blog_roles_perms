import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		proxy: {
			'/api/': {
				target: 'http://localhost:4000/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/auth/, '')
			}
		}
	}
});
