import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


const useDeletePost = (postId) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {

            try {
                
                const res = await fetch(`/api/posts/delete/${postId}`, {

                    method: 'DELETE'
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("delete post data -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        }, 
        onSuccess: () => {

            toast.success("post deleted successfully!");
            queryClient.invalidateQueries({queryKey: ["posts"]});
        }
    });
}

export default useDeletePost;