const sharedColors = {
  success: "#22C55E",
  destructive: "#DC2626",
  border: "#D1D5DB",
} as const;

export const lightTheme = {
  colors: {
    ...sharedColors,
    typography: "#000000",
    background: "#ffffff",
    primary: "#3B82F6",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

export const darkTheme = {
  colors: {
    ...sharedColors,
    typography: "#ffffff",
    background: "#000000",
    primary: "#60A5FA",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;
