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

const ProfileContainer = () => {
  const { data: meData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const [selectedSegment, setSelectedSegment] = useState<SegmentedValue>('Update Details');

  return (
    <>
      <AnimatedContainer {...cardAnimationProps}>
        <Card>
          <NamePhotoContainer>
            <EditAvatar />
            <ProfilePrimaryDetails>
              <CardTitleText>
                {meData?.me?.firstName} {meData?.me?.lastName}
              </CardTitleText>
              <CompanyNameText>Property Manager &middot; {meData?.me?.agency?.name}</CompanyNameText>
            </ProfilePrimaryDetails>
          </NamePhotoContainer>
          <SegmentedContainer>
            <Segmented value={selectedSegment} options={['Update Details', 'Manage Users', 'Settings']} onChange={setSelectedSegment} size="small" />
          </SegmentedContainer>

          {selectedSegment === 'Update'}
        </Card>
      </AnimatedContainer>
    </>
  );
};

const NamePhotoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SegmentedContainer = styled.div`
  margin-top: 56px;
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
