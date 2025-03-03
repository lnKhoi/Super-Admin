import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  message,
} from 'antd';
import { getRoles } from '~/apis/role';
import NoData from '~/assets/no-data.png';
import RoleCardSkeleton from '~/components/custom/skeletons/RoleCardSkeleton';
import ModalCreateRole from '~/components/role/ModalCreateRole';
import RoleCard from '~/components/role/RoleCard';
import { useAuthContext } from '~/contexts/auth.context';
import { Role } from '~/models/role.model';

import { PlusIcon } from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Roles' }];
};

function Roles() {
  const [modalType, setModalType] = useState<'create-role' | ''>('')
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingType, setLoadingType] = useState<'get-roles' | 'create-role' | ''>('')
  const [messageApi, contextHolder] = message.useMessage();
  const { hasPermission } = useAuthContext()

  const handleGetRoles = () => {
    setLoadingType('get-roles')
    getRoles().then(res => setRoles(res?.data?.data))
      .finally(() => setLoadingType(''))
  }

  const handleRefresh = () => {
    setLoadingType('create-role')
    getRoles().then(res => {
      setRoles(res?.data?.data)
      messageApi.success('Create new role successfully!')
    })
      .finally(() => setLoadingType(''))
  }

  useEffect(() => handleGetRoles(), [])

  const handleUpdateRole = useCallback((newRole: Role, type: 'create' | 'edit') => {
    messageApi.success(type == 'create' ? `Add users to ${newRole.name} successfully!` : 'Update Role successfully!')
    setRoles((prevRoles) => (
      prevRoles.map(r => r.id === newRole.id ? newRole : r)
    ))
  }, [])

  return (
    <div>
      {contextHolder}
      <div className='flex items-center w-full justify-between'>
        <div>
          <h2 className='text-2xl font-medium text-gray-800'>Roles</h2>
          <p className='font-normal text-gray-500 text-sm'>View, Create and manage your roles with preferred configuration</p>
        </div>
        {hasPermission('create-role') &&
          <Button icon={<PlusIcon className='w-5 h-5 text-white' />} onClick={() => setModalType('create-role')} type='primary'>
            Create Role
          </Button>}
      </div>
      <div className='mt-5 grid w-full grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {loadingType == 'create-role' && <RoleCardSkeleton />}

        {loadingType == 'get-roles' ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => <RoleCardSkeleton key={index} />)
        ) : roles.length === 0 ? (
          <div className="w-full flex mt-9 justify-center items-center col-span-full">
            {loadingType !== 'create-role' && <img src={NoData} alt="No data" />}
          </div>
        ) : (
          roles.map(role => <RoleCard
            onUpdateRole={(newRole, type) => handleUpdateRole(newRole, type)}
            key={role.id}
            role={role} />)
        )}
      </div>

      {/* Create Role */}
      {modalType == 'create-role' && (
        <ModalCreateRole
          type='create'
          onSuccess={handleRefresh}
          onClose={() => setModalType('')}
          open={modalType == 'create-role'}
        />
      )}
    </div>
  )
}

export default Roles
