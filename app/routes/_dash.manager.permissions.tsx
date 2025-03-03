import React, {
  useEffect,
  useState,
} from 'react';

import { Collapse } from 'antd';
import { getPermissions } from '~/apis/permission';
import Permission from '~/components/custom/skeletons/Permission';

import { DownOutlined } from '@ant-design/icons';
import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Permissions' }];
};
const { Panel } = Collapse;
type PermissionsMap = Record<string, string[]>;

function Permissions() {
  const [loading, setLoading] = useState<boolean>(false)
  const [permissions, setPermissions] = useState<PermissionsMap>({});
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const handleGetPermissions = () => {
    setLoading(true)
    getPermissions().then(res => {
      setPermissions(res?.data || {})
      setActivePanels(Object.keys(res.data));
    })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    handleGetPermissions()
  }, [])


  // Event Handlers
  const handleTogglePanels = () =>
    setActivePanels(activePanels.length === Object.keys(permissions).length ? [] : Object.keys(permissions));


  const renderPermissionPanel = ([category, perms]: [string, string[]]) => {
    return (
      <Panel
        key={category}
        header={
          <div className="flex justify-between w-full">
            <span onClick={(e) => e.stopPropagation()}>{category.replace(/([A-Z])/g, ' $1')}</span>
          </div>
        }
      >
        <div className="bg-white w-full grid grid-cols-2 border-t border-t-gray-200">
          {perms.map((perm, index) => (
            <div
              key={index}
              className="truncate h-[40px] pl-3 border-t border-gray-200 flex items-center"
            >
              {perm}
            </div>
          ))}
          {/* Add an empty div if the count is odd to maintain grid structure */}
          {perms.length % 2 !== 0 && <div className="border-t border-t-gray-200"></div>}
        </div>

      </Panel>
    );
  };

  return (
    <div>
      <div className='mb-5'>
        <h2 className='text-2xl font-medium text-gray-800'>Permissions</h2>
        <p className='font-normal text-gray-500 text-sm'>Manage all permissions of internal user</p>
      </div>
      <div className="bg-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-3 ">
          <span className='font-medium text-sm'>All Permission</span>
          <span className="text-sm text-blue-500 font-medium cursor-pointer" onClick={handleTogglePanels}>
            {activePanels.length === Object.keys(permissions).length ? 'Collapse All' : 'Expand All'}
          </span>
        </div>
        <div className="w-full border-t border-t-gray-300" />
        {loading ? (
          <>
            <Permission />
            <Permission />
          </>
        ) : (
          <Collapse
            activeKey={activePanels}
            onChange={(keys) => setActivePanels(keys as string[])}
            bordered={false}
            expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
            expandIconPosition="right"
          >
            {Object.entries(permissions).map(renderPermissionPanel)}
          </Collapse>
        )}
      </div>
    </div>
  )
}

export default Permissions
