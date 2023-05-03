import { api } from "~/utils/api";
import type { Dispatch, SetStateAction } from "react";

// deleteQueries for ReplyOptionsMenu component

export const deletePostById = (
  setFlagToRefetch: Dispatch<SetStateAction<boolean>> | undefined,
  lastPartOfCurrentURL: string,
  username: string
) => {
  const ctx = api.useContext();
  return api.posts.removeUniquePostById.useMutation({
    onSuccess: () => {
      // Posts exist on main page, [username] page and [postId] page, so
      // switch case to check the current page to chose invalidation method
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
};

export const deleteCommentById = (
  setFlagToRefetch: Dispatch<SetStateAction<boolean>> | undefined
) => {
  return api.comments.removeUniqueCommentById.useMutation({
    onSuccess: () => {
      // Comments exist only on [postId] page, so setFlagToRefetch
      // on Delete by default
      if (setFlagToRefetch) {
        setFlagToRefetch(true);
      }
    },
  });
};
