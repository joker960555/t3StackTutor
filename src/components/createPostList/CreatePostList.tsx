import { useState, useRef, useEffect } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { CreatePostView } from "~/components/createPostView/CreatePostView";

type userTypeWithPosts = RouterOutputs["profile"]["getProfileByUserName"];
export const CreatePostList = (props: userTypeWithPosts) => {
  const { userPosts, filteredUser, initialCursor } = props;
  const [page, setPage] = useState(0);
  const [infiniteData, setInfiniteData] = useState([...userPosts]);
  const elemRef = useRef(null);

  const { data, isFetched, fetchNextPage, hasNextPage } =
    api.posts.getInfinitePostsByUserId.useInfiniteQuery(
      {
        authorId: filteredUser.authorId,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        initialCursor: initialCursor,
      }
    );
  const onIntersection = (entries: IntersectionObserverEntry[]) => {
    const firstEntry = entries[0];
    if (firstEntry && firstEntry.isIntersecting) {
      console.log("IS");
    }
    if (firstEntry?.isIntersecting && hasNextPage) {
      handeNextPage();
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
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
    const fetchedData = data?.pages[page]?.posts;
    console.log("SUKA JA ZDES", fetchedData, page);
    void fetchNextPage()
      .then(() => {
        console.log("WTF", fetchedData);
        if (fetchedData) {
          setPage((page) => page + 1);
        }
      })
      .then(() =>
        setInfiniteData((prevData) => {
          if (fetchedData) {
            return [...prevData, ...fetchedData];
          } else {
            console.log("SO WHATS HERE", fetchedData);
            return [...prevData];
          }
        })
      );
  };

  return (
    <>
      <section id="scrollArea" className="border-t border-gray-600">
        {infiniteData.map((post) => {
          return <CreatePostView {...post} {...filteredUser} key={post.id} />;
        })}
      </section>
      {hasNextPage && (
        <button
          ref={elemRef}
          onClick={handeNextPage}
          className="mx-auto h-9 justify-self-center rounded-lg bg-slate-600 px-4 transition-all hover:opacity-90 active:scale-95"
        >
          Load more posts
        </button>
      )}
    </>
  );
};
