import path from "node:path";
import fs from "fs-extra";

import { type AvailableDependencies, dependencyVersionMap } from "../constants";

export const addPackageDependency = (opts: {
	dependencies: AvailableDependencies[];
	devDependencies: boolean;
	projectDir: string;
}) => {
	const { dependencies, devDependencies, projectDir } = opts;

	const pkgJson = fs.readJSONSync(path.join(projectDir, "package.json"));

	for (const pkgName of dependencies) {
		const version = dependencyVersionMap[pkgName];

		if (devDependencies && pkgJson.devDependencies) {
			pkgJson.devDependencies[pkgName] = version;
		} else if (pkgJson.dependencies) {
			pkgJson.dependencies[pkgName] = version;
		}
	}

	fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
		spaces: 2,
	});
};
