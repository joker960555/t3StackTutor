import type { Dispatch, SetStateAction } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { HeartSVG } from "public/svgs";
type userWithPostType =
  RouterOutputs["posts"]["getAllInfinitePostsOrByUserId"]["posts"][number];
type userWithCommentType =
  RouterOutputs["comments"]["getInfiniteComments"]["comments"][number];
import cn from "classnames";

const LikeFeed: React.FC<{
  handleToggleLike: () => void;
  likedByMe: boolean;
  isLoading: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  likeCount: number;
}> = ({ handleToggleLike, likedByMe, likeCount }) => {
  return (
    <>
      <div className="">
        <button className="relative self-start" onClick={handleToggleLike}>
          <HeartSVG
            className={cn(
              "h-4 w-4 fill-transparent stroke-black transition-all active:fill-red-500 active:stroke-red-500 dark:stroke-slate-300 active:dark:stroke-red-500 hover-hover:hover:fill-red-500 hover-hover:hover:stroke-red-500",
              {
                ["fill-yellow-500 dark:fill-blue-500"]: likedByMe,
              }
            )}
          />
          <span className="cli pointer-events-none absolute -top-[12.5%] -right-3/4">
            {likeCount ?? 0}
          </span>
        </button>
      </div>
    </>
  );
};

export const LikePostComponent = (
  props: userWithPostType & {
    setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const { id } = props;
  const trpcUtils = api.useContext();
  const likeMutation = api.likes.toggleLikeToPost.useMutation({
    onSuccess: () => {
      void trpcUtils.posts.getAllInfinitePostsOrByUserId.invalidate();
    },
  });
  const { isLoading, isIdle, isSuccess } = likeMutation;
  return (
    <>
      <LikeFeed
        handleToggleLike={() => {
          likeMutation.mutate({ postId: id });
          console.log("clicked");
        }}
        likedByMe={props.likedByMe}
        isLoading={isLoading}
        isIdle={isIdle}
        isSuccess={isSuccess}
        likeCount={props.likeCount}
      />
    </>
  );
};

export const LikeCommentComponent = (
  props: userWithCommentType & {
    setFlagToRefetch?: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const { id } = props;
  const trpcUtils = api.useContext();
  const likeMutation = api.likes.toggleLikeToComment.useMutation({
    onSuccess: () => {
      void trpcUtils.comments.getInfiniteComments.invalidate();
    },
  });
  const { isLoading, isIdle, isSuccess } = likeMutation;
  return (
    <>
      <LikeFeed
        handleToggleLike={() => likeMutation.mutate({ commentId: id })}
        likedByMe={props.likedByMe}
        isLoading={isLoading}
        isIdle={isIdle}
        isSuccess={isSuccess}
        likeCount={props.likeCount}
      />
    </>
  );
};
