import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Modal, Space, message } from 'antd';

import { requestActionsMenuItems } from '../utils/Constants';
import { useCallback, useContext, useMemo } from 'react';
import { RequestDetailsContext } from '../containers/RequestDetailsContainer';
import {
  FetchRequestByTicketNumberDocument,
  FetchRequestDocument,
  PropertyRequestState,
  PropertyRequestUrgency,
  useUpdateRequestStateMutation,
  useUpdateRequestUrgencyMutation,
} from '@graphql/generated';
import { formatStatusTitle, toProperCase } from '@utils/Helpers';

const { confirm } = Modal;

const RequestActionsDropdown = () => {
  const context = useContext(RequestDetailsContext);

  const [updateRequestState, { loading: loadingUpdateState, data: updateStateData, error: updateStateError }] = useUpdateRequestStateMutation();
  const [updateRequestUrgency, { loading: loadingUpdateUrgency, data: updateUrgencyData, error: updateUrgencyError }] = useUpdateRequestUrgencyMutation();

  if (!context?.request) return null;

  const refetchQueries = useMemo(() => {
    return [
      {
        query: FetchRequestDocument,
        variables: {
          id: context.request?.id,
        },
      },
    ];
  }, [context.request]);

  const markRequestAsCompleted = useCallback(async () => {
    await updateRequestState({
      variables: {
        requestIds: [context.request.id],
        state: PropertyRequestState.Resolved,
      },
      refetchQueries,
    });

    message.success('This request has been marked as complete.', 2.5);
  }, [context?.request.id]);

  const changeStatus = useCallback(
    async (status: PropertyRequestState) => {
      await updateRequestState({
        variables: {
          requestIds: [context.request.id],
          state: status,
        },
        refetchQueries,
      });

      message.success('This request has been updated.', 2.5);
    },
    [context?.request.id]
  );

  const handleUrgencyChange = useCallback(
    async (urgency: PropertyRequestUrgency) => {
      await updateRequestUrgency({
        variables: {
          requestId: context.request.id,
          urgency,
        },
        refetchQueries,
      });

      message.success('This request has been updated.', 2.5);
    },
    [context.request.id]
  );

  const handleStatusChange = useCallback(
    async (state) => {
      await changeStatus(state);
    },
    [changeStatus]
  );

  const handleMarkComplete = useCallback(async () => {
    if (!context?.request?.id) return null;

    confirm({
      title: `Are you sure you want to mark this request as complete?`,
      content:
        'The rental providers and contractors assigned to jobs on this request will be notified that the request has been completed and no longer requires attention.',
      okType: 'primary',
      okText: 'Continue',
      onOk: async () => {
        await markRequestAsCompleted();
      },
    });
  }, [context?.request.id, markRequestAsCompleted]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copied to clipboard.', 2.5);
  }, []);

  const handleCancelRequest = useCallback(() => {
    confirm({
      title: 'Are you sure you want to cancel this request?',
      content: 'The tenants of this property and any contractors assigned to this request will be notified of the cancellation.',
      okText: 'Continue',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await updateRequestState({
          variables: {
            requestIds: [context.request.id],
            state: PropertyRequestState.Deleted,
          },
          refetchQueries,
        });

        message.success('This request has been archived.', 2.5);
      },
    });
  }, [context.request]);

  const menuProps: MenuProps = useMemo(() => {
    return {
      items: requestActionsMenuItems?.map((item, index) => {
        if (item.key === 'change_status') {
          return {
            key: index,
            icon: item.icon,
            label: item.label,
            children: Object.values(PropertyRequestState)
              .filter((state) => state !== PropertyRequestState.Deleted)
              .map((state, stateIndex) => ({
                key: `${index}-${stateIndex}`,
                label: formatStatusTitle(state),
                onClick: () => handleStatusChange(state),
              })),
          };
        } else if (item.key === 'override_urgency') {
          return {
            key: index,
            icon: item.icon,
            label: item.label,
            children: Object.values(PropertyRequestUrgency).map((urgency, urgencyIndex) => ({
              key: `${index}-${urgencyIndex}`,
              label: toProperCase(urgency.replace(/_/g, ' ')),
              onClick: () => handleUrgencyChange(urgency),
            })),
          };
        } else {
          return {
            key: index,
            icon: item.icon,
            label: item.label,
            onClick:
              item.key === 'mark_complete'
                ? handleMarkComplete
                : item.key === 'copy_link'
                ? handleCopyLink
                : item.key === 'cancel_request'
                ? handleCancelRequest
                : undefined,
          };
        }
      }),
    };
  }, [requestActionsMenuItems, handleStatusChange, handleMarkComplete, handleCopyLink]);

  return (
    <Dropdown menu={menuProps}>
      <Button>
        <Space>
          Actions
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default RequestActionsDropdown;
