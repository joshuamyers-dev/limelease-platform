import { AnimatedContainer } from '@components/AnimatedContainer';
import { CardTitleText } from '@components/Headings';
import StatusTag from '@components/StatusTag';
import UrgencyTag from '@components/UrgencyTag';
import { Maybe, PropertyRequest, PropertyRequestUrgency, useMeQuery } from '@graphql/generated';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { renderAddressLabel } from '@utils/Helpers';
import { Card, Divider } from 'antd';
import styled from 'styled-components';
import UrgentMatterAlert from './UrgentMatterAlert';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useContext, useMemo } from 'react';
import { dayjs } from '@utils/DayjsTimezone';
import { DEVICE_TIMEZONE } from '@utils/Constants';
import { RequestDetailsContext } from '../containers/RequestDetailsContainer';
import { deviceSize } from '@utils/DeviceSizes';
import dynamic from 'next/dynamic';

// Split Client Components
const RequestActionsDropdown = dynamic(() => import('./RequestActionsDropdown'));
const RequestDetailPhotos = dynamic(() => import('./RequestDetailPhotos'));
const RequestDetailComments = dynamic(() => import('./RequestDetailComments'));
const RequestDetailJobs = dynamic(() => import('./RequestDetailJobs'));

interface RequestDetailsProps {
  request: Maybe<PropertyRequest> | undefined;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request }) => {
  if (!request?.property) return null;

  const context = useContext(RequestDetailsContext);

  const requestedOn = useMemo(() => {
    return dayjs(request!.insertedAt).tz(DEVICE_TIMEZONE).format('DD MMMM YYYY');
  }, [request]);

  const renderRequestedBy = useCallback(() => {
    return request?.tenant ? (
      <>
        {request?.tenant?.user.profile.firstName} {request?.tenant?.user.profile.lastName}&nbsp;
        <RoleTextHighlighted>(Tenant)</RoleTextHighlighted>
      </>
    ) : (
      'Unknown'
    );
  }, [request]);

  return (
    <Container {...cardAnimationProps}>
      <AnimatePresence>{request?.urgency === PropertyRequestUrgency.Emergency && !context?.userIsGuest && <UrgentMatterAlert />}</AnimatePresence>

      <Card>
        <CardHeaderWrapper id="requestDetails">
          <CardHeaderRow>
            <CardTitleText>{request?.title}</CardTitleText>
            <StatusContainer>
              <StatusTag status={request?.state} />
            </StatusContainer>
            {!context?.userIsGuest && <RequestActionsDropdown />}
          </CardHeaderRow>

          <CardHeaderRow style={{ marginTop: 8 }}>
            <SubHeaderItemContainer>
              <SubHeaderItemText>{requestedOn}</SubHeaderItemText>
            </SubHeaderItemContainer>
            <SubHeaderItemContainer>
              <SubHeaderItemText>{renderRequestedBy()}</SubHeaderItemText>
            </SubHeaderItemContainer>
            <SubHeaderItemContainer>
              <SubHeaderItemText>#{request?.ticketNumber}</SubHeaderItemText>
            </SubHeaderItemContainer>
          </CardHeaderRow>
        </CardHeaderWrapper>

        <CardBody>
          <RequestDetailRow>
            <RequestDetailTitle>Property</RequestDetailTitle>
            <RequestDetailDescription>{renderAddressLabel(request.property.address, true)}</RequestDetailDescription>
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailTitle>Category</RequestDetailTitle>
            <RequestDetailDescription>{request.category.name}</RequestDetailDescription>
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailTitle>Urgency</RequestDetailTitle>
            <UrgencyTag urgency={request?.urgency} />
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailTitle>Details</RequestDetailTitle>
            <RequestDetailDescription>{request?.details}</RequestDetailDescription>
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailDescription>
              <RequestDetailPhotos photos={request?.photos} />
            </RequestDetailDescription>
          </RequestDetailRow>
        </CardBody>

        {!context?.userIsGuest && (
          <>
            <Divider />
            <RequestDetailJobs requestId={request.id} />
          </>
        )}

        <Divider />

        <RequestDetailComments requestId={request.id} />
      </Card>
    </Container>
  );
};

const Container = styled(AnimatedContainer)`
  width: 80%;
  margin: 2rem auto;

  @media ${deviceSize.mobile} {
    width: 95%;
  }
`;

const StatusContainer = styled.div`
  margin-left: 8px;
  flex: 1;
`;

const CardHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CardHeaderWrapper = styled.div``;

const SubHeaderItemContainer = styled.div`
  border-right: 1px solid ${Colours.GRAY_8};
  padding-right: 16px;
  margin-left: 16px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    border-right: 0;
  }
`;

const SubHeaderItemText = styled.div`
  color: ${Colours.GRAY_10};
  font-family: Figtree;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const CardBody = styled.div`
  padding-top: 24px;
`;

const RequestDetailRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const RoleTextHighlighted = styled.span`
  color: ${Colours.GRAY_7};
  font-size: 12px;
  font-weight: 500;
`;

const RequestDetailTitle = styled.div`
  color: ${Colours.GRAY_7};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  min-width: 120px;
`;

const RequestDetailDescription = styled.div`
  color: ${Colours.GRAY_10};
  font-family: Figtree;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  width: 100%;
`;

const DescriptionHintText = styled.span`
  font-family: Figtree;
  color: ${Colours.GRAY_7};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

export default RequestDetails;
