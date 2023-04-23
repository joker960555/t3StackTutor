import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostForm } from "~/components/createPostForm/CreatePostForm";
import { CreatePostView } from "~/components/createPostView/CreatePostView";

dayjs.extend(relativeTime);

const Feed = () => {
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) {
    return <LoadingPage />;
  }
  if (!posts) {
    return <div />;
  }

  return (
    <>
      {posts.map((post) => {
        return <CreatePostView {...post} key={post.id} />;
      })}
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
