import { useRef, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api, type RouterOutputs } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostForm } from "~/components/createPostForm/CreatePostForm";
import { CreatePostView } from "~/components/createPostView/CreatePostView";

dayjs.extend(relativeTime);

type PostWithUserData =
  RouterOutputs["posts"]["getAllInfinitePosts"]["posts"][number];
const Feed = () => {
  const [page, setPage] = useState(0);
  const [infiniteData, setInfiniteData] = useState<[] | PostWithUserData[]>([]);
  const [flagToRefetch, setFlagToRefetch] = useState<boolean>(false);
  const elemRef = useRef(null);
  const ctx = api.useContext();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetched,
    refetch,
    isRefetching,
    isLoading,
  } = api.posts.getAllInfinitePosts.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: 5000,
      refetchOnMount: true,
    }
  );
  useEffect(() => {
    if (flagToRefetch === true) {
      void ctx.posts.getInfinitePostsByUserId.invalidate();

      // onDelete refetch useInfiniteQuery POSTS
      setFlagToRefetch(false);
      void refetch().then((resp) => {
        if (resp.isSuccess) {
          setInfiniteData(() => resp.data.pages.flatMap((page) => page.posts));
        }
      });
    }
  }, [flagToRefetch]);
  useEffect(() => {
    if (data && data.pages && data.pages[0]) {
      // setInfiniteData of First Page
      const firstPageOfQuery = data.pages[0].posts;
      if (page === 0) {
        setInfiniteData(firstPageOfQuery);
        setPage((page) => page + 1);
        if (!hasNextPage)
          setInfiniteData(data?.pages.flatMap((page) => page.posts));
      }
      if (!isRefetching) {
        setInfiniteData(data?.pages.flatMap((page) => page.posts));
      }
    }
  }, [data, hasNextPage, isRefetching]);
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
  if (isLoading) return <LoadingPage />;
  if (!data) return <div />;
  const handeNextPage = () => {
    let fetchedData: PostWithUserData[] | undefined = undefined;
    void fetchNextPage()
      .then((resp) => {
        const postsWithCursor = resp.data?.pages[page];
        if (resp.isSuccess) {
          fetchedData = postsWithCursor?.posts;
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
  if (flagToRefetch) console.log(flagToRefetch);

  return (
    <>
      {infiniteData.length > 0 &&
        infiniteData.map((post) => {
          return (
            <CreatePostView
              {...post}
              key={post.id}
              setFlagToRefetch={setFlagToRefetch}
            />
          );
        })}
      {hasNextPage && (
        // intersection trigger that fetches next page
        <div ref={elemRef} className="h-[1px] bg-transparent opacity-0"></div>
      )}
    </>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();
  api.posts.getAll.useQuery();
  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <PostForm />
      <Feed />
    </>
  );
};

export default Home;
