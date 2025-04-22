// "use client";

// import { useSuspenseQuery } from "@tanstack/react-query";

// import { useTRPC } from "~/trpc/react";

// export function MsgList() {
//   const trpc = useTRPC();
//   const { data: msg } = useSuspenseQuery(trpc. hello.hello.queryOptions());
//   console.log("🔥", { msg });
//   if (msg.length === 0) {
//     return (
//       <div className="relative flex w-full flex-col gap-4">
//         {msg.map((m) => {
//           return <div key={m}>{m}</div>;
//         })}
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
//           <p className="text-2xl font-bold">No posts yet</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full flex-col gap-4">
//       hello2
//       {msg.map((m) => {
//         return <div key={m}>{m}</div>;
//       })}
//     </div>
//   );
// }

// // export function PostCard(props: {
// //   post: RouterOutputs["post"]["all"][number];
// // }) {
// //   const trpc = useTRPC();
// //   const queryClient = useQueryClient();
// //   const deletePost = useMutation(
// //     trpc.post.delete.mutationOptions({
// //       onSuccess: async () => {
// //         await queryClient.invalidateQueries(trpc.post.pathFilter());
// //       },
// //       onError: (err) => {
// //         toast.error(
// //           err.data?.code === "UNAUTHORIZED"
// //             ? "You must be logged in to delete a post"
// //             : "Failed to delete post",
// //         );
// //       },
// //     }),
// //   );

// //   return (
// //     <div className="flex flex-row rounded-lg bg-muted p-4">
// //       <div className="flex-grow">
// //         <h2 className="text-2xl font-bold text-primary">{props.post.title}</h2>
// //         <p className="mt-2 text-sm">{props.post.content}</p>
// //       </div>
// //       <div>
// //         <Button
// //           variant="ghost"
// //           className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
// //           onClick={() => deletePost.mutate(props.post.id)}
// //         >
// //           Delete
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// // export function PostCardSkeleton(props: { pulse?: boolean }) {
// //   const { pulse = true } = props;
// //   return (
// //     <div className="flex flex-row rounded-lg bg-muted p-4">
// //       <div className="flex-grow">
// //         <h2
// //           className={cn(
// //             "w-1/4 rounded bg-primary text-2xl font-bold",
// //             pulse && "animate-pulse",
// //           )}
// //         >
// //           &nbsp;
// //         </h2>
// //         <p
// //           className={cn(
// //             "mt-2 w-1/3 rounded bg-current text-sm",
// //             pulse && "animate-pulse",
// //           )}
// //         >
// //           &nbsp;
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }
