import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../consts";

export const getVersion = () => {
	const packageJsonPath = path.join(PKG_ROOT, "package.json");

	const packageJsonContent = fs.readJSONSync(packageJsonPath);

	return packageJsonContent.version ?? "1.0.0";
};
