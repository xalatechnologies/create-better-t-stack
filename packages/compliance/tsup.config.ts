import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	splitting: false,
	minify: false,
	external: ["@xaheen/core"],
	target: "es2022",
	outDir: "dist",
});
