import { useMeQuery } from '@graphql/generated';
import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Card, Avatar, Badge, Divider, Segmented } from 'antd';
import { CardTitleText } from '@components/Headings';
import styled from 'styled-components';
import { EditFilled } from '@ant-design/icons';
import { Colours } from '@utils/Colours';
import EditAvatar from '../components/EditAvatar';
import { AnimatedContainer } from '@components/AnimatedContainer';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { AnimatePresence } from 'framer-motion';
import UpdateDetails from '../components/UpdateDetails';
import { SegmentedValue } from 'antd/es/segmented';
import ManageUsers from '../components/ManageUsers';

const UPDATE_DETAILS_SEGMENT = 'Update Profile';
const MANAGE_USERS_SEGMENT = 'Manage Team';
const SETTINGS_SEGMENT = 'Settings';

const ProfileContainer = () => {
  const { data: meData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const [selectedSegment, setSelectedSegment] = useState<SegmentedValue>(UPDATE_DETAILS_SEGMENT);

  return (
    <ProfileWrapper>
      <AnimatedContainer {...cardAnimationProps}>
        <NamePhotoContainer>
          <EditAvatar />
          <ProfilePrimaryDetails>
            <CardTitleText>
              {meData?.me?.firstName} {meData?.me?.lastName}
            </CardTitleText>
            <CompanyNameText>Property Manager &middot; {meData?.me?.agency?.name}</CompanyNameText>
          </ProfilePrimaryDetails>
        </NamePhotoContainer>

        <Divider />

        <SegmentedContainer>
          <Segmented
            value={selectedSegment}
            options={[UPDATE_DETAILS_SEGMENT, MANAGE_USERS_SEGMENT, SETTINGS_SEGMENT]}
            onChange={setSelectedSegment}
            size="small"
          />
        </SegmentedContainer>

        {selectedSegment === UPDATE_DETAILS_SEGMENT && <UpdateDetails />}
        {selectedSegment === MANAGE_USERS_SEGMENT && <ManageUsers />}
      </AnimatedContainer>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  width: 80%;
  margin: 20px auto;
`;

const NamePhotoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SegmentedContainer = styled.div`
  margin-top: 20px;
`;

const CompanyNameText = styled.div`
  color: ${Colours.GRAY_8};
  font-size: 16px;
  font-weight: 600;
  padding-top: 2px;
`;

const ProfilePrimaryDetails = styled.div`
  padding-left: 16px;
`;

export default ProfileContainer;
