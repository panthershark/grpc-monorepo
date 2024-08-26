import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({}) => ({
	plugins: [preact()],
	test: {
		globals: true,
		environment: 'happy-dom',
		watch: false,
		mockReset: true
	}
}));
