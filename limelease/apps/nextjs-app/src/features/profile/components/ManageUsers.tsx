import React, { useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, Card } from 'antd';
import { styled } from 'styled-components';
import { useMyTeamQuery } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { formatSnakeCase, toProperCase } from '@utils/Helpers';
interface User {
  id: number;
  name: string;
  email: string;
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email Address', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Assigned Properties', dataIndex: 'properties', key: 'properties' },
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
          name: node?.user.firstName + ' ' + node?.user.lastName,
          email: node?.user.email,
          role: formatSnakeCase(node?.role),
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

      <Table dataSource={data} columns={columns} />

      <Modal title="Add User" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

const AddAgentContainer = styled.div`
  float: right;
  margin-bottom: 20px;
`;

export default ManageUsers;
