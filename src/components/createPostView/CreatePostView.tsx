import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);
type postWithUserType = RouterOutputs["posts"]["getAll"][number];
export const CreatePostView = (props: postWithUserType) => {
  const { username, id, profileImageUrl, createdAt, content, authorId } = props;

  return (
    <div className="flex items-center gap-4 border-b border-gray-600 py-3 px-4 text-sm">
      <div className="self-start justify-self-start ">
        <Link href={`${username}`} className="block h-12 w-12 ">
          <Image
            src={profileImageUrl}
            alt={`${username}'s profile image`}
            width={48}
            height={48}
            className="rounded-full object-cover transition-all hover:opacity-70"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <Link href={`${username}`}>
            <span className=" font-medium">{username}</span>
          </Link>
          <Link className="flex gap-1" href={`${username}/status/${id}`}>
            <span className=" font-normal text-gray-500">·</span>
            <span className=" font-normal text-gray-500 hover:underline hover:decoration-1">
              {dayjs(createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <Link href={`${username}/status/${id}`}>
          <div>
            🫠🫠🫠🫠🫠{content}Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Quasi dignissimos nisi veritatis odio saepe doloribus
            similique dolor obcaecati vel quae, quibusdam earum, exercitationem
            cumque nobis illo provident praesentium at! Hic.
          </div>
        </Link>
      </div>
    </div>
  );
};
