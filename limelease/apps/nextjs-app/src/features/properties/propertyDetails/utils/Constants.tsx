import StatusTag from '@components/StatusTag';
import UrgencyTag from '@components/UrgencyTag';
import { PropertyRequestState, PropertyRequestUrgency } from '@graphql/generated';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  id: string;
  title: string;
  requestedOn: Date;
  urgency: PropertyRequestUrgency;
  status: PropertyRequestState;
  messages: number;
}

export const propertyRequestTableColumns: ColumnsType<DataType> = [
  {
    title: 'Request',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Requested on',
    dataIndex: 'requestedOn',
    key: 'requestedOn',
    sorter: {
      compare: (a, b) => a.requestedOn - b.requestedOn,
      multiple: 1,
    },
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
