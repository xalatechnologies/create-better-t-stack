import { $ } from "execa";

export async function isTursoInstalled() {
	try {
		await $`turso --version`;
		return true;
	} catch {
		return false;
	}
}

export async function isTursoLoggedIn() {
	try {
		const output = await $`turso auth whoami`;
		return !output.stdout.includes("You are not logged in");
	} catch {
		return false;
	}
}
