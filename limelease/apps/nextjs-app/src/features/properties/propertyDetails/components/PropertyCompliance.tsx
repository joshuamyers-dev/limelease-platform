import {
  CheckOutlined,
  DownOutlined,
  EllipsisOutlined,
  FileOutlined,
  MonitorOutlined,
  PaperClipOutlined,
  PropertySafetyOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { AnimatedContainer } from '@components/AnimatedContainer';
import UrgencyTag from '@components/UrgencyTag';
import { Lease, Tenant } from '@graphql/generated';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { formatMobileNumber } from '@utils/Helpers';
import { Badge, Button, Col, Divider, Row, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

interface PropertyComplianceProps {
  leaseDetails: Lease;
  tenants: Tenant[];
}

interface DataType {
  key: string;
  title: string;
  frequency: string;
  dueDate: string;
  type: string;
  actions: any[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Task',
    dataIndex: 'task',
    key: 'task',
    render: (title, _) => <Button type="link">{title}</Button>,
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
  },
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
    render: (type, record) => {
      if (type === 'recommended') {
        return (
          <Tag color={Colours.ORANGE_LIGHT} icon={<StarOutlined />} style={{ color: Colours.ORANGE_DARK }}>
            Recommended checks
          </Tag>
        );
      } else if (type === 'compliance') {
        return (
          <Tag color={Colours.LIGHT_RED} icon={<SafetyCertificateOutlined />} style={{ color: Colours.ORANGE_DARK }}>
            Compliance
          </Tag>
        );
      } else if (type === 'routine') {
        return (
          <Tag color={Colours.GRAY_3} icon={<MonitorOutlined />} style={{ color: Colours.GRAY_8 }}>
            Routine & Maintenance
          </Tag>
        );
      }
    },
  },
  {
    title: 'Actions',
    key: 'complete',
    render: (_, record) => (
      <Row>
        <Col flex="auto">
          <Button type="link" icon={<CheckOutlined />}>
            Mark as Complete
          </Button>
        </Col>
        <Col>
          <Button type="link" icon={<EllipsisOutlined />} />
        </Col>
      </Row>
    ),
  },
];

const data = [
  {
    key: '1',
    task: 'Biennial gas safety inspection',
    frequency: 'Every 2 years',
    dueDate: '6 May 2024',
    type: 'compliance',
    actions: [],
  },
  {
    key: '2',
    task: 'Biennial electrical safety inspection',
    frequency: 'Every 2 years',
    dueDate: '6 May 2024',
    type: 'compliance',
  },
  {
    key: '3',
    task: 'Annual smoke alarm inspection',
    frequency: 'Every year',
    dueDate: '6 May 2024',
    type: 'compliance',
  },
  {
    key: '4',
    task: 'Biennial lock & security device inspection',
    frequency: 'Every 2 years',
    dueDate: '6 May 2024',
    type: 'compliance',
  },
  {
    key: '5',
    task: '6 Month Inspection',
    frequency: 'Every 6 months',
    dueDate: '6 May 2024',
    type: 'routine',
  },
  {
    key: '6',
    task: 'Mould, pest & vermin',
    frequency: 'Every 2 years',
    dueDate: '29/03/2023',
    type: 'recommended',
  },
  {
    key: '7',
    task: 'Window, cord & balcony safety checks',
    frequency: 'Every 2 years',
    dueDate: '29/03/2023',
    type: 'recommended',
  },
  {
    key: '8',
    task: 'Swimming Pool - Certificate of Property Compliance',
    frequency: 'Every 2 years',
    dueDate: '29/03/2023',
    type: 'recommended',
  },
];

const sections = ['Due Today', 'Upcoming', 'Later'];

const PropertyCompliance: React.FC<PropertyComplianceProps> = ({ leaseDetails, tenants }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(sections[0]);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      {sections.map((section) => {
        return (
          <SectionContainer layout>
            <SectionTitleRow
              layout
              onClick={() => {
                setSelectedSection(section);
              }}
            >
              <SectionTitle>
                {section}
                <Badge showZero count={2} color={Colours.NAVY} style={{ marginLeft: '5px' }} />
              </SectionTitle>
              <Button type="link" icon={selectedSection === section ? <UpOutlined /> : <DownOutlined />} />
            </SectionTitleRow>

            <AnimatePresence mode="wait">
              {selectedSection === section && (
                <AnimatedContainer key={section} {...fadeInOutProps} style={{ height: 150 }}>
                  <Table
                    columns={columns}
                    dataSource={data.slice(3, 5)}
                    // loading={isFetching}
                    size="middle"
                    pagination={false}
                    // rowSelection={rowSelection}
                    // onRow={(record, rowIndex) => {
                    //   return {
                    //     onClick: () => onClickRow(record),
                    //   };
                    // }}
                  />
                </AnimatedContainer>
              )}
            </AnimatePresence>
          </SectionContainer>
        );
      })}
    </AnimatedContainer>
  );
};

const SectionContainer = styled(motion.div)`
  margin-bottom: 24px;
`;

const SectionTitleRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  color: ${Colours.NAVY};
  font-family: Figtree;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
`;

export default PropertyCompliance;
