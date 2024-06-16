import { AnimatedContainer } from '@components/AnimatedContainer';
import { CreateContractorFormValues } from '@features/contractors/createContractor/components/GeneralInformationForm';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { formatMobileNumber } from '@utils/Helpers';
import { Card } from 'antd';

import styled from 'styled-components';

interface ContractorDetailsProps extends CreateContractorFormValues {}

const ContractorDetails: React.FC<ContractorDetailsProps> = ({ businessName, areasServed, contactEmail, contactNumber, websiteUrl }) => {
  return (
    <AnimatedContainer {...cardAnimationProps}>
      <StyledCard>
        <CardTitle>{businessName}</CardTitle>

        <DetailRow>
          <DetailRowTitle>Website</DetailRowTitle>
          <DetailRowValue>
            <a href={websiteUrl} target="_blank">
              {websiteUrl}
            </a>
          </DetailRowValue>
        </DetailRow>
        <DetailRow>
          <DetailRowTitle>Contact Email</DetailRowTitle>
          <DetailRowValue>
            <a href={`mailto:${contactEmail}`} target="_blank">
              {contactEmail}
            </a>
          </DetailRowValue>
        </DetailRow>
        <DetailRow>
          <DetailRowTitle>Contact Number</DetailRowTitle>
          <DetailRowValue>{formatMobileNumber(contactNumber)}</DetailRowValue>
        </DetailRow>
        <DetailRow>
          <DetailRowTitle>Areas served</DetailRowTitle>
          <DetailRowValue>{areasServed?.map((area, index) => `${area}${index !== areasServed.length - 1 ? ', ' : ''}`)}</DetailRowValue>
        </DetailRow>
      </StyledCard>
    </AnimatedContainer>
  );
};

const StyledCard = styled(Card)`
  margin-top: 24px;
`;

const CardTitle = styled.div`
  color: #262626;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const DetailRowTitle = styled.div`
  color: #8c8c8c;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  width: 160px;
`;

const DetailRowValue = styled.div`
  color: #262626;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;

export default ContractorDetails;
