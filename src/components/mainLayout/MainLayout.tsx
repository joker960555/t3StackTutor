import { SignIn } from "@clerk/nextjs";
import type { FC, PropsWithChildren } from "react";
import { SignInComponent } from "~/components/SignInComponent/SignInComponent";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="w-full">
        <SignInComponent />
        <div className=" mx-auto flex h-full min-h-screen w-full flex-col border-x border-gray-600 sm:w-1/2">
          {children}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};
