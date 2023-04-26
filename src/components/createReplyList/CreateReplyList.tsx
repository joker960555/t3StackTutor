import { useState, useRef, useEffect } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { CreatePostView } from "~/components/createPostView/CreatePostView";
import { CreateCommentView } from "~/components/createCommentView/CreateCommentView";
import type { Post, Comment } from "@prisma/client";
import {
  infinitePostsByUserId,
  infiniteCommentsByPostId,
} from "~/server/api/helpers/infiniteQueries";

type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
// in this component Comment or Post prisma schema is used for useInfiniteQuery
// 'replies' fetching. Through ternary conditions and based on providing of
// 'postId' property to CreateReplyList component, 'replies' data is defined as
// an array of comments or posts and then is passed to CreatePostView component
export const CreateReplyList = ({
  authorId,
  profileImageUrl,
  username,
  postId,
}: userProfileType & Partial<Pick<Comment, "postId">>) => {
  // const { username, profileImageUrl, authorId } = props;
  const [page, setPage] = useState(0);
  const [flagToRefetch, setFlagToRefetch] = useState<boolean>(false);
  const elemRef = useRef(null);
  const { data, hasNextPage, fetchNextPage, isFetched, refetch, isRefetching } =
    postId
      ? infiniteCommentsByPostId({ postId })
      : infinitePostsByUserId({ authorId }); // IF postId IS PROVIDED, INFINITE('COMMENTS') WILL BE FETCHED | INFINITE('POSTS') OTHERWISE
  const [infiniteData, setInfiniteData] = useState<[] | Post[] | Comment[]>([]);
  useEffect(() => {
    if (flagToRefetch === true) {
      postId
        ? void ctx.posts.getInfinitePostsByUserId.invalidate()
        : void ctx.comments.getInfiniteComments.invalidate(); // IF postId IS PROVIDED, INFINITE('COMMENTS') WILL BE INVALIDATED | INFINITE('POSTS') OTHERWISE
      setFlagToRefetch(false); // onDelete refetch useInfiniteQuery Replies (COMMENTS | POSTS)
      void refetch().then((resp) => {
        if (resp.isSuccess) {
          setInfiniteData(() =>
            resp.data.pages.flatMap((page) =>
              "comments" in page ? page.comments : page.posts
            )
          ); // setInfiniteData through ternary condition between 'comments' : 'posts' instances of 'page'
        }
      });
    }
  }, [flagToRefetch]);
  useEffect(() => {
    if (data && data.pages && data.pages[0]) {
      const firstPageOfQuery =
        "comments" in data.pages[0]
          ? data.pages[0].comments
          : data.pages[0].posts; // setInfiniteData of First Page through ternary condition between 'comments' : 'posts' instances of 'page'
      if (page === 0) {
        setInfiniteData(firstPageOfQuery);
        setPage((page) => page + 1);
        if (!hasNextPage)
          setInfiniteData(
            data?.pages.flatMap((page) => {
              return "comments" in page ? page.comments : page.posts; // setInfiniteData through ternary condition between 'comments' : 'posts' instances of 'page'
            })
          );
      }
      if (!isRefetching) {
        setInfiniteData(
          data?.pages.flatMap((page) => {
            return "comments" in page ? page.comments : page.posts; // setInfiniteData through ternary condition between 'comments' : 'posts' instances of 'page'
          })
        );
      }
    }
  }, [data, hasNextPage, isRefetching]);
  const ctx = api.useContext();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry?.isIntersecting && hasNextPage && page !== 0) {
        handeNextPage();
      }
    });
    if (observer && elemRef.current) {
      observer.observe(elemRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [page, isFetched]);
  const handeNextPage = () => {
    let fetchedData: Comment[] | Post[] | undefined = undefined;
    void fetchNextPage()
      .then((resp) => {
        const commentsOrPosts = resp.data?.pages[page];
        if (resp.isSuccess && commentsOrPosts) {
          fetchedData =
            "comments" in commentsOrPosts
              ? commentsOrPosts.comments
              : commentsOrPosts?.posts; // set fetchedData through ternary condition between 'comments' : 'posts' instances of 'page'
        }
        if (fetchedData) {
          setPage((page) => page + 1);
        }
      })
      .then(() =>
        setInfiniteData((prevData) => {
          if (fetchedData) {
            return [...prevData, ...fetchedData];
          } else {
            return [...prevData];
          }
        })
      );
  };

  return (
    <>
      <section id="scrollArea" className="border-t border-gray-600">
        {/*Finally, based on presence of 'postId' value,
         CreateCommentView or CreatePostView will be created*/}
        {infiniteData.length > 0 &&
          infiniteData.map((commentOrPost) => {
            return "postId" in commentOrPost ? (
              <CreateCommentView
                {...commentOrPost}
                {...{ profileImageUrl, username, authorId }}
                setFlagToRefetch={setFlagToRefetch}
                key={commentOrPost.id}
              />
            ) : (
              <CreatePostView
                {...commentOrPost}
                {...{ profileImageUrl, username, authorId }}
                setFlagToRefetch={setFlagToRefetch}
                key={commentOrPost.id}
              />
            );
          })}
      </section>
      {hasNextPage && (
        <div ref={elemRef} className="h-[1px] bg-transparent opacity-0"></div> // intersection trigger that fetches next page
      )}
    </>
  );
};
