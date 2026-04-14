import { Button } from "react-bootstrap";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      className="theme-toggle d-flex align-items-center gap-2"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </Button>
  );
};

export default ThemeToggle;
