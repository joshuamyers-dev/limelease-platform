import { AnimatedContainer } from '@components/AnimatedContainer';
import ContractorJobStatusTag from '@components/ContractorJobStatusTag';
import UrgencyTag from '@components/UrgencyTag';
import { ContractorJob, ContractorJobState, PropertyRequestFilter, PropertyRequestUrgency } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { Card, Divider, Segmented, Table } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import styled from 'styled-components';

interface DataType {
  key: string;
  request: Maybe<string>;
  requestId: Maybe<string>;
  requestedOn: string;
  urgency: Maybe<PropertyRequestUrgency>;
  status: Maybe<ContractorJobState>;
  messages: number;
}

interface ContractorJobsProps {
  jobs: Array<ContractorJob>;
  isFetching: boolean;
  onChangeFilter: (filter: PropertyRequestFilter) => void;
}

const ContractorJobs: React.FC<ContractorJobsProps> = ({ jobs, isFetching, onChangeFilter }) => {
  const router = useRouter();

  const data: DataType[] = useMemo(() => {
    return jobs?.map((job) => {
      return {
        key: job.id,
        request: `${job.request?.title} (#${job.request?.ticketNumber})`,
        requestId: job.request?.ticketNumber,
        requestedOn: dayjs(job.request?.insertedAt).format('DD MMM YYYY'),
        urgency: job.request?.urgency,
        status: job.state,
        messages: 0,
      };
    });
  }, [jobs]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'Request',
        dataIndex: 'request',
        key: 'request',
      },
      {
        title: 'Requested on',
        dataIndex: 'requestedOn',
        key: 'requestedOn',
      },
      {
        title: 'Urgency',
        dataIndex: 'urgency',
        key: 'urgency',
        // filters: [
        //   {
        //     text: 'Low',
        //     value: 'low',
        //   },
        //   {
        //     text: 'Medium',
        //     value: 'medium',
        //   },
        //   {
        //     text: 'High',
        //     value: 'high',
        //   },
        //   {
        //     text: 'Emergency',
        //     value: 'emergency',
        //   },
        // ],
        // filterMode: 'tree',
        // filterSearch: true,
        render: (_, record) => <UrgencyTag urgency={record.urgency} />,
      },

      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, record) => <ContractorJobStatusTag status={record.status} />,
      },
      {
        title: 'Messages',
        key: 'messages',
        dataIndex: 'messages',
      },
    ];
  }, [jobs]);

  const onClickJobRow = useCallback((jobRow: DataType) => {
    router.push(`/requests/${jobRow.requestId}`);
  }, []);

  return (
    <AnimatedContainer {...cardAnimationProps}>
      <StyledCard>
        <CardTitle>Jobs</CardTitle>

        <SegmentedContainer>
          <Segmented
            defaultValue={PropertyRequestFilter.New}
            size="small"
            options={[
              {
                label: 'All',
                value: PropertyRequestFilter.All,
              },
              {
                label: 'New',
                value: PropertyRequestFilter.New,
              },
              {
                label: 'Completed',
                value: PropertyRequestFilter.Completed,
              },
              {
                label: 'Archived',
                value: PropertyRequestFilter.Archived,
              },
            ]}
            onChange={(value: SegmentedValue) => onChangeFilter(value as PropertyRequestFilter)}
          />
          <Divider style={{ color: Colours.GRAY_5, margin: '-2px 2px 0 2px' }} />
        </SegmentedContainer>

        <Table
          columns={columns}
          dataSource={data}
          size="middle"
          loading={isFetching}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => onClickJobRow(record),
            };
          }}
        />
      </StyledCard>
    </AnimatedContainer>
  );
};

const StyledCard = styled(Card)`
  margin-top: 24px;
`;

const CardTitle = styled.div`
  color: #262626;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  margin-bottom: 16px;
`;

const SegmentedContainer = styled.div`
  margin-top: 2rem;
`;

export default ContractorJobs;
