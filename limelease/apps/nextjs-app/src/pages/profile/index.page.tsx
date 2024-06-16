import DashboardContainer from '@containers/DashboardContainer';
import ProfileContainer from '@features/profile/containers/ProfileContainer';
import Head from 'next/head';

const ProfilePage = () => {
  return (
    <DashboardContainer>
      <ProfileContainer />
    </DashboardContainer>
  );
};

export default ProfilePage;
