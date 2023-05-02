import { SignIn } from "@clerk/nextjs";
import type { FC, PropsWithChildren } from "react";

import { SideMenu } from "~/components/SideMenu/SideMenu";
import cn from "classnames";

// main bg-slate-200 on light-mode
// main bg-zinc-900 on dark-mode
export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  // enable theme when mounted
  return (
    <>
      <main
        className={cn(
          "relative w-full overflow-hidden bg-slate-200 dark:bg-zinc-900"
        )}
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
