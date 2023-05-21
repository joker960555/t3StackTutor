import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import type { Comment } from "@prisma/client";
import {
  deletePostById,
  deleteCommentById,
} from "~/server/api/helpers/deleteQueries";
import cn from "classnames";
import { TrashSVG } from "public/svgs/index";
import { useSession } from "@clerk/nextjs";

type UserWithPostType =
  RouterOutputs["posts"]["getAllInfinitePostsOrByUserId"]["posts"][number];
type UserWithCommentType =
  RouterOutputs["comments"]["getInfiniteComments"]["comments"][number];

export const ReplyOptionsMenu = ({
  // size of the menu 18rem, used to calculate the position of the menu in CreatePostView component
  direction,
  userWithPostOrCommentData,
}: {
  direction: "toTop" | "toBottom";
  userWithPostOrCommentData: (UserWithPostType | UserWithCommentType) &
    Partial<Pick<Comment, "postId">>;
  setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isSignedIn, session } = useSession();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { id, authorId, postId } = userWithPostOrCommentData;
  const lastPartOfCurrentURL = window.location.href.split("/").pop()!;
  useEffect(() => {
    if (isSignedIn) {
      session.user.id === authorId
        ? setButtonDisabled(false)
        : setButtonDisabled(true);
    }
  }, []); // Disables menu Button if authorID not belongs to session.user
  // if postId is provided, deleteCommentById, otherwise deletePostById
  const { mutate } = postId ? deleteCommentById() : deletePostById();
  const conditionOnRedirectToHomePageBeforeDelete = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (lastPartOfCurrentURL !== id || postId) {
      //redirects to home page when deleting post on [postId] page or
      // when !postId prop provided
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
            <TrashSVG className="h-6 w-6 fill-red-600" />
            <p className=" text-base font-bold text-red-600">Delete</p>
          </div>
        </Link>
      </div>
    </>
  );
};
