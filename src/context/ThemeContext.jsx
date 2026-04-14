import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("tourista-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tourista-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
