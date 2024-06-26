import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Form, Row, Col, Input, Select, Button } from 'antd';
import { useFetchPropertiesQuery } from '@graphql/generated';
import { renderAddressLabel } from '@utils/Helpers';
import { Maybe } from '@types/Maybe';
import { useDebounce } from '@hooks/useDebounce';
import { EMAIL_ADDRESS_FIELD_RULES, PHONE_NUMBER_FIELD_RULES } from '@features/properties/createProperty/helpers/Constants';
import { Heading3 } from '@components/Headings';

interface AddTeamMemberFormProps {}

const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({}) => {
  const [searchTerm, setSearchTerm] = useState<Maybe<string>>('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const onSearchProperties = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: myPropertiesData,
    loading: isLoadingProperties,
    fetchMore: fetchMoreProperties,
  } = useFetchPropertiesQuery({
    variables: {
      first: 10,
      searchKeywords: debouncedSearchTerm,
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (myPropertiesData?.myProperties) {
      const options = myPropertiesData?.myProperties?.edges
        ?.map((edge) => edge?.node)
        .mapNotNull((edge) => edge)
        .map((node) => {
          return {
            label: renderAddressLabel(node.address, true),
            value: node.id,
          };
        });

      setDropdownOptions(options);
    }
  }, [myPropertiesData]);

  const onScrollSelectDropdown = useCallback(() => {
    if (myPropertiesData?.myProperties?.pageInfo.hasNextPage) {
      fetchMoreProperties({
        variables: {
          first: 10,
          after: myPropertiesData?.myProperties?.pageInfo.endCursor,
        },
      });
    }
  }, [myPropertiesData?.myProperties?.pageInfo.hasNextPage, myPropertiesData?.myProperties?.pageInfo.endCursor]);

  return (
    <>
      <Heading3 style={{ textAlign: 'center' }}>New Team Member</Heading3>
      <Form layout="vertical" requiredMark={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter a first name.' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter a last name.' }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Email" name="email" rules={EMAIL_ADDRESS_FIELD_RULES}>
          <Input placeholder="jim@jimscleaning.com.au" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNumber" rules={PHONE_NUMBER_FIELD_RULES}>
          <Input placeholder="0411 111 111" />
        </Form.Item>

        <Form.Item label="Assigned Properties" name="AssignedProperties" rules={[{ required: true, message: 'A property must be selected.' }]}>
          <Select
            mode="multiple"
            placeholder="Please select"
            loading={isLoadingProperties}
            filterOption={false}
            onSearch={onSearchProperties}
            options={dropdownOptions}
            onPopupScroll={onScrollSelectDropdown}
          />
        </Form.Item>

        <Row>
          <Col span={12}>
            <Button type="link">Cancel</Button>
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" size="large" htmlType="submit">
              Add Team Member
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddTeamMemberForm;
