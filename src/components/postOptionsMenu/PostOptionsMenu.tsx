import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import cn from "classnames";
import { TrashSVG } from "public/svgs/index";
import { useSession } from "@clerk/nextjs";

type UserWithPostType = RouterOutputs["posts"]["getPostsByUserId"][number];
// Technically UserWithPostType belongs to Posts data flow, which no matters
// for usage with CreateComponentView components cause of unimportance of postId
// value for this PostOptionsMenu component. So
// PostOptionsMenu Can be used with Comments components
export const PostOptionsMenu = ({
  // size of the menu 18rem, used to calculate the position of the menu in CreatePostView component
  direction,
  userWithPostData,
  setFlagToRefetch,
}: {
  direction: "toTop" | "toBottom";
  userWithPostData: UserWithPostType;
  setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isSignedIn, session } = useSession();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { id, authorId, username } = userWithPostData;
  const ctx = api.useContext();
  const lastPartOfCurrentURL = window.location.href.split("/").pop()!;
  useEffect(() => {
    if (isSignedIn) {
      session.user.id === authorId
        ? setButtonDisabled(false)
        : setButtonDisabled(true);
    }
  }, []); // Disables menu Button if authorID not belongs to session.user
  const { mutate } = api.posts.removeUniquePostById.useMutation({
    onSuccess: () => {
      switch (lastPartOfCurrentURL) {
        case username:
          if (setFlagToRefetch) setFlagToRefetch(true); // onDelete refetch useInfiniteQuery posts
          break;

        default:
          void ctx.posts.getAll.invalidate();
          break;
      }
    },
  });
  const conditionOnRedirectToHomePageBeforeDelete = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (lastPartOfCurrentURL !== id) {
      e.preventDefault();
      e.stopPropagation();
    }
    mutate({ id, authorId }); // Delete after condition
  };
  return (
    <>
      <div
        className={cn(
          `absolute right-1 flex h-72 w-72 flex-col overflow-hidden rounded-lg bg-slate-300 shadow-equal shadow-gray-500 dark:bg-black`,
          { ["top-1"]: direction === "toBottom" },
          { ["-bottom-6"]: direction === "toTop" }
        )}
      >
        <Link
          className={cn(
            "h-12 w-full items-center overflow-hidden px-4 py-2 transition-all hover:bg-gray-400 dark:hover:bg-neutral-900",
            {
              ["pointer-events-none cursor-default opacity-50"]:
                buttonDisabled === true,
            }
          )}
          href={"/"}
          onClick={(e) => {
            conditionOnRedirectToHomePageBeforeDelete(e); // condition, then Delete
          }}
        >
          <div className="flex  h-full w-full items-center gap-2">
            <TrashSVG className="h-6 w-6 fill-red-600"></TrashSVG>
            <p className=" text-base font-bold text-red-600">Delete</p>
          </div>
        </Link>
      </div>
    </>
  );
};
