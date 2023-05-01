import { useEffect, useState } from "react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import cn from "classnames";
import { useTheme } from "next-themes";

export const SignInSideButton = () => {
  // const { user, isSignedIn } = useUser();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <SignInButton>
      <button
        className={cn("h-full w-full text-lg font-medium", {
          ["text-slate-200"]: theme === "dark",
          ["text-slate-300"]: theme === "light",
        })}
      >
        SignIn
      </button>
    </SignInButton>
  );
};

export const SignOutSideButton = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <SignOutButton>
      <button
        className={cn("h-full w-full text-lg font-medium transition-all", {
          ["text-slate-200 hover:text-slate-400"]: theme === "dark",
          ["text-slate-300 hover:text-slate-400"]: theme === "light",
        })}
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
