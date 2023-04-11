import type { Post } from "@prisma/client";

export const createInitialCursor = (posts: Post[]) => {
  return posts.pop()?.id;
};
