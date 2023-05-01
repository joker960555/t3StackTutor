import { useEffect, useState } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import cn from "classnames";
import { useTheme } from "next-themes";
import { ArrowSVG } from "public/svgs/index";
import {
  SignInSideButton,
  SignOutSideButton,
} from "~/components/SignInComponents/SignInComponents";
export const SideMenu = () => {
  const { isSignedIn } = useUser();
  const [active, setActive] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div
      className={cn("fixed top-1 flex h-32 w-40 transition-all", {
        ["right-1 translate-x-0"]: active === true,
        ["-right-1 translate-x-4/5"]: active === false,
      })}
    >
      <div className="flex w-1/5 justify-center">
        <div className="mt-4 h-min" onClick={() => setActive((prev) => !prev)}>
          <ArrowSVG
            className={cn("h-7 w-7 cursor-pointer transition-all", {
              ["rotate-180"]: active === true,
              ["fill-slate-300 hover:scale-105 hover:fill-slate-400 active:scale-100"]:
                theme === "dark",
              ["fill-slate-800 hover:scale-105 hover:fill-slate-900 active:scale-100"]:
                theme === "light",
            })}
          />
        </div>
      </div>
      <div className="flex w-4/5 flex-col gap-2">
        <div
          className={cn("h-1/2 rounded-lg transition-all", {
            ["bg-slate-600 hover:bg-slate-700"]: theme === "dark",
            ["bg-slate-700 hover:bg-slate-800"]: theme === "light",
          })}
        >
          {!isSignedIn && <SignInSideButton />}
          {!!isSignedIn && <SignOutSideButton />}
          <div className="w-full"></div>
        </div>
        <div
          className={cn("h-1/2 rounded-lg bg-zinc-700 transition-all", {
            ["hover:bg-zinc-600"]: theme === "dark",
            ["hover:bg-zinc-800"]: theme === "light",
          })}
        >
          <button
            onClick={() =>
              theme === "dark" ? setTheme("light") : setTheme("dark")
            }
            className={cn("h-full w-full text-lg font-medium transition-all", {
              ["text-slate-200 hover:text-slate-400"]: theme === "dark",
              ["text-slate-300 hover:text-slate-400"]: theme === "light",
            })}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};
