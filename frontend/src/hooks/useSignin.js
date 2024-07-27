import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSignin = () => {

    const queryClient = useQueryClient();

    return useMutation({

		mutationFn: async ({userName, password}) => {

			try {
				const res = await fetch ("/api/auth/signin", {

					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({userName, password})
				});

				const data = await res.json();

				if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

				console.log("signin data -> ", data);
				return data;
			} catch (error) {
				console.log(error.message);
				throw new Error(error.message);
			}
		}, 
		onSuccess: () => {

			toast.success("Login Sucessfull!");

			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
		onError: () => {

			toast.error("Login Failed!");
		}
	});
}

export default useSignin;