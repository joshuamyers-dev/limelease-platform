import React from 'react';
import { Avatar, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface EditAvatarProps {
  avatarUrl: string;
  onEditClick: () => void;
}

const EditAvatar: React.FC<EditAvatarProps> = ({ avatarUrl, onEditClick }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar size={80} src={avatarUrl} />
      <Button
        type="text"
        shape="circle"
        icon={<EditOutlined />}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          background: 'rgba(186, 230, 55, 1.0)',
          color: 'black',
        }}
        onClick={onEditClick}
      />
    </div>
  );
};

export default EditAvatar;
