import { AnimatedContainer } from '@components/AnimatedContainer';
import { Heading3 } from '@components/Headings';
import LoadingSpinner from '@components/LoadingSpinner';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { useSearchContractorsByNameLazyQuery } from '@graphql/generated';
import { useDebounce } from '@hooks/useDebounce';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';
import { formatMobileNumber } from '@utils/Helpers';
import { Button, Empty, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const CreateContractorStep = dynamic(() => import('../components/CreateContractorStep'));

const FindCreateContractor = () => {
  const [form] = useForm();
  const context = useContext(RequestDetailsContext);

  const [searchText, setSearchText] = useState('');
  const [isCreatingContractor, setCreatingContractor] = useState(false);

  const debouncedSearchText = useDebounce(searchText);

  const [searchContractorsQuery, { data, loading, error }] = useSearchContractorsByNameLazyQuery();

  useEffect(() => {
    if (debouncedSearchText !== '') {
      searchContractorsQuery({ variables: { name: debouncedSearchText, first: 1 }, fetchPolicy: 'cache-and-network' });
      setCreatingContractor(false);
    }
  }, [debouncedSearchText]);

  const searchResultsData = useMemo(() => {
    return data?.searchContractors?.edges?.map((edge) => edge?.node);
  }, [data]);

  useEffect(() => {
    if (searchResultsData && searchResultsData.length > 0) {
      context?.setSelectedContractor(searchResultsData[0]);
    } else {
      context?.setSelectedContractor(undefined);
    }
  }, [searchResultsData]);

  useEffect(() => {
    if (context?.selectedContractor) {
      searchContractorsQuery({ variables: { name: context?.selectedContractor?.businessName, first: 1 }, fetchPolicy: 'cache-and-network' });
    }
  }, [context?.selectedContractor?.id]);

  const onClickCantFindContractor = useCallback(() => {
    setCreatingContractor(true);
    context?.setSelectedContractor(undefined);
  }, []);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      <Form form={form} layout="vertical">
        <Form.Item label="Contractor:" style={{ marginBottom: 0 }}>
          <Input placeholder="Search" onChange={(event) => setSearchText(event.target.value)} />
        </Form.Item>
        <Button type="link" onClick={onClickCantFindContractor}>
          I can't find the contractor
        </Button>
      </Form>

      {isCreatingContractor && (
        <CreateContractorStep
          isCreatingContractor={isCreatingContractor}
          setCreatingContractor={setCreatingContractor}
          onContractorCreated={() => setCreatingContractor(false)}
        />
      )}

      {loading && <LoadingSpinner containerStyle={{ margin: 20 }} size={30} />}
      {!loading && searchResultsData?.length === 0 && <Empty description="We couldn't find any contractors matching this name." />}
      {!loading && context?.selectedContractor && (
        <ResultContainer {...fadeInOutProps} key={3}>
          <Heading3>{context?.selectedContractor?.businessName}</Heading3>
          {context?.selectedContractor?.websiteUrl && (
            <DetailRow>
              <DetailRowTitle>Website</DetailRowTitle>
              <DetailRowValue>
                <a href={context?.selectedContractor?.websiteUrl} target="_blank">
                  {context?.selectedContractor?.websiteUrl}
                </a>
              </DetailRowValue>
            </DetailRow>
          )}
          <DetailRow>
            <DetailRowTitle>Contact Email</DetailRowTitle>
            <DetailRowValue>
              <a href={`mailto:${context?.selectedContractor?.contactEmail}`} target="_blank">
                {context?.selectedContractor?.contactEmail}
              </a>
            </DetailRowValue>
          </DetailRow>
          <DetailRow>
            <DetailRowTitle>Contact Number</DetailRowTitle>
            <DetailRowValue>
              {context?.selectedContractor?.contactNumber ? formatMobileNumber(context?.selectedContractor?.contactNumber) : 'N/A'}
            </DetailRowValue>
          </DetailRow>
          <DetailRow>
            <DetailRowTitle>Areas served</DetailRowTitle>
            <DetailRowValue>
              {context?.selectedContractor?.areasServed?.map(
                (area, index) => `${area}${index !== context?.selectedContractor?.areasServed?.length - 1 ? ', ' : ''}`
              )}
            </DetailRowValue>
          </DetailRow>
        </ResultContainer>
      )}
    </AnimatedContainer>
  );
};

const ResultContainer = styled(motion.div)`
  margin-top: 24px;
  cursor: pointer;
  background-color: white;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const DetailRowTitle = styled.div`
  color: #8c8c8c;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  width: 160px;
`;

const DetailRowValue = styled.div`
  color: #262626;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;

export default FindCreateContractor;
