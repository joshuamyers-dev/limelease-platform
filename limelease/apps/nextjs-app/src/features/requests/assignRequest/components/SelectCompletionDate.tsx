import { AnimatedContainer } from '@components/AnimatedContainer';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { DatePicker, Form, Input } from 'antd';

import { Dayjs } from 'dayjs';
import React, { useCallback, useContext, useEffect } from 'react';

const SelectCompletionDate: React.FC = () => {
  const [form] = Form.useForm();
  const context = useContext(RequestDetailsContext);

  const onSelectStartDate = useCallback((date: Dayjs, dateString: string) => {
    context?.setStartDate(date);
    form.setFieldsValue({ endDate: date });
  }, []);

  const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    context?.setDescription(e.target.value);
  }, []);

  const onSelectEndDate = useCallback((date: Dayjs, dateString: string) => {
    context?.setEndDate(date);
  }, []);

  useEffect(() => {
    if (context?.description) {
      form.setFieldsValue({ description: context?.description });
    }

    if (context?.startDate && context?.endDate) {
      form.setFieldsValue({ startDate: context?.startDate, endDate: context?.endDate });
    }
  }, [context?.startDate, context?.endDate, context?.description]);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      <Form layout="vertical" form={form}>
        <Form.Item label="Job Description" name="description">
          <Input placeholder="e.g. Attend the property and quote the repair" onChange={onChangeDescription} />
        </Form.Item>
        <Form.Item label="Booking Start Date" name="startDate">
          <DatePicker showTime={{ format: 'h:mm A' }} format="DD/MM/YYYY h:mm A" onChange={onSelectStartDate} />
        </Form.Item>
        <Form.Item label="Booking End Date" name="endDate">
          <DatePicker showTime={{ format: 'h:mm A' }} format="DD/MM/YYYY h:mm A" onChange={onSelectEndDate} />
        </Form.Item>
      </Form>
    </AnimatedContainer>
  );
};

export default SelectCompletionDate;
