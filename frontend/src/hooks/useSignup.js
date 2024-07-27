import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const useSignup = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async ({email, userName, fullName, password}) => {

            try {
                const res = await fetch("/api/auth/signup", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, userName, fullName, password})
                });

                const data = await res.json();
                if(!res.ok || data.error) throw new Error(data.error);

                console.log("signup data -> ", data);
                return data;

            } catch (error) {
                console.log(error.message);
                throw new Error(error.message);
            }
        },

        onSuccess: () => {

            toast.success("Registered Successfully!");
			queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
        onError: () => {

            toast.error("Registration failed!");
        }
    });
}


export default useSignup;