import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	clean: true,
	dts: true,
	shims: true,
	minify: true,
	splitting: false,
	outDir: "dist",
	banner: {
		js: "#!/usr/bin/env node",
	},
});
