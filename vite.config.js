import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				root: resolve(__dirname, 'index.html'),
				signup: resolve(__dirname, 'signup.html'),
			},
		},
	},
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
});