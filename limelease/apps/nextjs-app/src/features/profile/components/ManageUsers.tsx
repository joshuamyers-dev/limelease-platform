import React, { useCallback, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, Card, Row, Col, Select } from 'antd';
import { styled } from 'styled-components';
import { useFetchPropertiesQuery, useMyTeamQuery } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { formatSnakeCase, renderAddressLabel, toProperCase } from '@utils/Helpers';
import { EMAIL_ADDRESS_FIELD_RULES, PHONE_NUMBER_FIELD_RULES } from '@features/properties/createProperty/helpers/Constants';
import { useDebounce } from '@hooks/useDebounce';
import AddTeamMemberForm from './AddTeamMemberForm';
interface User {
  id: number;
  name: string;
  email: string;
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email Address', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Assigned Properties', dataIndex: 'properties', key: 'properties', render: (title, _) => `${title}` },
];

const ManageUsers: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState<Maybe<string>>(null);

  const { data: myTeamData, loading: isLoadingTeam } = useMyTeamQuery({
    variables: {
      first: 10,
      searchTerm,
    },
    fetchPolicy: 'cache-and-network',
  });

  const data = useMemo(() => {
    return myTeamData?.myTeam?.edges
      ?.map((edge) => edge?.node)
      .map((node, index) => {
        return {
          key: index,
          name: node?.user.profile.firstName + ' ' + node?.user.profile.lastName,
          email: node?.user.profile.email,
          role: formatSnakeCase(node?.role),
          properties: node?.properties?.map((property) => renderAddressLabel(property?.address, false)),
        };
      });
  }, [myTeamData]);

  return (
    <Card>
      <AddAgentContainer>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Team Member
        </Button>
      </AddAgentContainer>

      <Modal title="" open={isModalVisible} destroyOnClose onCancel={() => setIsModalVisible(false)} footer={null}>
        {isModalVisible && <AddTeamMemberForm onComplete={() => setIsModalVisible(false)} />}
      </Modal>

      <Table loading={isLoadingTeam} dataSource={data} columns={columns} pagination={false} />
    </Card>
  );
};

const AddAgentContainer = styled.div`
  float: right;
  margin-bottom: 20px;
`;

export default ManageUsers;
