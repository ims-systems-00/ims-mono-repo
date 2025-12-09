import { defineConfig, transformWithEsbuild, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import sass from "sass";
import path from "path";
import { createRequire } from "module";
import { viteStaticCopy } from "vite-plugin-static-copy";
const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"));
// console.log(process.env);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;
        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: cMapsDir,
          dest: "",
        },
      ],
    }),
    react(),
  ],

  define: {
    "process.env": JSON.stringify(process.env),
    global: "window",
    // "process.platform": ,
  },

  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        silenceDeprecations: ["legacy-js-api"],
        quietDeps: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: /^~(.+)/,
        replacement: path.resolve(__dirname, "node_modules/$1"),
      }
    ],
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
    exclude: ["pdfjs-dist"],
  },
});
