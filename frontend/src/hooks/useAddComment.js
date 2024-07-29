import { useMutation, useQueryClient } from "@tanstack/react-query"


const useAddComment = (postId) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (comment) => {

            try {
                const res = await fetch(`/api/posts/comment/${postId}`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({content: comment})
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("comment on a post -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: (updatedPost) => {

            //this one will not give best UX bcoz it will lead to rerender of all the post by refetch the query
            // queryClient.invalidateQueries({queryKey: ["posts"]});


            //instead of invalidation , perform updation of cache data for post query result

            queryClient.setQueryData(["posts"], (oldData) => {

                return oldData.map(post => {

                    if(post._id == postId){

                        return updatedPost;
                    }else{
                        return post;
                    }
                });

            });

        }
    });
}

export default useAddComment;