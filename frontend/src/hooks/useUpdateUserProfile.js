import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


const useUpdateUserProfile = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userUpdatedData) => {

            try {
                const res = await fetch("/api/user/update", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userUpdatedData)
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");
                console.log("updated user data -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: () => {

            toast.success("Profile updated successfully!");

            //parallel execution

            Promise.all([
                queryClient.invalidateQueries({queryKey: ["userProfile"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]})
            ]);
        },
        onError: (error) => {

            toast.error(error.message);
        }
    });
}

export default useUpdateUserProfile;