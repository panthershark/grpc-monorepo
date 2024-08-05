import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [preact()],
	server: {
		port: 8081
	},
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	},
	test: {
		globals: true,
		environment: 'happy-dom',
		watch: false,
		mockReset: true,

		css: {
			modules: {
				classNameStrategy: 'non-scoped'
			}
		}
	}
}));
