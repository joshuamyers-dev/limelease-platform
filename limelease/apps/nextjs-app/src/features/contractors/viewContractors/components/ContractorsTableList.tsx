import { CheckOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import StatusTag from '@components/StatusTag';
import UrgencyTag from '@components/UrgencyTag';
import {
  Contractor,
  FetchRequestsDocument,
  PropertyRequest,
  PropertyRequestState,
  PropertyRequestUrgency,
  useUpdateRequestStateMutation,
} from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { formatMobileNumber, renderAddressLabel } from '@utils/Helpers';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

interface ContractorsTableListProps {
  contractors: Maybe<Array<Maybe<Contractor>>>;
  isFetching: boolean;
}

interface DataType {
  key: string;
  title: string;
  requestedOn: Date;
  urgency: PropertyRequestUrgency;
  status: PropertyRequestState;
  messages: number;
}

const ContractorsTableList: React.FC<ContractorsTableListProps> = ({ contractors, isFetching }) => {
  const router = useRouter();
  const [actionsVisible, setActionsVisible] = useState(false);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Array<string>>([]);

  const [updateRequestState, { loading }] = useUpdateRequestStateMutation();

  const data: DataType[] = useMemo(() => {
    return contractors?.map((contractor) => {
      return {
        key: contractor?.id,
        businessName: contractor?.businessName,
        contactNumber: contractor?.contactNumber ? formatMobileNumber(contractor.contactNumber) : 'N/A',
        contactEmail: contractor?.contactEmail,
        messages: 0,
      };
    });
  }, [contractors]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'Business Name',
        dataIndex: 'businessName',
        key: 'businessName',
      },
      {
        title: 'Contact Number',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
      },
      {
        title: 'Contact Email',
        dataIndex: 'contactEmail',
        key: 'contactEmail',
      },
      {
        title: 'Messages',
        key: 'messages',
        dataIndex: 'messages',
      },
    ];
  }, [contractors]);

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
  }, [contractors]);

  const onClickRow = useCallback((record: DataType) => {
    router.push(`/contractors/${record.key}`);
  }, []);

  return (
    <TableContainer {...cardAnimationProps}>
      {actionsVisible && (
        <ActionBarContainer {...fadeInOutProps}>
          <Button type="text" icon={<DeleteOutlined />}>
            Delete Contractors
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
            onClick: () => onClickRow(record),
          };
        }}
      />
    </TableContainer>
  );
};

const TableContainer = styled(motion.div)`
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

export default ContractorsTableList;
