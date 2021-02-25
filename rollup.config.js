import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import workbox from 'rollup-plugin-workbox';
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [{
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}, {
	input: "src/service-worker.js",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/build/service-worker.js"
	},
	plugins: [
		resolve({
			browser: true
		}),
		// Generates the file list to precache in service worker
		workbox.injectManifest({
			swDest: "./public/build/service-worker.js",
			swSrc: "./public/build/service-worker.js",
			globDirectory: "./public",
//			navigateFallback: "/",
//			directoryIndex: "index.html",
			globPatterns: [
				"**.{js,css,html,png,json,woff2,wav,m4a,webp}",
				"**/*.{js,css,html,png,json,woff2,wav,m4a,webp}",
			],
			manifestTransforms: [
				manifestEntries => {
					const manifest = manifestEntries.map(entry => {
						entry.url = "/" + entry.url;
						return entry;
					});
				  	return {manifest, warnings: []};
				}
			],
			mode: production ? "production" : "development"
		}, function render({ swDest, count, size }) {
			console.log(
			  'Service worker',
			  '#️⃣', count, "files",
			  '🐘', size, "bytes"
			);
		}),
		replace({
			values: {
				'process.env.NODE_ENV': production ? "\"production\"" : "\"development\""
			},
			preventAssignment: true
		})
	]
}];
