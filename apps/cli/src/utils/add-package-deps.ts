import path from "node:path";
import fs from "fs-extra";

import { type AvailableDependencies, dependencyVersionMap } from "../constants";

export const addPackageDependency = (opts: {
	dependencies?: AvailableDependencies[];
	devDependencies?: AvailableDependencies[];
	projectDir: string;
}) => {
	const { dependencies = [], devDependencies = [], projectDir } = opts;

	const pkgJsonPath = path.join(projectDir, "package.json");
	const pkgJson = fs.readJSONSync(pkgJsonPath);

	if (!pkgJson.dependencies) pkgJson.dependencies = {};
	if (!pkgJson.devDependencies) pkgJson.devDependencies = {};

	for (const pkgName of dependencies) {
		const version = dependencyVersionMap[pkgName];
		pkgJson.dependencies[pkgName] = version;
	}

	for (const pkgName of devDependencies) {
		const version = dependencyVersionMap[pkgName];
		pkgJson.devDependencies[pkgName] = version;
	}

	fs.writeJSONSync(pkgJsonPath, pkgJson, {
		spaces: 2,
	});
};
