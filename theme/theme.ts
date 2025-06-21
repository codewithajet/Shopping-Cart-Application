// theme/theme.ts

export type Theme = {
  background: string;
  text: string;
  headerGradient: [string, string];
};

export const LightTheme: Theme = {
  background: "#ffffff",
  text: "#1f2937",
  headerGradient: ["#667eea", "#764ba2"],
};

export const DarkTheme: Theme = {
  background: "#111827",
  text: "#f9fafb",
  headerGradient: ["#374151", "#1f2937"],
};
