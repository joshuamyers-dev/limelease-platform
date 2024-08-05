import { ReactNode, useEffect, useMemo } from 'react';

import { Affix, FloatButton, Layout, Menu } from 'antd';

import type { MenuProps } from 'antd';
import styled from 'styled-components';

import {
  ContactsOutlined,
  CustomerServiceOutlined,
  FileSearchOutlined,
  HomeOutlined,
  InteractionOutlined,
  ManOutlined,
  NotificationOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useMeQuery } from '@graphql/generated';
import { deviceSize } from '@utils/DeviceSizes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import logo from '../../public/images/logo.svg';
import { Colours } from '../utils/Colours';

import Intercom from '@intercom/messenger-js-sdk';
import { IntercomWrapper } from '@components/IntercomWrapper';

const { Header, Content, Footer } = Layout;

export interface DashboardContainerProps {
  children: ReactNode;
}

const menuItems: MenuProps['items'] = [
  {
    label: 'Properties',
    icon: <HomeOutlined />,
    key: 'properties',
  },
  {
    label: 'Requests',
    icon: <ProfileOutlined />,
    key: 'requests',
  },
  {
    label: 'Contractors',
    icon: <ToolOutlined />,
    key: 'contractors',
  },
];

const rightMenuItems: MenuProps['items'] = [
  {
    label: 'Notifications',
    icon: <NotificationOutlined />,
    key: 'notifications',
  },
  {
    label: 'Profile',
    icon: <UserOutlined />,
    key: 'profile',
  },
];

const DashboardContainer = ({ children }: DashboardContainerProps) => {
  const router = useRouter();

  const { data: userData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const onClickMenuItem = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  const currentMenuItem = useMemo(() => {
    const currentPath = router.asPath.replace('/', '');

    const menuItem = menuItems.concat(rightMenuItems).find((item) => {
      const key = item?.key as string;

      return currentPath.includes(key);
    });

    return menuItem?.key;
  }, [router]);

  return (
    <StyledLayout>
      {userData?.me && <IntercomWrapper user={userData.me} />}
      {userData?.me && (
        <Affix>
          <StyledHeader>
            <LogoContainer onClick={() => onClickMenuItem({ key: 'properties' })}>
              <Image src={logo} width={130} height={28} priority />
            </LogoContainer>
            <StyledMenu
              onClick={onClickMenuItem}
              theme="light"
              mode="horizontal"
              selectedKeys={[currentMenuItem]}
              items={menuItems}
              style={{ float: 'left', flex: 1, display: 'flex' }}
            />
            <StyledMenu
              theme="light"
              mode="horizontal"
              style={{ float: 'right' }}
              selectedKeys={[currentMenuItem]}
              items={rightMenuItems}
              onClick={onClickMenuItem}
            />
          </StyledHeader>
        </Affix>
      )}
      <StyledContent>{children}</StyledContent>

      {/* <FloatButton icon={<CustomerServiceOutlined />} tooltip="Support" style={{ left: 24 }} />
      <FloatButton.Group trigger="hover" type="primary" tooltip="Quick Actions" style={{ left: 92 }} icon={<InteractionOutlined />}>
        <FloatButton icon={<FileSearchOutlined />} tooltip="Visit 5 Apollo Rd, Taylors Lakes" />
        <FloatButton icon={<ToolOutlined />} tooltip="Add a New Contractor" onClick={() => router.push('/contractors/create')} />
        <FloatButton icon={<HomeOutlined />} tooltip="Add a New Property" onClick={() => router.push('/properties/create')} />
      </FloatButton.Group> */}
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
  min-height: 100%;
  padding-bottom: 50px;
  background: #fafafa !important;

  .ant-layout-header {
    display: flex;
  }
`;

const LogoContainer = styled.div`
  float: left;
  margin: 8px 24px 16px 0;
  cursor: pointer;
`;

const StyledHeader = styled(Header)`
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.04);
  background-color: white;
`;

const StyledContent = styled(Content)`
  padding: 0 50px;

  @media ${deviceSize.mobile} {
    padding: 0;
  }
`;

const StyledMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: white;
    color: ${Colours.LIME_10};
  }

  .ant-menu-item::after {
    left: 0px;
    width: 100%;
    inset-inline: 0 !important;
  }

  .ant-menu-title-content {
    font-weight: 700;
  }
`;

export default DashboardContainer;
