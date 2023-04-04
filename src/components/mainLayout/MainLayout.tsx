import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { FC, PropsWithChildren } from "react";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  return (
    <>
      <main className="w-full">
        <div className="absolute top-1 left-1 transition-all hover:scale-105">
          {!isSignedIn && <SignInButton mode="modal" />}
          {!!isSignedIn && <SignOutButton />}
        </div>

        <div className=" mx-auto flex h-full min-h-screen w-full flex-col border-x border-gray-600 sm:w-1/2">
          {children}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};
