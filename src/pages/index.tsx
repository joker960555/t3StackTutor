import type { NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PostForm } from "~/components/createPostForm/CreatePostForm";
import { CreatePostList } from "~/components/createReplyList/CreatePostList";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();
  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <PostForm />
      <CreatePostList />
    </>
  );
};

export default Home;
