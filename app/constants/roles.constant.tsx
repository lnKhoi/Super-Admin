import {
  Button,
  Skeleton,
  Switch,
  TableColumnsType,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { archiveUser } from '~/apis/auth';
import Avatar from '~/assets/avatar.jpeg';
import { UserPermission } from '~/models/User.model';

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_V2,
} from './time.constant';

export const RolesColumns = ({
  onViewUser,
  onEditUser,
  loading,
  onUpdateStatus
}: {
  onViewUser: (id: string) => void;
  onEditUser: (user: UserPermission) => void;
  loading: boolean
  onUpdateStatus:(status:boolean) => void
}): TableColumnsType<UserPermission> => [
    {
      title: 'Name',
      minWidth: 250,
      fixed: 'left',
      render: (_, record) => (
        <div className='flex gap-3 w-full items-start'>
          {loading
            ? <Skeleton.Avatar active style={{ height: 36, width: 36 }} />
            : <img className='w-9 h-9 object-cover rounded-[50%]' src={Avatar} alt="avatar" />}
          <div className="flex flex-col">
            <p className='text-sm font-medium text-gray-800 '>
              {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.name || ''}
            </p>
            <span className='text-sm text-gray-500 font-normal'>
              {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      minWidth: 200,
      render: (_, record) => {
        // Format the role text (same as your logic)
        const roleText = loading ? (
          <Skeleton.Input active style={{ height: 18 }} />
        ) : Array.isArray(record.role) ? (
          record.role
            .map((role) => {
              if (typeof role === 'string') {
                return role.charAt(0).toUpperCase() + role.slice(1);
              } else if (role?.name) {
                return role.name.charAt(0).toUpperCase() + role.name.slice(1);
              }
              return '';
            })
            .join(', ')
        ) : (
          typeof record.role === 'string' ? record.role : ''
        );

        // If loading, return the skeleton directly
        if (loading) {
          return <div>{roleText}</div>;
        }

        return (
          <Tooltip title={roleText} placement="top">
            <div className='cursor-pointer w-[250px] truncate overflow-hidden text-ellipsis flex-nowrap' >{roleText}</div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Last Activity',
      minWidth: 150,
      render: (_, record) =>
        <Tooltip placement='topLeft' title={record.last_activity_time ? dayjs(record?.last_activity_time).format(DATE_TIME_FORMAT_V2) : record.last_activity}>
          <div className='capitalize cursor-pointer'>{loading ? <Skeleton.Input active style={{ height: 18 }} /> : record?.last_activity}</div>
        </Tooltip>
    },
    {
      title: 'Joined Date',
      render: (_, record) => <>{loading ? <Skeleton.Node active style={{ height: 18, width: 50 }} /> : dayjs(record.create_at).format(DATE_TIME_FORMAT)}</>
    },
    {
      title: 'Status',
      width: '10%',
      render: (_, record) => {
        const handleArchiveUser = (value: boolean) => {
          archiveUser(record.id, value)
        }

        return (
          <>{loading
            ? <Skeleton.Node active style={{ height: 18, width: 120 }} />
            : <div><Switch defaultChecked={record?.archive == 'unarchive'} onChange={(e) => {
              handleArchiveUser(!e);
              onUpdateStatus(e)
              }} /></div>}
          </>
        )
      }
    },
    {
      align: 'justify',
      title: 'Action',
      minWidth: 80,
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            {loading ? <div className="flex items-center gap-3">
              <Skeleton.Button active style={{ height: 20, width: 20 }} />
              <Skeleton.Button active style={{ height: 20, width: 20 }} />
              <Skeleton.Button active style={{ height: 20, width: 20 }} />
            </div> :
              <div className="flex items-center gap-3">
                <EyeIcon onClick={() => onViewUser(record.id)} className='w-5 h-5 cursor-pointer  text-gray-800' />
                <PencilSquareIcon onClick={() => onEditUser(record)} className='w-5 hidden h-5 cursor-pointer  text-gray-800' />
              </div>
            }
          </>
        );
      },
    },
  ];


export const ROLES = [
  { name: 'Administrator', value: 'administrator' },
  { name: 'Manager', value: 'manager' },
  { name: 'User', value: 'user' },
  { name: 'Employee', value: 'employee' }
]


export const UserColumns = (loading: boolean): TableColumnsType<UserPermission> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => (
      <div className="flex items-start gap-3">
        {loading
          ? <Skeleton.Avatar active style={{ width: 36, height: 36 }} />
          : <img src={Avatar} alt="avatar" className="w-9 h-9 rounded-[50%] object-cover" />}
        <div>
          <p className="text-sm font-medium text-gray-800">
            {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.name}
          </p>
          <span className="text-sm font-normal text-gray-500">
            {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.email}
          </span>
        </div>
      </div>
    ),
  },
];

export const UserAssignedColumns = (loading: boolean, onDelete: (id: string) => void, deletingUserIds: string[]) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_: string, record: any) => (
      <div className="flex items-center space-x-2">
        {loading
          ? <Skeleton.Avatar active style={{ width: 36, height: 36 }} />
          : <img src={Avatar} alt="avatar" className="w-9 h-9 rounded-[50%] object-cover" />
        }
        <div>
          <p className="font-medium flex items-center">
            {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.name}
          </p>
          <p className="text-sm text-gray-500">
            {loading ? <Skeleton.Input active style={{ height: 18 }} /> : record.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_: string, record: UserPermission) => {
      const isDeleting = deletingUserIds.includes(record.id);
      return (
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton.Button active style={{ height: 18, width: 50 }} />
          ) : (
            <EyeIcon className="text-gray-800 w-5 h-5 cursor-pointer" />
          )}
          {loading ? (
            <Skeleton.Button active style={{ height: 18, width: 50 }} />
          ) : (
            <Button loading={isDeleting} type='text' onClick={() => onDelete(record.id)}>
              {!isDeleting && (
                <TrashIcon
                  className="text-gray-800 w-5 h-5 cursor-pointer"
                />
              )}
            </Button>
          )}
        </div>
      );
    },
  },
];