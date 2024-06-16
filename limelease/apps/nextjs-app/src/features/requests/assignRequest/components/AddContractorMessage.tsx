import React, { useContext, useCallback, useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@components/AnimatedContainer';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { useMeQuery } from '@graphql/generated';
import { renderAddressLabel } from '@utils/Helpers';
import dayjs from 'dayjs';

const { TextArea } = Input;

const AddContractorMessage: React.FC = () => {
  const context = useContext(RequestDetailsContext);
  const { data: userData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const onMessageChange = useCallback((e) => {
    context?.setContractorMessage(e.target.value);
  }, []);

  const contractorName = context?.selectedContractor?.businessName;
  const agencyName = userData?.me.agency?.name;

  const bookingDate = useMemo(() => {
    const start = dayjs(context?.startDate);
    const end = dayjs(context?.endDate);

    if (start.isSame(end, 'day')) {
      return `${start.format('DD/MM/YYYY hh:mma')} - ${end.format('hh:mma')}`;
    } else {
      return `${start.format('DD/MM/YYYY hh:mma')} - ${end.format('DD/MM/YYYY hh:mma')}`;
    }
  }, [context?.startDate, context?.endDate]);

  const placeholderText = useMemo(() => {
    const tenantOrManager = context?.request?.tenant ? 'Tenant' : 'Property Manager';
    const tenantNameOrManagerName = context?.request?.tenant
      ? `${context?.request?.tenant?.firstName} ${context.request.tenant.lastName}`
      : userData?.me?.email;

    return (
      `G'day, ${contractorName}.\n\nYou have a new residential job request from ${agencyName}.\n\n` +
      `Address: ${renderAddressLabel(context?.request?.property.address, true)}.\n` +
      `Job Description: ${context?.description}\n` +
      `Tenant Noted: ${context?.request?.details}\n` +
      `Booked for: ${bookingDate}\n` +
      `Ticket Number: #${context?.request?.ticketNumber}\n` +
      `Requested by: Joshua Nissenbaum (${tenantOrManager})\n\n` +
      `Please reply "YES" to accept this job request or "NO" to decline.`
    );
  }, [contractorName, agencyName, bookingDate, context?.request]);

  useEffect(() => {
    context?.setContractorMessage(placeholderText);
  }, [placeholderText]);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      <MessageContainer>
        <Form layout="vertical">
          <Form.Item label="Message to Contractor:">
            <StyledTextArea placeholder={placeholderText} value={placeholderText} onChange={onMessageChange} />
          </Form.Item>
        </Form>
      </MessageContainer>
    </AnimatedContainer>
  );
};

const MessageContainer = styled(motion.div)`
  margin-top: 16px;
`;

const StyledTextArea = styled(TextArea)`
  && {
    width: 100%;
    min-height: 277px;
    resize: none;

    ::placeholder {
      color: #8c8c8c;
    }
  }
`;

export default AddContractorMessage;
