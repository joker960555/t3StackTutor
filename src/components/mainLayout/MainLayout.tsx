import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import type { FC, PropsWithChildren } from "react";
import { SideMenu } from "~/components/SideMenu/SideMenu";
import { useTheme } from "next-themes";
import cn from "classnames";

// main bg-slate-200 on light-mode
// main bg-zinc-900 on dark-mode
export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  // enable theme when mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      <main
        className={cn("relative w-full overflow-hidden", {
          [" bg-zinc-900"]: currentTheme === "dark",
          ["bg-slate-200"]: currentTheme === "light",
        })}
      >
        {/* DARK THEME MANUAL TOGGLING IN SIDE MENU */}
        <SideMenu />
        <div className=" mx-auto flex h-full min-h-screen w-full flex-col border-x border-gray-600 sm:w-1/2">
          {children}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};
