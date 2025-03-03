import React, {
  ChangeEvent,
  Key,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  message,
  Table,
  TableProps,
} from 'antd';
import debounce from 'lodash/debounce';
import { getUsers } from '~/apis/role';
import { InputSearch } from '~/components/ui/input-search';
import ModalCreateUser from '~/components/user/ModalCreateUser';
import ModalViewUser from '~/components/user/ModalViewUser';
import { RolesColumns } from '~/constants/roles.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { UserPermission } from '~/models/User.model';

import { PlusIcon } from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [{ title: 'Users Permission' }];
};

const rowSelection: TableProps<UserPermission>['rowSelection'] = {
    onChange: (selectedRowKeys: Key[], selectedRows: UserPermission[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

function UsersPermission() {
    const [selectedId, setSelectedId] = useState<string>('')
    const [users, setUsers] = useState<{ total: number, data: UserPermission[] }>({ total: 0, data: [] })
    const [modalType, setModalType] = useState<'view-user' | 'edit-user' | 'create-user' | ''>('')
    const [params, setParams] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: 10 })
    const { hasPermission } = useAuthContext()
    const [selectedUser,setSelectedUser] = useState<null | UserPermission>(null)
    const [search, setSearch] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)

    const [messageApi, contextHolder] = message.useMessage();

    const handleViewUser = (id: string) => {
        setModalType('view-user')
        setSelectedId(id)
    }

    const handleEditUser = (user: UserPermission) => {
        setSelectedUser(user)
        setModalType('edit-user')
    }

    const handleGetUsers = () => {
        setLoading(true)
        getUsers(params.page, params.pageSize, search).then(res => setUsers({ total: res.data.total, data: res.data.data }))
            .finally(() => setLoading(false))
    }

    useEffect(() => handleGetUsers(), [params, search])

    const handleRefresh = (name: string) => {
        messageApi.success(name =='create-user' ? `You has been invited the user successfully.` : 'User changed successfully')
        handleGetUsers()
    }

    const handleSearchUser = debounce((e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value)
    }, 500);

    const handleUpdateUserStatus = (archive:boolean) => {
        messageApi.success(!archive ? 'Archive user successfully!' : 'Active user successfully!')
    } 

    return (
        <div>
            {contextHolder}
            <div className='flex items-center justify-between w-full'>
                <div>
                    <h2 className='text-2xl font-medium text-gray-800'>Users Permission</h2>
                    <p className='text-sm font-normal text-gray-800'>Manage who has access in your system</p>
                </div>
                {hasPermission('create-user') && (
                    <Button onClick={() => setModalType('create-user')} type='primary'>
                        <PlusIcon className='w-5 h-5 text-white' /> Create User
                    </Button>
                )}
            </div>
            <div className='mt-5 w-[300px]'>
                <InputSearch placeholder='Search name, email' onChange={(e) => handleSearchUser(e)} />
            </div>
            <div className='mt-5'>
                <Table<UserPermission>
                    pagination={{
                        pageSize: params.pageSize,
                        current: params.page,
                        total: users.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        onChange: (page, pageSize) => {
                            setParams({ page: page, pageSize: pageSize })
                        },
                    }}
                    scroll={{ x: 'max-content' }}
                    rowSelection={{ type: 'checkbox', ...rowSelection }}
                    columns={RolesColumns({
                        onViewUser: handleViewUser,
                        onEditUser: handleEditUser,
                        loading: loading,
                        onUpdateStatus:handleUpdateUserStatus
                    })}
                    dataSource={loading ? [1, 2, 3, 4, 5, 6, 7] as any : users.data}
                />
            </div>

            {/* Create User */}
            {(modalType == 'create-user' || modalType == 'edit-user') && (
                <ModalCreateUser
                    type={modalType}
                    user={selectedUser || selectedId}
                    onSuccess={(name: string) => handleRefresh(name)}
                    onClose={() => setModalType('')}
                    open={modalType == 'create-user' || modalType == 'edit-user'}
                />
            )}

            {/* View User */}
            {modalType == 'view-user' && (
                <ModalViewUser
                    id={selectedId}
                    onClose={() => setModalType('')}
                    open={modalType == 'view-user'}
                    onsuccess={() => handleGetUsers()}
                />
            )}
        </div>
    );
}

export default UsersPermission;
