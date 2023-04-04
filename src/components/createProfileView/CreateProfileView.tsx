import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import { CreatePostView } from "~/components/createPostView/CreatePostView";

type postWithUserType = RouterOutputs["profile"]["getProfileByUserName"];
export const CreateProfileView = (props: { data: postWithUserType }) => {
  const { data } = props;
  const { authorId, profileImageUrl, username } = data.filteredUser;
  const postWithUser = data.userPosts.map((post) => {
    return { ...post, authorId, profileImageUrl, username };
  });
  return (
    <>
      <header className=" flex cursor-pointer items-center gap-x-8 px-2 py-1">
        <Link className="" href={"/"}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-900">
            &#8592;
          </span>
        </Link>
        <div className="flex flex-col ">
          <span className="text-lg font-semibold leading-6">{username}</span>
          <span className="text-xs font-light text-gray-400 ">dude</span>
        </div>
      </header>
      <section className=" relative block h-48 bg-gradient-to-r from-yellow-400 to-blue-800 ">
        <Image
          src={profileImageUrl}
          alt={`${username}'s profile image`}
          height={200}
          width={200}
          className="absolute left-5 top-full h-32 w-32 -translate-y-1/2 rounded-full outline outline-4 outline-black  "
        ></Image>
      </section>
      <section className="px-5">
        <div className="h-24"></div>
        <span className="text-lg font-semibold leading-6">{username}</span>
      </section>
      <section className="border-t border-gray-600">
        {postWithUser.map((post) => {
          return <CreatePostView {...post} key={post.id} />;
        })}
      </section>
    </>
  );
};
