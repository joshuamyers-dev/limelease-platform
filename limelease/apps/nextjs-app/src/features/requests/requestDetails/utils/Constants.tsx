import { CheckSquareOutlined, CopyOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { PropertyRequestState, PropertyRequestUrgency } from '@graphql/generated';
import { MenuProps } from 'antd';

export const requestActionsMenuItems: MenuProps['items'] = [
  {
    label: 'Edit',
    key: 'edit',
    icon: <EditOutlined />,
  },
  {
    label: 'Mark as Complete',
    key: 'mark_complete',
    icon: <CheckSquareOutlined />,
  },
  {
    label: 'Copy link',
    key: 'copy_link',
    icon: <CopyOutlined />,
  },
  {
    type: 'divider',
  },
  {
    label: 'Change status',
    key: 'change_status',
    children: [
      {
        label: 'Awaiting Response',
        key: PropertyRequestState.AwaitingResponse,
      },
      {
        label: 'Assigned to Contractor',
        key: PropertyRequestState.AssignedToContractor,
      },
      {
        label: 'Contractor Appointment Booked',
        key: PropertyRequestState.ContractorAppointmentBooked,
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Override urgency',
    key: 'override_urgency',
    children: [
      {
        label: 'Low',
        key: PropertyRequestUrgency.Low,
      },
      {
        label: 'Mid-High',
        key: PropertyRequestUrgency.MidHigh,
      },
      {
        label: 'Emergency',
        key: PropertyRequestUrgency.Emergency,
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    label: 'Cancel request',
    danger: true,
    key: 'cancel_request',
  },
];

// UI Messaging Constants
// ----------------------------------------------------------------
export const URGENT_MATTER_HEADLINE_TEXT = 'The tenant has classified this request as an urgent matter.';
export const URGENT_MATTER_BODY_TEXT =
  ' Urgent repairs must be done immediately because they make the property unsafe or difficult to live in. Please refer to the link below to view repairs that classify as urgent.';
export const URGENT_MATTER_CTA_TEXT = 'Go to Consumer Affairs VIC';
export const URGENT_MATTER_CTA_LINK =
  'https://www.consumer.vic.gov.au/housing/renting/repairs-alterations-safety-and-pets/repairs/repairs-in-rental-properties';
