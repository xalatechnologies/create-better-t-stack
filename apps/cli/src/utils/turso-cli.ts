import { execa } from "execa";

export async function isTursoInstalled() {
	try {
		await execa("turso", ["--version"]);
		return true;
	} catch {
		return false;
	}
}

export async function isTursoLoggedIn() {
	try {
		const output = await execa("turso", ["auth", "whoami"]);
		console.log(output.stdout.includes("You are not logged in"));
		return !output.stdout.includes("You are not logged in");
	} catch {
		return false;
	}
}
