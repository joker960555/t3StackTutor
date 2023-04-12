import { useState } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import styles from "./SignInComponent.module.css";
import cn from "classnames";

export const SignInComponent = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();
  const [active, setActive] = useState(false);
  return (
    <div
      className={cn(styles.signIn, {
        [styles.active || ""]: active === true,
        // [styles.hidden]: active === false,
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
    </div>
  );
};

// .hidden {
//   @apply bg-inherit;
// }

// .active {
//   @apply bg-inherit;
// }

// .active .arrow {
//   @apply rotate-180;
// }
