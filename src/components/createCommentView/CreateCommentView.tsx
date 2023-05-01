import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";
import cn from "classnames";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
import { DotsSVG } from "public/svgs";
import { PostOptionsMenu } from "../postOptionsMenu/PostOptionsMenu";
import { checkForLongWord } from "~/server/api/helpers/checkForLongWord";
import { useTheme } from "next-themes";
type userWithCommentType = RouterOutputs["comments"]["getAll"][number];

export const CreateCommentView = (
  props: userWithCommentType & {
    setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const {
    username,
    profileImageUrl,
    id,
    content,
    createdAt,
    setFlagToRefetch,
  } = props;
  const [openOptions, setOpenOptions] = useState(false);
  const [direction, setDirection] = useState<"toBottom" | "toTop">("toBottom");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const toggleOptionsMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const spaceToTheBottomInRem =
      (document.documentElement.clientHeight - e.clientY) / currentFontSize; // calculate the space between the cursor and the bottom of the screen in REM
    setOpenOptions((open) => !open);
    setDirection(() => (spaceToTheBottomInRem > 18 ? "toBottom" : "toTop")); // calculated value is compared to the size of the menu (18rem)
  };
  return (
    <div className="flex items-center gap-4 border-b border-gray-600 py-3 px-4 text-sm">
      <div className="self-start justify-self-start">
        <Link href={`/${username}`} className="block h-12 w-12 rounded-full ">
          <Image
            src={profileImageUrl}
            alt={`${username}'s profile image`}
            width={96}
            height={96}
            className="h-full w-full rounded-full object-cover transition-all hover:opacity-70"
          />
        </Link>
      </div>
      <div className="flex w-full flex-col ">
        <div className="flex justify-between">
          <div className="flex gap-1 ">
            <Link href={`/${username}`}>
              <span className=" font-medium">{username}</span>
            </Link>
            <Link
              className="flex gap-1"
              href={`/${username}/status/${id}`}
              replace={true}
            >
              <span className=" font-normal text-gray-500">·</span>
              <span className=" font-normal text-gray-500 hover:underline hover:decoration-1">
                {dayjs(createdAt).fromNow()}
              </span>
            </Link>
          </div>
          <div
            onClick={(e) => toggleOptionsMenu(e)}
            className={cn(
              "relative h-7 w-7 cursor-pointer rounded-full transition-all",
              {
                ["cursor-default bg-transparent hover:bg-transparent active:bg-transparent"]:
                  openOptions,
                ["hover:bg-sky-200 hover:bg-opacity-30 hover:text-sky-600 active:bg-sky-400 active:bg-opacity-40"]:
                  theme === "dark",
                ["hover:bg-sky-400 hover:bg-opacity-30 hover:text-sky-800 active:bg-sky-600 active:bg-opacity-40"]:
                  theme === "light",
              }
            )}
          >
            <DotsSVG
              className={cn(
                "visible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full fill-current opacity-100",
                { ["invisible opacity-0"]: openOptions }
              )}
            />
            <div
              className={cn(
                "relative z-20 origin-top transform transition-all",
                {
                  ["scale-y-100 opacity-100"]: openOptions,
                  ["scale-y-0"]: !openOptions,
                }
              )}
            >
              {openOptions && (
                <PostOptionsMenu
                  userWithPostData={props}
                  direction={direction}
                  setFlagToRefetch={setFlagToRefetch}
                />
              )}
            </div>
            <div //invisible overlay for toggling the menu
              className={cn({
                ["hidden"]: !openOptions,
                ["fixed top-0 left-0 z-10 block h-screen w-screen bg-transparent"]:
                  openOptions,
              })}
            ></div>
          </div>
        </div>
        <Link
          href={`/${username}/status/${id}`}
          replace={true}
          className="-my-1" //make the post clickable; -margin top to compose post
        >
          {checkForLongWord(content, 45) ? ( //check the longest word and brake it if it is longer than 45
            <p className="break-all">{content}</p>
          ) : (
            <p className="break-words">{content}</p>
          )}
        </Link>
      </div>
    </div>
  );
};
