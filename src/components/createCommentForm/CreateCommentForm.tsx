import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, UserButton } from "@clerk/nextjs";
import { type RouterOutputs, api } from "~/utils/api";
import toast from "react-hot-toast";
import { CreateLoadingSpinner } from "../loading";
import { SignInPlate } from "~/components/SignInComponents/SignInComponents";
import { useTheme } from "next-themes";
import cn from "classnames";

type CommentType = RouterOutputs["comments"]["createComment"];
const commentFormContentSchema = z.object({ content: z.string() }); //schema for form validation
const commentContentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Post must contain at least 1 character(s)" })
    .max(255),
  postId: z.string(),
}); //schema for request to api
export const CommentForm = ({ postId }: Pick<CommentType, "postId">) => {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState("auto");
  const { user, isSignedIn } = useUser();
  const { theme } = useTheme();
  // const [mounted, setMounted] = useState<boolean>(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  useEffect(() => {
    const textArea = document.getElementById("myTextArea");
    // Counts inline height of textarea based on textarea's lineHeight & scrollHeight
    if (textArea) {
      textArea.style.height = `${parseInt(
        window.getComputedStyle(textArea).lineHeight
      )}px`;
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [user, value]);
  const { register, handleSubmit } = useForm<
    z.infer<typeof commentFormContentSchema>
  >({
    resolver: zodResolver(commentFormContentSchema),
  });
  const { mutate: createCommentReq, isLoading: isPosting } =
    api.comments.createComment.useMutation({
      onSuccess: () => {
        void ctx.comments.getAll.invalidate();
        void ctx.comments.getInfiniteComments.invalidate();
        setValue("");
      },
      onError: (e) => {
        if (e.data?.code === "TOO_MANY_REQUESTS") {
          toast.error(e.message);
          return;
        }
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        }
      },
    });
  const ctx = api.useContext();
  const onValid = useCallback(
    (data: z.infer<typeof commentContentSchema>) => {
      createCommentReq(data);
    },
    [createCommentReq]
  );
  if (!user || !user.username || !isSignedIn) {
    return (
      <div className="flex flex-col border-b border-gray-600 px-4 py-3">
        <SignInPlate text={"Sign in to make a comment down below"} />
      </div>
    );
  }
  // if (!mounted) return <div />;
  return (
    <div className="flex flex-col border-b border-gray-600 px-4 pb-3 pt-1">
      <div className="my-2 ml-16 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-lg font-extralight text-transparent">
        Leave a comment down below
      </div>
      <form
        onSubmit={handleSubmit(
          (data) => {
            onValid({ content: data.content, postId });
          },
          (e) => {
            e.content?.message && toast.error(e.content.message);
          }
        )}
      >
        <div className="flex h-fit justify-between gap-4">
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: { width: 48, height: 48 } },
            }}
          />

          <textarea
            className={cn(
              "grow resize-none overflow-y-hidden whitespace-pre-wrap py-4 outline-none",
              {
                ["bg-zinc-900"]: theme === "dark",
                ["bg-slate-200 placeholder:text-slate-500"]: theme === "light",
              }
            )}
            {...register("content")}
            id="myTextArea"
            autoComplete="off"
            placeholder="Say something back"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setHeight(`${e.target.scrollHeight}px`);
            }}
            disabled={isPosting}
            style={{ height: height }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div
            className="flex gap-4
					"
          >
            <div className="w-12" />
            <span className="">🧌🧌🧌🧌🧌</span>
          </div>
          <div className="flex">
            {isPosting && (
              <span className="self-center pr-4">
                <CreateLoadingSpinner size={12} />
              </span>
            )}

            <button
              type="submit"
              className={cn(
                "rounded-full border border-blue-500 bg-blue-500 px-8 py-1 transition-colors hover:bg-blue-600 disabled:opacity-60 disabled:hover:bg-blue-500",
                {
                  ["text-neutral-800 hover:text-neutral-900"]:
                    theme === "light",
                }
              )}
              disabled={isPosting || !value}
            >
              Answer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
