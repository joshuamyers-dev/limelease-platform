import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

interface User {
  id: number;
  name: string;
  email: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  const handleAddUser = (values: User) => {
    const newUser: User = {
      id: users.length + 1,
      ...values,
    };
    setUsers([...users, newUser]);
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>

      <Table dataSource={users} columns={columns} />

      <Modal title="Add User" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form onFinish={handleAddUser}>
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
    </div>
  );
};

export default ManageUsers;
