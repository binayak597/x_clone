import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import useGetPosts from "../../hooks/useGetPosts";
import { useEffect } from "react";

const Posts = ({feedType}) => {

	//get endpoint for network call
	const getEndPoint = () => {

		switch(feedType) {

			case "forYou": 
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			default: 
				return "api/posts/all";
		}
	}

	const GET_ENDPOINT = getEndPoint();

	const {data: posts, isLoading, isFetching, refetch} = useGetPosts(GET_ENDPOINT);

	//react-query doesnot work on rerendering part
	//thats why it is not triggering the useQuery hook by default
	//so for manual trigger using refetch method

	useEffect(() => {

		refetch();
	}, [feedType, refetch]);

	return (
		<>
			{isLoading && isFetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isFetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isFetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;