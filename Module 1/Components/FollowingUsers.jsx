import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchFollowing } from '../store/BackendConfig/userFollowSlice';
import { useParams } from 'react-router-dom';
const FollowingUsers = ({ userId }) => {
  const dispatch = useDispatch();
  const following = useSelector(state => state.follow.following);
  console.log("Following data:", following);
  const loading = useSelector(state => state.follow.loading);
  const sessionId = useSelector((state) => state.auth.sessionId);
  const { Id } = useParams();
  const targetUserId = Id;
  
  // Use userId prop if provided, otherwise use the userId from URL params
  const actualUserId = userId || targetUserId;
  
  useEffect(() => {
    if (actualUserId) {
      dispatch(fetchFollowing({ userId: actualUserId, sessionId }));
    }
  }, [actualUserId, sessionId, dispatch]);

  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {following.map((user, idx) => (
        <li key={user._id || idx}>{JSON.stringify(user)}</li>
      ))}
    </ul>
  );
};

export default FollowingUsers;
