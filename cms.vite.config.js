import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Determine the correct output directory.
// We want to output to the project's public/admin directory.
// If this vite.config.js is in src/components/admin-cms,
// then the relative path to project root is ../../../, and then public/admin.
// However, Vite calculates outDir relative to the project root where vite is run,
// usually the current working directory of the command.
// For a standalone build, we might run `vite build` from src/components/admin-cms.
// Let's assume the build command will be run from the project root,
// so outDir should be relative to project root.

// The `package.json` for the main project is at the root.
// We will add a script like `npm run build:cms --prefix src/components/admin-cms`
// or `vite build --config src/components/admin-cms/vite.config.js` from root.
// If `--config` is used from root, outDir needs to be absolute or relative to root.

// Let's specify the path relative to the project root.
// The project root is `/storage/emulated/0/Documents/astro-blogobs`.
// The target directory is `/storage/emulated/0/Documents/astro-blogobs/public/admin`.

// If we run `vite build` from the project root:
const OUTPUT_DIR_RELATIVE_TO_PROJECT_ROOT = 'public/admin';

export default defineConfig({
  plugins: [svelte()],
  publicDir: false,
  build: {
    outDir: OUTPUT_DIR_RELATIVE_TO_PROJECT_ROOT,
    emptyOutDir: false, // Do not empty the entire public/admin, as it contains other files (index.html, cms.css)
    lib: {
      entry: './src/components/admin-cms/main.js',
      name: 'CmsSvelteApp', // A global variable name for the IIFE format
      formats: ['iife'], // Build as an Immediately Invoked Function Expression
      fileName: () => 'cms-svelte-bundle.js'
    },
    rollupOptions: {
      // Ensure that `cms.css` is copied over. If it's a static asset.
      // Or we can let Svelte components import their own CSS.
      // For now, let's assume cms.css is handled manually by being in public/admin.
    }
  }
});
