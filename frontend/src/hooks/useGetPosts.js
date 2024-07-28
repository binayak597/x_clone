import { useQuery } from "@tanstack/react-query"


const useGetPosts = (endpoint) => {

    return useQuery({

        queryKey: ["posts"],
        queryFn: async () => {

            try {
                const res = await fetch(endpoint);

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("posts data -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        }
    });
}

export default useGetPosts;