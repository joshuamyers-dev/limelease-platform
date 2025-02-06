import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Affix, Avatar, Badge, Button, Divider, Dropdown, FloatButton, Layout, Menu } from 'antd';

import type { MenuProps } from 'antd';
import styled from 'styled-components';

import {
  ContactsOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  DownOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileSearchOutlined,
  HomeOutlined,
  InteractionOutlined,
  ManOutlined,
  NotificationOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SolutionOutlined,
  ToolOutlined,
  UpOutlined,
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
import { AnimatePresence, motion } from 'framer-motion';
import { CardTitleText } from '@components/Headings';

const { Header, Content, Footer, Sider } = Layout;

export interface DashboardContainerProps {
  children: ReactNode;
}

const menuItems: MenuProps['items'] = [
  {
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    key: 'dashboard',
  },
  {
    label: 'Properties',
    icon: <HomeOutlined />,
    key: 'properties',
  },
  {
    label: 'Requests',
    icon: <SolutionOutlined />,
    key: 'requests',
  },
  {
    label: 'Trades',
    icon: <ToolOutlined />,
    key: 'contractors',
  },
  {
    label: 'Financial',
    icon: <DollarCircleOutlined />,
    key: 'financial',
  },
  {
    label: 'Inspections',
    icon: <EyeOutlined />,
    key: 'inspections',
  },
  {
    label: 'Safety & Compliance',
    icon: <SafetyOutlined />,
    key: 'safety',
  },
];

const userMenuItems: MenuProps['items'] = [
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

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data: userData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const onClickMenuItem = ({ key }: { key: string }) => {
    router.push(`/${key}`);
  };

  const currentMenuItem = useMemo(() => {
    const currentPath = router.asPath.replace('/', '');
    const menuItem = menuItems.concat(userMenuItems).find((item) => {
      const key = item?.key as string;
      return currentPath.includes(key);
    });
    return menuItem?.key;
  }, [router]);

  const userMenu = <Menu onClick={onClickMenuItem} items={userMenuItems} />;

  return (
    <StyledLayout>
      {userData?.me && <IntercomWrapper user={userData.me} />}
      <StyledSider>
        <StyledMenu onClick={onClickMenuItem} theme="light" mode="inline" selectedKeys={[currentMenuItem]} items={menuItems} />
      </StyledSider>
      <Layout>
        <StyledHeader>
          <HeaderWrapper>
            <LogoContainer onClick={() => onClickMenuItem({ key: 'properties' })}>
              <Image src={logo} width={110} height={28} priority />
            </LogoContainer>

            <UserInfoContainer
              onClick={() => router.push('/profile')}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <Avatar icon={<UserOutlined />} />
              <UserDetails>
                <UserName>
                  {userData?.me?.profile.firstName} {userData?.me?.profile?.lastName}
                </UserName>
                <AgencyName>{userData?.me?.agency?.name}</AgencyName>
              </UserDetails>
            </UserInfoContainer>

            <AnimatePresence>
              {dropdownVisible && (
                <NotificationsDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setDropdownVisible(true)}
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                  <Caret />
                  <NotificationTitleWrapper>
                    <CardTitleText>Notifications</CardTitleText>
                    <Badge count={4} color={Colours.NAVY}></Badge>
                  </NotificationTitleWrapper>
                  <NotificationRow>
                    <IconCircleWrapper>
                      <NotificationOutlined />
                    </IconCircleWrapper>
                    <div>
                      <NotificationTitle>New request</NotificationTitle>
                      <NotificationDescription>You have a new request for 5 Apollo Rd Taylors Lakes.</NotificationDescription>
                    </div>
                    <Button type="link">View</Button>
                  </NotificationRow>
                  <Divider />
                  <NotificationRow>
                    <IconCircleWrapper>
                      <NotificationOutlined />
                    </IconCircleWrapper>
                    <div>
                      <NotificationTitle>New request</NotificationTitle>
                      <NotificationDescription>You have a new request for 5 Apollo Rd Taylors Lakes.</NotificationDescription>
                    </div>
                    <Button type="link">View</Button>
                  </NotificationRow>
                </NotificationsDropdown>
              )}
            </AnimatePresence>
          </HeaderWrapper>
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </Layout>
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
  min-height: 100%;
  background: #fafafa !important;

  .ant-layout-header {
    padding: 0 32px;
  }
`;

const StyledSider = styled(Sider)`
  background: white !important;
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.04);
  position: fixed !important;
  min-width: 250px !important;
  border-right: 0 !important;
  z-index: 10;
  padding-top: 120px;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
`;

const UpWrapper = styled.div`
  padding-left: 16px;
`;

const LogoContainer = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  align-self: center;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  line-height: 16px;
`;

const UserDetails = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-family: Figtree;
  font-size: 15px;
  font-weight: bold;
  padding: 0;
`;

const AgencyName = styled.span`
  font-family: Figtree;
  font-size: 14px;
  color: ${Colours.GRAY_7};
`;

const StyledHeader = styled(Header)`
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.04);
  background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const StyledContent = styled(Content)`
  margin-left: 250px;
  padding: 42px;

  @media ${deviceSize.mobile} {
    padding: 0;
  }
`;

const StyledMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: #2d22fb14;
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

const NotificationsDropdown = styled(motion.div)`
  background-color: white;
  position: absolute;
  right: 24px;
  top: 75px;
  width: 400px;
  padding: 16px;
  border-radius: 8px;
  z-index: 10;
  align-items: center;
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.04);
`;

const NotificationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  border-radius: 8px;
  line-height: 24px;
`;

const IconCircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d22fb14;
  border-radius: 50%;
  padding: 12px;
`;

const NotificationTitle = styled.div`
  font-family: Figtree;
  font-size: 16px;
  font-weight: 500;
`;

const NotificationDescription = styled.div`
  font-family: Figtree;
  font-size: 15px;
  color: ${Colours.GRAY_7};
`;

const Caret = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
`;

const NotificationTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export default DashboardContainer;
