import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts } from "../store/fileThunks";
import { Container, PostCard } from "../Components";

function MyPosts() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const { userPosts = [], fetchStatus, error } = useSelector((state) => state.file);
    const { status: isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userData?.$id) {
            dispatch(fetchUserPosts(userData.$id));
        }
        
        
    }, [userData,dispatch]);

    if (!isAuthenticated) {
        return <div className="w-full py-16 text-center text-red-600 font-bold">Access Denied: Please log in to view your posts.</div>;
    }

    return (
        <div className="w-full py-8">
            <Container>
                <h1 className="text-2xl font-bold mb-4">My Posts</h1>
                {fetchStatus === "loading" && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex flex-wrap">
                    {userPosts.length === 0 && fetchStatus === "succeeded" ? (
                        <p>No posts found.</p>
                    ) : (
                        userPosts.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
}

export default MyPosts;