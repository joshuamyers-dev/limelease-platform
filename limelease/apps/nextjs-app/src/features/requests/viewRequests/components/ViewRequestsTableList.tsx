import { CheckOutlined, InboxOutlined } from '@ant-design/icons';
import StatusTag from '@components/StatusTag';
import UrgencyTag from '@components/UrgencyTag';
import { FetchRequestsDocument, PropertyRequest, PropertyRequestState, PropertyRequestUrgency, useUpdateRequestStateMutation } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { renderAddressLabel } from '@utils/Helpers';
import { Button, Modal, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

const { confirm } = Modal;

interface ViewRequestsTableListProps {
  requests: Maybe<Array<Maybe<PropertyRequest>>>;
  isFetching: boolean;
}

interface DataType {
  key: string;
  title: string;
  requestedOn: Date;
  urgency: PropertyRequestUrgency;
  status: PropertyRequestState;
  messages: number;
  ticketNumber: string;
}

const ViewRequestsTableList: React.FC<ViewRequestsTableListProps> = ({ requests, isFetching }) => {
  const router = useRouter();
  const [actionsVisible, setActionsVisible] = useState(false);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Array<string>>([]);

  const [updateRequestState, { loading }] = useUpdateRequestStateMutation();

  const data: DataType[] = useMemo(() => {
    return requests?.map((request) => {
      return {
        key: request?.id,
        ticketNumber: request?.ticketNumber,
        address: renderAddressLabel(request?.property?.address, true),
        title: request?.title,
        requestedOn: dayjs(request?.insertedAt).format('DD MMM YYYY'),
        urgency: request?.urgency,
        status: request?.state,
        messages: 0,
      };
    });
  }, [requests]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Request',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Submission Date',
        dataIndex: 'requestedOn',
        key: 'requestedOn',
      },
      {
        title: 'Urgency',
        dataIndex: 'urgency',
        key: 'urgency',
        filters: [
          {
            text: 'Low',
            value: 'low',
          },
          {
            text: 'Medium',
            value: 'medium',
          },
          {
            text: 'High',
            value: 'high',
          },
          {
            text: 'Emergency',
            value: 'emergency',
          },
        ],
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value: string, record) => record.urgency.startsWith(value.toUpperCase()),
        render: (_, record) => <UrgencyTag urgency={record.urgency} />,
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, record) => <StatusTag status={record.status} />,
      },
      {
        title: 'Messages',
        key: 'messages',
      },
    ];
  }, [requests]);

  const rowSelection: TableRowSelection<DataType> = useMemo(() => {
    return {
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRequestIds(selectedRows.map((row) => row.key));

        if (selectedRows.length === 0) {
          setActionsVisible(false);
        } else {
          setActionsVisible(true);
        }
      },
    };
  }, [requests]);

  const onClickMarkAsComplete = useCallback(async () => {
    confirm({
      title: `Are you sure you want to mark ${selectedRequestIds.length > 1 ? 'these' : 'this'} ${selectedRequestIds.length} ${
        selectedRequestIds.length > 1 ? 'requests' : 'request'
      } as complete?`,
      content:
        'The rental providers and contractors assigned to jobs on this request will be notified that the request has been completed and no longer requires attention.',
      okType: 'primary',
      okText: 'Continue',
      onOk: async () => {
        await updateRequestState({
          variables: {
            requestIds: selectedRequestIds,
            state: PropertyRequestState.Resolved,
          },
          refetchQueries: [
            {
              query: FetchRequestsDocument,
              variables: {
                first: 10,
              },
            },
          ],
        });

        message.success('These Requests have been marked as complete.');
      },
    });
  }, [selectedRequestIds]);

  const onClickArchive = useCallback(async () => {
    confirm({
      title: 'Are you sure you want to archive these requests?',
      icon: <InboxOutlined />,
      okType: 'danger',
      content: 'This action cannot be undone.',
      onOk: async () => {
        await updateRequestState({
          variables: {
            requestIds: selectedRequestIds,
            state: PropertyRequestState.Deleted,
          },
          refetchQueries: [
            {
              query: FetchRequestsDocument,
              variables: {
                first: 10,
              },
            },
          ],
        });
      },
      onCancel() {},
    });
  }, [selectedRequestIds]);

  const onClickRequestRow = useCallback((record: DataType) => {
    router.push(`/requests/${record.ticketNumber}`);
  }, []);

  return (
    <TableContainer>
      {actionsVisible && (
        <ActionBarContainer {...fadeInOutProps}>
          <Button type="text" icon={<CheckOutlined />} onClick={onClickMarkAsComplete}>
            Mark as complete
          </Button>
          <Button type="text" icon={<InboxOutlined />} onClick={onClickArchive}>
            Archive
          </Button>
        </ActionBarContainer>
      )}

      <Table
        columns={columns}
        dataSource={data}
        loading={isFetching}
        size="middle"
        pagination={false}
        rowSelection={rowSelection}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => onClickRequestRow(record),
          };
        }}
      />
    </TableContainer>
  );
};

const TableContainer = styled.div`
  position: relative;
`;

const ActionBarContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 30px;
  right: 0;
  height: 45px;
  background-color: ${Colours.GRAY_2};
  z-index: 2;
  display: flex;
  align-items: center;
`;

export default ViewRequestsTableList;
