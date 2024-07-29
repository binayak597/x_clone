import { useQuery } from "@tanstack/react-query"


const useGetNotifications = () => {

    return useQuery({

        queryKey: ["notifications"],
        queryFn: async () => {

            try {
                const res = await fetch(`api/notifications`);

                const data = await res.json();

                if(!res.ok || data.error) throw new Error(data.error || "something went wrong");

                console.log("notifications are -> ", data);
                return data;
            } catch (error) {
                
                console.log(error.message);
                throw new Error(error.message);
            }
        }
    });
}

export default useGetNotifications;