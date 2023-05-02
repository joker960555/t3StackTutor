import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import cn from "classnames";

export const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  // enable theme when mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
      className={cn(
        "h-full w-full text-lg font-medium text-slate-200 transition-all hover:text-slate-400 dark:text-slate-300"
      )}
    >
      {currentTheme === "dark" ? "Light" : "Dark"}
    </button>
  );
};
