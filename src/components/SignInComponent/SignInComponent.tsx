import { FC, useState } from "react";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import styles from "./SignInComponent.module.css";
import cn from "classnames";

export const SignInComponent = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const [active, setActive] = useState(false);
  return (
    <div
      className={cn(styles.signIn, {
        [styles.active || ""]: active === true,
      })}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className="flex w-1/3 items-center justify-items-center bg-transparent">
        <div
          className={cn(styles.arrow, {
            [styles.active || ""]: active === true,
          })}
        >
          &#8592;
        </div>
      </div>
      <div className="flex w-2/3 items-center justify-center overflow-hidden rounded-full bg-slate-700 ">
        {!isSignedIn && <SignInButton mode="modal" />}
        {!!isSignedIn && <SignOutButton />}
      </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export const SignInPlate = ({ text }: { text: string }) => {
  return (
    <div className="mx-auto">
      <SignInButton>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent transition-all hover:scale-105 active:scale-100">
          {text}
        </button>
      </SignInButton>
    </div>
  );
};
