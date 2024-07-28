import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


const useCreatePost = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({text, img}) => {

            try {
                const res = await fetch("/api/posts/create", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({content: text, postImg: img})
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "somthing went wrong");

                console.log("create post data -> ", data);
                return data;

            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        },

        onSuccess: () => {

            toast.success("post created successfully");
            queryClient.invalidateQueries({queryKey: ["posts"]});
        }
    });
}

export default useCreatePost;