import { useState } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import cn from "classnames";
import { ThemeToggler } from "~/components/themeToggler/ThemeToggler";
import { ArrowSVG } from "public/svgs/index";
import {
  SignInSideButton,
  SignOutSideButton,
} from "~/components/SignInComponents/SignInComponents";
export const SideMenu = () => {
  const { isSignedIn } = useUser();
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn("fixed top-1 hidden h-32 w-48 transition-all sm:flex", {
        ["right-1 translate-x-0"]: active === true,
        ["-right-1 translate-x-4/5"]: active === false,
      })}
    >
      <div className="flex w-1/5">
        <div className="mt-3 h-min" onClick={() => setActive((prev) => !prev)}>
          <ArrowSVG
            className={cn(
              "h-auto w-9 cursor-pointer fill-slate-800 transition-all hover:scale-105 hover:fill-slate-900 active:scale-100 dark:fill-slate-300 dark:hover:scale-105 dark:hover:fill-slate-400 dark:active:scale-100",
              {
                ["rotate-180"]: active === true,
              }
            )}
          />
        </div>
      </div>
      <div className="flex w-4/5 flex-col gap-2">
        <div
          className={cn(
            " h-15 rounded-lg bg-slate-700 transition-all hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700"
          )}
        >
          {!isSignedIn && <SignInSideButton />}
          {!!isSignedIn && <SignOutSideButton />}
          <div className="w-full"></div>
        </div>
        <div
          className={cn(
            "h-15 rounded-lg bg-zinc-700 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-600"
          )}
        >
          <ThemeToggler sideMenuToggler={true} />
        </div>
      </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export const SideMenuMobile = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      <div className="block h-10 bg-current sm:hidden"></div>
      <div className=" fixed top-0 z-50 flex h-10 w-full justify-between bg-gradient-to-r from-blue-800 to-blue-900 py-2 px-4 text-slate-200 sm:hidden">
        Typesparks
        <div className="grow"></div>
        <div className="flex gap-6">
          {!isSignedIn && <SignInSideButton />}
          {!!isSignedIn && <SignOutSideButton />}
          <ThemeToggler />
        </div>
      </div>
    </>
  );
};
