import React, {
  memo,
  useState,
} from 'react';

import {
  Button,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { getRoleDetails } from '~/apis/role';
import Avatar from '~/assets/avatar.jpeg';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Role } from '~/models/role.model';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@remix-run/react';

import ModalAddUserToRole from './ModalAddUserToRole';
import ModalCreateRole from './ModalCreateRole';

type RoleCardProps = {
    role: Role
    onUpdateRole: (newRole: Role, type: 'create' | 'edit') => void
}

const RoleCard = ({ role, onUpdateRole }: RoleCardProps) => {
    const [modalAddUser, setModalAddUser] = useState<boolean>(false)
    const [modalEditRole, setModalEditRole] = useState<boolean>(false)
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const { hasPermission } = useAuthContext()


    const defaultRoles = ['Brand Manager', 'Brand User', 'Brand Admin']

    const handleGetNewUsers = (type: 'create' | 'edit') => {
        getRoleDetails(role?.id as string).then((res) => {
            onUpdateRole(res.data, type)
        })
    }

    return (
        <>
            {contextHolder}
            <div
                onClick={() => hasPermission('view-role') ? navigate(`/manager/role/${role.id}`) : null}
                className="p-4 border cursor-pointer border-gray-200 hover:shadow-md shadow-sm rounded-xl  w-full bg-white">
                {/* Role Title */}
                <h3 className="text-lg font-medium truncate">{role.name}</h3>

                {/* Created Date */}
                <div className="flex items-center text-gray-500 text-sm mt-1">
                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                    <span>Created Date: {dayjs(role.createdAt).format(DATE_TIME_FORMAT)}</span>
                </div>

                {/* User Avatars */}
                <div className='flex items-center mt-3'>
                    <div className="flex items-center space-x-[-8px]">
                        {Array.isArray(role.users) &&
                            role?.users?.slice(0, 3)?.map((user) =>
                                typeof user === 'object' ? (
                                    <img
                                        key={user.id}
                                        src={user.picture || Avatar}
                                        alt={user.name || 'User'}
                                        className="w-9 h-9 rounded-full border-2 border-white"
                                    />
                                ) : null
                            )}

                        {role?.users?.length > 3 && (
                            <span className="w-9 h-9 flex items-center justify-center text-sm font-normal bg-gray-200 rounded-full border-2 border-white">
                                +{role?.users?.length - 3}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={(e) => {
                            hasPermission('assign-user-to-role') ? setModalAddUser(true) : null;
                            e.stopPropagation()
                        }}
                        className='flex cursor-pointer items-center gap-2'>
                        <div className='w-9 h-9 rounded-[50%] border-dashed flex items-center justify-center ml-1 border border-gray-200'>
                            <PlusIcon className='w-5 h-5 text-gray-500' />
                        </div>
                        <span className='text-sm font-normal text-gray-800'>Add User</span>
                    </div>

                </div>
                {/* Buttons */}
                <div className="mt-5 flex gap-2">
                    <Button
                        onClick={(e) => { e.stopPropagation(); setModalEditRole(true) }}
                        disabled={defaultRoles.includes(role?.name as string)}
                        className='w-[84px] bg-gray-100 border-none text-sm hover:bg-gray-200 font-semibold'>
                        Edit
                    </Button>
                    <Button
                        onClick={(e) => e.stopPropagation()}
                        disabled={defaultRoles.includes(role?.name as string)}
                        className='w-[101px] bg-gray-100 border-none text-sm font-semibold'>
                        Delete Role
                    </Button>
                </div>
            </div>


            {/* Edit Role */}
            {modalEditRole && (
                <ModalCreateRole
                    initial={role}
                    type="edit"
                    onClose={() => setModalEditRole(false)}
                    open={modalEditRole}
                    onSuccess={() => handleGetNewUsers('edit')} />
            )}

            {/* Add User To Role */}
            {modalAddUser && (
                <ModalAddUserToRole
                    open={modalAddUser}
                    onSuccess={() => handleGetNewUsers('create')}
                    role={role}
                    onclose={() => setModalAddUser(false)}
                />
            )}
        </>
    );
};

export default memo(RoleCard)
