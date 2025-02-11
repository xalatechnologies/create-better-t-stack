import gradient from "gradient-string";
import { TITLE_TEXT } from "./consts";

const betterTTheme = {
  primary: "#4F46E5",
  secondary: "#06B6D4",
  accent: "#3B82F6",
  highlight: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
};

export const renderTitle = () => {
  const betterTGradient = gradient(Object.values(betterTTheme));

  console.log(betterTGradient.multiline(TITLE_TEXT));
};
