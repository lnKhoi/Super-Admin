import React, {
  ChangeEvent,
  Key,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Drawer,
  message,
  Table,
} from 'antd';
import { TableProps } from 'antd/lib';
import debounce from 'lodash/debounce';
import {
  addUsersToRole,
  getUsers,
} from '~/apis/role';
import { UserColumns } from '~/constants/roles.constant';
import { Role } from '~/models/role.model';
import {
  User,
  UserPermission,
} from '~/models/User.model';

import { InputSearch } from '../ui/input-search';

type ModalAddUserToRoleProps = {
    open: boolean;
    onclose: () => void;
    role: Role
    onSuccess: () => void

};

function ModalAddUserToRole({ onclose, open, role, onSuccess }: ModalAddUserToRoleProps) {
    const [search, setSearch] = useState<string>('');
    const [users, setUsers] = useState<{ total: number, data: UserPermission[] }>({ total: 0, data: [] })
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingInvite, setLoadingInvite] = useState<boolean>(false)
    const [params, setParams] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: 10 })

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedUser, setSelectedUser] = useState<string[]>(
        role?.users?.map((user) => (user as User)?.id) || []
    );

    const rowSelection: TableProps<UserPermission>['rowSelection'] = {
        selectedRowKeys: selectedUser,
        onChange: (selectedRowKeys: Key[], selectedRows: UserPermission[]) => {
            setSelectedUser(selectedRowKeys as string[]);
        },
    };

    const getAllUsers = () => {
        setLoading(true)
        getUsers(params.page, params.pageSize,search).then(res => setUsers({ data: res?.data?.data, total: res?.data?.total }))
            .finally(() => setLoading(false))
    }

    useEffect(() => { getAllUsers() }, [params, search])

    const handleAddUsersToRole = () => {
        setLoadingInvite(true)
        addUsersToRole(role?.id, selectedUser).then(res => {
            onSuccess()
            onclose()

        })
            .finally(() => setLoadingInvite(false))
            .catch(err => messageApi.error(err?.message))
    }

    const handleSearchUser = debounce((e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value)
    }, 500);

    return (
        <Drawer
            width={650}
            open={open}
            onClose={onclose} title={`Add user to ${role.name}`}
            footer={<div className='flex items-center gap-3 justify-end'>
                <Button onClick={onSuccess} >Success</Button>
                <Button>Cancel</Button>
                <Button
                    onClick={handleAddUsersToRole}
                    loading={loadingInvite}
                    disabled={selectedUser.length == 0}
                    type='primary'>Add</Button>
            </div>}
        >
            {contextHolder}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-gray-800">User Unassigned</p>
                    <span className="text-sm font-normal text-gray-500">Selected ({selectedUser.length})</span>
                </div>
                <InputSearch onChange={(e) => handleSearchUser(e)} placeholder="Search name" />
            </div>

            {/* Users */}
            <div className="mt-5">
                <Table
                    pagination={{
                        pageSize: params.pageSize,
                        showSizeChanger: true, 
                        pageSizeOptions: ['10', '20', '50'], 
                        current: params.page,
                        total: users.total,
                        onChange: (page, pageSize) => {
                            setParams({ page: page, pageSize: pageSize })
                        },
                    }}
                    rowKey={'id'}
                    rowSelection={{ type: 'checkbox', ...rowSelection }}
                    dataSource={loading ? [1, 2, 3, 4,5,6,7,8,9,10] as any : users.data}
                    columns={UserColumns(loading)} />
            </div>
        </Drawer>
    );
}

export default ModalAddUserToRole;
