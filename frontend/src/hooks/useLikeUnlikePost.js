import { useMutation, useQueryClient } from "@tanstack/react-query"


const useLikeUnlikePost = (postId) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {

            try {
                const res = await fetch(`/api/posts/like/${postId}`, {
                    method :'POST'
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("like unlike post data -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: (data) => {

            //this one will not give best UX bcoz it will lead to rerender of all the post by refetch the query
            // queryClient.invalidateQueries({queryKey: ["posts"]});


            //instead of invalidation , perform updation of cache data for post query result

            queryClient.setQueryData(["posts"], (oldData) => {

                return oldData.map(post => {

                    if(post._id == postId){

                        return {...post, likes: data.updatedLikes}
                    }else{
                        return post;
                    }
                });

            });
            
        }
    });
}

export default useLikeUnlikePost;