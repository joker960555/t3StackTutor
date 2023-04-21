import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import cn from "classnames";
import { TrashSVG } from "public/svgs/index";

type userWithPostType = RouterOutputs["posts"]["getPostsByUserId"][number];
export const PostOptionsMenu = ({
  // size of the menu 18rem, used to calculate the position of the menu in CreatePostView component
  direction,
  userWithPostData,
  setFlagToRefetch,
}: {
  direction: "toTop" | "toBottom";
  userWithPostData: userWithPostType;
  setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { id, authorId, username } = userWithPostData;
  const ctx = api.useContext();
  const lastPartOfCurrentURL = window.location.href.split("/").pop()!;

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
    mutate({ id, authorId });
  };
  return (
    <>
      <div
        className={cn(
          `absolute right-1 flex h-72 w-72 flex-col overflow-hidden rounded-lg bg-black shadow-gray-300 drop-shadow-sm-all`,
          { ["top-1"]: direction === "toBottom" },
          { ["-bottom-6"]: direction === "toTop" }
        )}
      >
        <Link
          className="h-12 w-full items-center overflow-hidden px-4 py-2 transition-all hover:bg-neutral-900"
          href={"/"}
          onClick={(e) => {
            conditionOnRedirectToHomePageBeforeDelete(e);
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
