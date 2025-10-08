import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchFollowers } from '../store/BackendConfig/userFollowSlice';
import { useParams } from 'react-router-dom';

const FollowersList = ({ userId }) => {
  const dispatch = useDispatch();
  const followers = useSelector(state => state.follow.followers);
  const loading = useSelector(state => state.follow.loading);
  const sessionId = useSelector((state) => state.auth.sessionId);
  const { Id } = useParams();
  const targetUserId = Id;
  
  // Use userId prop if provided, otherwise use the userId from URL params
  const actualUserId = userId || targetUserId;
  
  useEffect(() => {
    if (actualUserId) {
      console.log('Fetching followers for user:', actualUserId);
      dispatch(fetchFollowers({ userId: actualUserId, sessionId }));
    }
  }, [actualUserId, sessionId, dispatch]);

  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      1
    </ul>
  );
};

export default FollowersList;