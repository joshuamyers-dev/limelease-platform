import React, { FC } from 'react';

import { Breadcrumb, Layout, Menu } from 'antd';
import DashboardContainer from '../../containers/DashboardContainer';

const { Header, Content, Footer } = Layout;

export interface DashboardProps {}

const Dashboard: FC = (props: DashboardProps) => {
  return (
    <DashboardContainer>
      <div>yo</div>
    </DashboardContainer>
  );
};

export default Dashboard;
