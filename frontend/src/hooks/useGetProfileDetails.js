import { useQuery } from "@tanstack/react-query"


const useGetProfileDetails = (username) => {

    return useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {

            try {
                const res = await fetch(`/api/user/profiledetails/${username}`);

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("user profile details -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        }
    });
}

export default useGetProfileDetails;