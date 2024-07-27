import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSignout = () => {

    const queryClient = useQueryClient();

    return useMutation({

		mutationFn: async () => {

			try {
				const res = await fetch("/api/auth/signout", {
					method: 'POST'
				});

				const data = await res.json();

				if(!res.ok || data.error) throw new Error(data.error);

				console.log(data);
				return data;
			} catch (error) {
				
				console.log(error.message);
				throw new Error(error.message);
			}
		},
		onSuccess: () => {

			toast.success("Logout successful!");
			
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
		onError: () => {

			toast.error("Logout failed!");
		}
	});
}

export default useSignout;