import { useState } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import styles from "./SignInComponent.module.css";
import cn from "classnames";

export const SignInComponent = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const [active, setActive] = useState(false);
  return (
    <div
      // className={cn(
      //   "absolute left-full h-5 w-5 -translate-x-full bg-green-400 active:opacity-50 ",
      //   { [styles.active]: active === true }
      // )}
      className={cn(
        "absolute left-full flex h-10 w-24 overflow-hidden bg-slate-700 transition-all",
        {
          [styles.active || ""]: active === true,
          [styles.hidden || ""]: active === false,
        }
      )}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className=" relative w-1/3 bg-black">
        <div
          className={cn(
            " absolute left-1/2 top-1/2 flex h-5 -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden",
            styles.arrow
          )}
        >
          &#8592;
        </div>
      </div>
      <div className="flex w-2/3 items-center justify-center overflow-hidden rounded-lg ">
        {!isSignedIn && <SignInButton mode="modal" />}
        {!!isSignedIn && <SignOutButton />}
      </div>
    </div>
  );
};
