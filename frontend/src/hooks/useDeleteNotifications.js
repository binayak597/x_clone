import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


const useDeleteNotifications = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {

            try {
                const res = await fetch("/api/notifications", {
                    method: 'DELETE'
                });

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("delete notifications data -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        },
        onSuccess: () => {

            toast.success("Notifications are deleted successfully");
            queryClient.invalidateQueries({queryKey: ["notifications"]});
        }
    });
}

export default useDeleteNotifications;