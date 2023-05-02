import { useEffect, useState } from "react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import cn from "classnames";

export const SignInSideButton = () => {
  return (
    <SignInButton>
      <button
        className={cn(
          "h-full w-full text-lg font-medium text-slate-300 dark:text-slate-200"
        )}
      >
        SignIn
      </button>
    </SignInButton>
  );
};

export const SignOutSideButton = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <SignOutButton>
      <button
        className={cn(
          "h-full w-full text-lg font-medium text-slate-300 transition-all hover:text-slate-400 dark:text-slate-200 dark:hover:text-slate-400"
        )}
      >
        SignOut
      </button>
    </SignOutButton>
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
