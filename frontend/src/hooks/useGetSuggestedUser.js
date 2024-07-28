import { useQuery } from "@tanstack/react-query"


const useGetSuggestedUser = () => {

    return useQuery({
        queryKey: ["suggestedUser"],
        queryFn: async () => {

            try {
                const res = await fetch("/api/user/suggested");

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("suggested users -> ", data);

                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        }
    });
}

export default useGetSuggestedUser;