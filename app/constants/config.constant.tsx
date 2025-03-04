import { Button } from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';

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
      align:'center',
      render: () => (
        <div className="flex justify-center gap-2">
          <Button icon={<EyeOutlined />} type="text" />
          <Button icon={<EditOutlined />} type="text" />
          <Button icon={<DeleteOutlined />} type="text"  />
        </div>
      ),
    },
  ];
  