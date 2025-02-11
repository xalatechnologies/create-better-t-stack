import gradient from "gradient-string";
import { TITLE_TEXT } from "./consts";

const catppuccinTheme = {
	rosewater: "#F5E0DC",
	flamingo: "#F2CDCD",
	pink: "#F5C2E7",
	mauve: "#CBA6F7",
	red: "#F38BA8",
	maroon: "#E78284",
	peach: "#FAB387",
	yellow: "#F9E2AF",
	green: "#A6E3A1",
	teal: "#94E2D5",
	sky: "#89DCEB",
	sapphire: "#74C7EC",
	lavender: "#B4BEFE",
};

export const renderTitle = () => {
	const catppuccinGradient = gradient(Object.values(catppuccinTheme));
	console.log(catppuccinGradient.multiline(TITLE_TEXT));
};
