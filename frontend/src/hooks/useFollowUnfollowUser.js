import { useMutation, useQueryClient } from "@tanstack/react-query"


const useFollowUnfollowUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {

            try {
                const res = await fetch(`/api/user/follow/${userId}`, {
                    method: 'POST'
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("follow unfollow user data -> ", data);
                return data;
            } catch (error) {

                console.log(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: () => {

            //parallel execution
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["suggestedUser"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]})
            ]);
        }
    });
}

export default useFollowUnfollowUser;