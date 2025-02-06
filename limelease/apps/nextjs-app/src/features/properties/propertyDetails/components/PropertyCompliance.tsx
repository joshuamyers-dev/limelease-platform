import { CheckOutlined, DownOutlined, EllipsisOutlined, MonitorOutlined, SafetyCertificateOutlined, StarOutlined, UpOutlined } from '@ant-design/icons';
import { AnimatedContainer } from '@components/AnimatedContainer';
import {
  FetchPropertyTasksDocument,
  Lease,
  PropertyTask,
  TaskType,
  Tenant,
  useFetchPropertyTasksQuery,
  useMarkTaskCompletedMutation,
} from '@graphql/generated';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { dayjs } from '@utils/DayjsTimezone';
import { Alert, Badge, Button, Col, message, notification, Row, Table, Tag } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
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

export const SECTION_DUE_TODAY = 'Due Today';
export const SECTION_UPCOMING = 'Upcoming';
export const SECTION_LATER = 'Later';

const sections = [SECTION_DUE_TODAY, SECTION_UPCOMING, SECTION_LATER];

const PropertyCompliance: React.FC<PropertyComplianceProps> = ({ leaseDetails, property }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(sections[0]);

  const {
    data: tasksData,
    loading: fetchingTasks,
    refetch,
  } = useFetchPropertyTasksQuery({
    variables: {
      propertyId: property.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [markCompletedMutation, { loading: markingComplete, error: markingCompleteError }] = useMarkTaskCompletedMutation();

  const tableData = useMemo(() => {
    return tasksData?.propertyTasks?.map((propertyTask) => {
      const frequency =
        propertyTask?.task.frequencyMonths === 24
          ? 'Every 2 years'
          : propertyTask?.task.frequencyMonths === 12
          ? 'Every year'
          : propertyTask?.task.frequencyMonths === 6
          ? 'Every 6 months'
          : `Every ${propertyTask?.task?.frequencyMonths} months`;

      return {
        key: propertyTask?.id,
        task: propertyTask?.task.name,
        frequency: frequency,
        dueDate: dayjs(propertyTask?.dueDate).format('DD MMM YYYY'),
        type: propertyTask?.task.type,
        completed: propertyTask?.completed,
      };
    });
  }, [tasksData]);

  const sortedData = useMemo(() => {
    const today = dayjs();
    const nextWeek = today.add(1, 'month');

    const dueToday = tableData?.filter((task) => dayjs(task.dueDate).isSame(today, 'day'));
    const upcoming = tableData?.filter((task) => dayjs(task.dueDate).isAfter(today) && dayjs(task.dueDate).isBefore(nextWeek));
    const later = tableData?.filter((task) => dayjs(task.dueDate).isAfter(nextWeek));

    return {
      [SECTION_DUE_TODAY]: dueToday,
      [SECTION_UPCOMING]: upcoming,
      [SECTION_LATER]: later,
    };
  }, [tableData]);

  const onClickMarkComplete = useCallback(
    async (task) => {
      await markCompletedMutation({
        variables: {
          id: task.key,
        },
        optimisticResponse: {
          __typename: 'RootMutationType',
          propertyTaskMarkCompleted: {
            __typename: 'PropertyTask',
            id: task.key,
            completed: true,
            dueDate: task.dueDate,
            task: undefined,
          },
        },
      });

      notification.success({
        message: `${task.task} completed.`,
        showProgress: true,
        placement: 'top',
        closable: true,
      });

      setTimeout(async () => {
        await refetch();
      }, 2000);
    },
    [tableData]
  );

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (title, record) => (
        <Button type="link" style={record?.completed && { textDecoration: 'line-through' }}>
          {title}
        </Button>
      ),
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
        if (type === TaskType.Safety) {
          return (
            <Tag color={Colours.ORANGE_LIGHT} icon={<StarOutlined />} style={{ color: Colours.ORANGE_DARK }}>
              Safety
            </Tag>
          );
        } else if (type === TaskType.Compliance) {
          return (
            <Tag color={Colours.LIGHT_RED} icon={<SafetyCertificateOutlined />} style={{ color: Colours.ORANGE_DARK }}>
              Compliance
            </Tag>
          );
        } else if (type === TaskType.Routine) {
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
            <Button type="link" icon={<CheckOutlined />} onClick={() => onClickMarkComplete(record)}>
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

  return (
    <AnimatedContainer {...fadeInOutProps}>
      {sections.map((section) => {
        return (
          <SectionContainer key={section}>
            <SectionTitleRow
              layout
              onClick={() => {
                setSelectedSection(section);
              }}
            >
              <SectionTitle>
                {section}
                <Badge showZero count={sortedData[section]?.length} color={Colours.NAVY} style={{ marginLeft: '5px' }} />
              </SectionTitle>
              <Button type="link" icon={selectedSection === section ? <UpOutlined /> : <DownOutlined />} />
            </SectionTitleRow>

            <AnimatePresence mode="popLayout">
              {selectedSection === section && (
                <AnimatedContainer key={section} {...cardAnimationProps}>
                  <Table
                    loading={fetchingTasks && tasksData?.propertyTasks?.length === 0}
                    columns={columns}
                    dataSource={sortedData[selectedSection] || []}
                    // loading={isFetching}
                    size="middle"
                    rowClassName={(record) => (record.completed ? 'completed' : '')}
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
