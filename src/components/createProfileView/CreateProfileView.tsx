import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import { CreatePostList } from "~/components/createPostList/CreatePostList";

type userTypeWithPosts = RouterOutputs["profile"]["getProfileByUserName"];
export const CreateProfileView = (props: { data: userTypeWithPosts }) => {
  const { data } = props;

  if (!data) {
    return <div />;
  }
  const { profileImageUrl, username } = data.filteredUser;
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
      {/* <section className="border-t border-gray-600">xw
        {props.data.userPosts.map((post) => {
          return (
            <CreatePostView {...post} {...data.filteredUser} key={post.id} />
          );
        })}
      </section> */}
      <CreatePostList {...data} />
    </>
  );
};
