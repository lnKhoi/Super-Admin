import React, {
  FC,
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  message,
  Skeleton,
  Table,
} from 'antd';
import {
  deleteUsersFromRole,
  getRoleDetails,
} from '~/apis/role';
import Permission from '~/components/custom/skeletons/Permission';
import ModalAddUserToRole from '~/components/role/ModalAddUserToRole';
import { UserAssignedColumns } from '~/constants/roles.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Role } from '~/models/role.model';

import { PlusOutlined } from '@ant-design/icons';
import { MetaFunction } from '@remix-run/cloudflare';
import {
  Link,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [{ title: 'Role Details' }]
}

const EmployeeRole: FC = () => {
    const { id } = useParams()
    const [role, setRole] = useState<Role | null>(null)
    const [modalAddUser, setModalAddUser] = useState<boolean>(false)
    const [loadingType, setLoadingType] = useState<'' | 'permissions' | 'add-users'>('')
    const [deletingUserIds, setDeletingUserIds] = useState<string[]>([])
    const [messageApi, contextHolder] = message.useMessage();
    const { hasPermission } = useAuthContext()

    const handleGetRoleDetails = () => {
        setLoadingType('permissions')
        getRoleDetails(id as string).then(res => setRole(res.data))
            .finally(() => setLoadingType(''))
    }

    useEffect(() => { handleGetRoleDetails() }, [])

    const getUsersInRole = () => {
        setLoadingType('add-users')
        getRoleDetails(id as string).then(res => setRole(res.data))
            .finally(() => setLoadingType(''))
    }

    const handleDeleteUserFromRole = async (id: string) => {
        setDeletingUserIds((prev) => [...prev, id]);

        deleteUsersFromRole(role?.id as string, [id])
            .then(() => {
                getUsersInRole();
                messageApi.success('Remove user successfully!');
            })
            .catch((err) => { messageApi.error(err.message); })
            .finally(() => { setDeletingUserIds((prev) => prev.filter((userId) => userId !== id)); });
    };

    return (
        <div >
            {contextHolder}
            <Breadcrumb
                className='fixed h-[40px] w-full '
                items={[
                    { title: <Link to={'/manager/roles'}>Roles</Link>, },
                    { title: <p className='text-gray-800'>Role Details</p> },
                ]}
            />
            <h1 className="text-2xl font-medium mb-4 mt-10">
                {loadingType == 'permissions'
                    ? <Skeleton.Input active style={{ height: 28 }} />
                    : role?.name
                }
            </h1>

            <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* Role Details */}
                <div className="bg-white py-4 w-1/2 border border-gray-200 rounded-xl hover:shadow-sm transition-all flex-1">
                    <div className="text-lg font-semibold px-4 pb-3 border-b border-b-gray-200">Role Details</div>
                    <div className='flex flex-col px-4'>
                        <p className="text-sm text-gray-600 font-normal  mt-4">
                            {loadingType == 'permissions' ? <Skeleton.Input active style={{ height: 17 }} /> : 'Role name'}
                        </p>
                        <span className="font-medium text-sm text-gray-800 mt-1">{role?.name}</span>
                    </div>
                    <div className='flex flex-col border-b border-b-gray-200 pb-4 px-4 mt-4'>
                        <p className="text-sm font-normal text-gray-600">
                            Role description:
                        </p>
                        <span className='font-medium w-full text-sm text-gray-800 break-words word-break'>
                            {loadingType === 'permissions' ? <Skeleton.Input active style={{ height: 17 }} /> : role?.description}
                        </span>


                    </div>

                    <div className="flex px-4 justify-between items-center mt-4">
                        <h3 className="font-medium">User Assigned ({role?.users.length})</h3>
                        {hasPermission('assign-user-to-role') && <Button onClick={() => setModalAddUser(true)} type="primary" icon={<PlusOutlined />}>
                            Add User
                        </Button>}
                    </div>
                    <Table
                        dataSource={loadingType !== '' ? [1, 2, 3, 4] as any : role?.users}
                        columns={UserAssignedColumns(loadingType !== '', (id) => handleDeleteUserFromRole(id), deletingUserIds)}
                        pagination={{ pageSize: 5 }}
                        rowKey="id"
                        className="mt-5 px-5"
                    />
                </div>
                {/* Role Permissions */}
                <div className="bg-white w-1/2  py-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all flex-1">
                    <div className="text-lg font-semibold px-4 pb-3 border-b border-b-gray-200">Role Permissions</div>
                    <div className="flex flex-col m-4 border border-gray-200 rounded-xl">
                        {loadingType == 'permissions'
                            ? <Permission />
                            : role?.permissions ? Object?.entries(role?.permissions)?.map(([k, v]) => (
                                <div key={k}>
                                    <div className="bg-gray-100 p-[10px] capitalize text-sm font-medium text-gray-800 w-full">
                                        {k}
                                    </div>
                                    <div className="grid grid-cols-2 ">
                                        {Array.isArray(v) ? v?.map((per, index) => {
                                            const isLastRow = index >= v.length - (v.length % 2 === 0 ? 2 : 1);
                                            return (
                                                <div
                                                    key={per}
                                                    className={`text-sm font-medium border-l-0 cursor-pointer hover:bg-gray-50 transition-all text-gray-800 capitalize px-[10px] h-[40px] flex items-center border-gray-200 ${!isLastRow ? 'border-b' : ''}  `}>
                                                    {per}
                                                </div>
                                            );
                                        }) : null}
                                    </div>
                                </div>
                            )) : null}
                    </div>
                </div>
            </div>

            {/* Modal Add User To Role */}
            {modalAddUser && role && (
                <ModalAddUserToRole
                    role={role}
                    onSuccess={getUsersInRole}
                    open={modalAddUser}
                    onclose={() => setModalAddUser(false)}
                />
            )}
        </div>
    );
};

export default EmployeeRole;
