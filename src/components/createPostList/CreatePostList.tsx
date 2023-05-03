// import { useState, useRef, useEffect } from "react";
// import { api, type RouterOutputs } from "~/utils/api";
// import { CreatePostView } from "~/components/createPostView/CreatePostView";
// import type { Post } from "@prisma/client";

// type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
// export const CreatePostList = (props: userProfileType) => {
//   const { authorId } = props;
//   const limit = 10;
//   const [page, setPage] = useState(0);
//   const [flagToRefetch, setFlagToRefetch] = useState<boolean>(false);
//   const elemRef = useRef(null);
//   const { data, hasNextPage, fetchNextPage, isFetched, refetch, isRefetching } =
//     api.posts.getInfinitePostsByUserId.useInfiniteQuery(
//       {
//         authorId,
//         limit,
//       },
//       {
//         getNextPageParam: (lastPage) => lastPage?.nextCursor,
//         refetchInterval: 5000,
//         refetchOnMount: true,
//       }
//     );
//   const [infiniteData, setInfiniteData] = useState<[] | Post[]>([]);
//   useEffect(() => {
//     if (flagToRefetch === true) {
//       void ctx.posts.getInfinitePostsByUserId.invalidate();
//       setFlagToRefetch(false); // onDelete refetch useInfiniteQuery posts
//       void refetch().then((resp) => {
//         if (resp.isSuccess) {
//           setInfiniteData(() => resp.data.pages.flatMap((page) => page.posts));
//         }
//       });
//     }
//   }, [flagToRefetch]);
//   useEffect(() => {
//     if (data && data.pages && data.pages[0]) {
//       if (page === 0) {
//         setInfiniteData(data.pages[0].posts);
//         setPage((page) => page + 1);
//         if (!hasNextPage)
//           setInfiniteData(
//             data?.pages.flatMap((page) => {
//               return page.posts;
//             })
//           );
//       }
//       if (!isRefetching) {
//         setInfiniteData(
//           data?.pages.flatMap((page) => {
//             return page.posts;
//           })
//         );
//       }
//     }
//   }, [data, hasNextPage, isRefetching]);
//   const ctx = api.useContext();
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       const firstEntry = entries[0];
//       if (firstEntry?.isIntersecting && hasNextPage && page !== 0) {
//         handeNextPage();
//       }
//     });
//     if (observer && elemRef.current) {
//       observer.observe(elemRef.current);
//     }
//     return () => {
//       if (observer) {
//         observer.disconnect();
//       }
//     };
//   }, [page, isFetched]);
//   const handeNextPage = () => {
//     let fetchedData: Post[] | undefined = undefined;
//     void fetchNextPage()
//       .then((resp) => {
//         if (resp.isSuccess) fetchedData = resp.data.pages[page]?.posts;
//         if (fetchedData) {
//           setPage((page) => page + 1);
//         }
//       })
//       .then(() =>
//         setInfiniteData((prevData) => {
//           if (fetchedData) {
//             return [...prevData, ...fetchedData];
//           } else {
//             return [...prevData];
//           }
//         })
//       );
//   };

//   return (
//     <>
//       {/* <section id="scrollArea" className="border-t border-gray-600">
//         {infiniteData.length > 0 &&
//           infiniteData.map((post) => {
//             return (
//               <CreatePostView
//                 {...post}
//                 {...props}
//                 setFlagToRefetch={setFlagToRefetch}
//                 key={post.id}
//               />
//             );
//           })}
//       </section>
//       {hasNextPage && (
//         <div ref={elemRef} className="h-[1px] bg-transparent opacity-0"></div> // intersection trigger that fetches next page
//       )} */}
//     </>
//   );
// };
