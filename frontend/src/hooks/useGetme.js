import { useQuery } from "@tanstack/react-query";


const useGetme = () => {

    return useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();

                //resolve the issue for logout functionality
                if(data.error) return null;

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUserData is here -> ", data);
				return data;
			} catch (error) {
                console.log(error.message);
				throw new Error(error.message);
			}
		},
        retry: false,
	});
}

export default useGetme;