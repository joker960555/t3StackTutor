import { api } from "~/utils/api";

// deleteQueries for ReplyOptionsMenu component

export const deletePostById = () => {
  const ctx = api.useContext();
  return api.posts.removeUniquePostById.useMutation({
    onSuccess: () => {
      void ctx.posts.getAllInfinitePostsOrByUserId.invalidate();
    },
  });
};

export const deleteCommentById = () => {
  const ctx = api.useContext();
  return api.comments.removeUniqueCommentById.useMutation({
    onSuccess: () => {
      void ctx.comments.getInfiniteComments.invalidate();
    },
  });
};
