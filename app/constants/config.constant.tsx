import { Button } from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  BoltIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export const PolicyAndConditionColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Last updated",
    dataIndex: "lastUpdated",
    key: "lastUpdated",
  },
  {
    title: "Action",
    key: "action",
    align: 'center',
    render: () => (
      <div className="flex justify-center gap-2">
        <Button icon={<EyeOutlined />} type="text" />
        <Button icon={<EditOutlined />} type="text" />
        <Button icon={<DeleteOutlined />} type="text" />
      </div>
    ),
  },
];

export const configMethods = [
  { icon: <CreditCardIcon className="w-5 h-5 text-gray-800" />, label: "Payment" },
  { icon: <BoltIcon className="w-5 h-5 text-gray-800" />, label: "Integration Setup" }
]