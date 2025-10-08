import FollowersList from '../Components/FollowerList';
import FollowingList from '../Components/FollowingUsers';
import { useParams } from 'react-router-dom';

const FollowDetails = () => {
  const { userId } = useParams(); // <-- Move this inside the component
  return (
    <div style={{ padding: 24 }}>
      <h2>Followers</h2>
      {/* <FollowersList userId={userId} /> */}
      
    </div>
  );
};

export default FollowDetails;
