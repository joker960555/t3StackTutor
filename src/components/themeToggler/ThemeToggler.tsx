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
    <div className="h-full w-full">
      {currentTheme === "dark" ? (
        <div
          className="flex h-full w-full cursor-pointer items-center justify-center"
          onClick={() => setTheme("light")}
        >
          <SunSVG
            className={cn("", {
              ["h-3/4 w-3/4 fill-slate-300"]: sideMenuToggler,
              ["h-6 w-6 fill-slate-200"]: !sideMenuToggler,
            })}
          />
        </div>
      ) : (
        <div
          className="flex h-full w-full cursor-pointer items-center justify-center"
          onClick={() => setTheme("dark")}
        >
          <MoonSVG
            className={cn("", {
              ["h-3/4 w-3/4 stroke-slate-300"]: sideMenuToggler,
              ["h-6 w-6 stroke-slate-200"]: !sideMenuToggler,
            })}
          />
        </div>
      )}
    </div>
  );
};
