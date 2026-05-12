"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  blue: { primary: "#2563EB", ring: "#3B82F6" },
  indigo: { primary: "#4F46E5", ring: "#6366F1" },
  violet: { primary: "#7C3AED", ring: "#8B5CF6" },
  emerald: { primary: "#059669", ring: "#10B981" },
  rose: { primary: "#E11D48", ring: "#FB7185" },
};

export const fonts = {
  inter: "var(--font-inter)",
  outfit: "var(--font-outfit)",
  roboto: "var(--font-roboto)",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("blue");
  const [mode, setMode] = useState("light");
  const [font, setFont] = useState("inter");

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem("app-theme") || "blue";
    const savedMode = localStorage.getItem("app-mode") || "light";
    const savedFont = localStorage.getItem("app-font") || "inter";
    
    setTheme(savedTheme);
    setMode(savedMode);
    setFont(savedFont);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply Mode
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply Colors
    const colors = themes[theme] || themes.blue;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);

    // Apply Font
    root.style.setProperty("--font-family", fonts[font] || fonts.inter);

    // Save
    localStorage.setItem("app-theme", theme);
    localStorage.setItem("app-mode", mode);
    localStorage.setItem("app-font", font);
  }, [theme, mode, font]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
