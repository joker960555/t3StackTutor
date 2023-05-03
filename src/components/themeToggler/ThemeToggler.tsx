import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunSVG, MoonSVG } from "public/svgs/index";
import cn from "classnames";

export const ThemeToggler = ({
  sideMenuToggler = false,
}: {
  sideMenuToggler?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  // enable theme when mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div
      className={cn("w-6", {
        ["flex h-full w-full items-center justify-center"]: sideMenuToggler,
      })}
    >
      {currentTheme === "dark" ? (
        <SunSVG
          className={cn("h-6 w-6 cursor-pointer fill-slate-200", {
            ["h-3/4 w-3/4 fill-slate-300"]: sideMenuToggler,
          })}
          onClick={() => setTheme("light")}
        />
      ) : (
        <MoonSVG
          className={cn("h-6 w-6 cursor-pointer stroke-slate-200", {
            ["h-3/4 w-3/4 stroke-slate-300"]: sideMenuToggler,
          })}
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
};
