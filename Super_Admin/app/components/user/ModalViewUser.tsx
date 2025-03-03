import React, {
  FC,
  memo,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Skeleton,
  Tabs,
} from 'antd';
import {
  editUserPermission,
  getUserDetails,
} from '~/apis/permission';
import {
  getPermissionOfRole,
  getRoles,
} from '~/apis/role';
import Avatar from '~/assets/upload-avatar.png';
import { UserTab } from '~/constants/permission.constant';
import { Role } from '~/models/role.model';
import { User } from '~/models/User.model';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import Permission from '../custom/skeletons/Permission';

type ModalViewUserProps = {
  open: boolean;
  onClose: () => void;
  id: string
  onsuccess: () => void
};

const ModalViewUser: FC<ModalViewUserProps> = ({ open, onClose, id ,onsuccess}) => {
  const [form] = Form.useForm();
  const [tab, setTab] = useState<'profile' | 'role'>('profile')
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [user, setUser] = useState<null | User>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [permissions, setPermissions] = useState({})
  const [loadingRole, setLoadingRole] = useState<boolean>(false)

  const handleFinish = (values: any) => {
    setLoadingEdit(true)
    editUserPermission({...values,name:values.name || ''}, id).then(() => {
      handleGetUserDetails('no-loading')
      messageApi.success('Update User successfully!')
      setIsEdit(false)
      onClose()
      onsuccess()
    })
      .catch(err => messageApi.error(err.message))
      .finally(() => setLoadingEdit(false))
  };

  const handleSubmit = () => {
    form.submit();
  };

  const handleGetUserDetails = (type: string) => {
    type == 'loading' && setLoading(true)
    getUserDetails(id).then(res => {
      setUser(res?.data?.data?.[0])
    })
      .finally(() => setLoading(false))
  }

  const handlegGetRoles = () => {
    getRoles().then(res => {
      setRoles(res.data.data)
    })
  }

  const handleGetPermissionOfRole = () => {
    setLoadingRole(true)
    getPermissionOfRole(selectedRoleId).then(res => setPermissions(res.data))
    .finally(() => setLoadingRole(false))
  }

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      name: user?.name,
      roles: Array.isArray(user?.role)
        ? user?.role.map((e: User) => typeof e == 'object' ? e?.id : '')
        : []
    })

    // @ts-ignore
    setSelectedRoleId(user?.role?.[0]?.id)
  }, [user])

  useEffect(() => {
    handleGetUserDetails('loading')
    handlegGetRoles()
  }, [id])

  useEffect(() => {
    selectedRoleId && selectedRoleId !== '' && handleGetPermissionOfRole()
  }, [selectedRoleId])

  return (
    <Drawer open={open} onClose={onClose} title="View User" width={700}
      footer={
        (tab == 'profile' && isEdit) ? <div className={`flex justify-end gap-2`}>
          <Button onClick={onClose}>Cancel</Button>
          <Button loading={loadingEdit} type="primary" onClick={handleSubmit}>
            Save Change
          </Button>
        </div> : null
      }
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Picture Upload */}
        <div className="flex gap-5 items-center ">
          {loading
            ? <Skeleton.Avatar active style={{ height: 120, width: 120 }} />
            : <img className="w-[120px] h-[120px] object-cover rounded-[50%]" src={Avatar} alt="avatar" />}
          <div className='flex flex-col'>
            <h2 className='font-semibold text-2xl text-gray-800'>
              {loading ? <Skeleton.Input active style={{ height: 18 }} /> : user?.name}
            </h2>
            <p className='font-normal text-sm text-gray-800 mt-[2px]'>
              {loading ? <Skeleton.Input active style={{ height: 18 }} /> : user?.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs className='mt-5' defaultActiveKey="profile" items={UserTab} onChange={(e) => setTab(e as 'role' | 'profile')} />
        {/* Profile */}
        {(tab == 'profile' && !loading) && (
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-blue-600'>Public Profile</p>
            <Button
              onClick={() => setIsEdit(!isEdit)}
              className='text-blue-600 font-medium'
              type='text'
              icon={<PencilSquareIcon className='w-5 text-blue-600 h-5' />} >
              Edit
            </Button>
          </div>
        )}

        {tab == 'profile' && (
          <div className='mt-4 w-full'>
            {!isEdit
              ? <div className='flex flex-col gap-4'>
                <div className='flex items-center'>
                  <p className='w-[400px] font-medium text-sm text-gray-500'>Full name:</p>
                  <p className='w-full font-medium text-sm text-gray-800'>
                    {loading ? <Skeleton.Input active style={{ height: 18 }} /> : user?.name}
                  </p>
                </div>
                <div className='flex items-center'>
                  <p className='w-[400px] font-medium text-sm text-gray-500'>Email:</p>
                  <p className='w-full font-medium text-sm text-gray-800'>
                    {loading ? <Skeleton.Input active style={{ height: 18 }} /> : user?.email}
                  </p>
                </div>
                <div className='flex items-center'>
                  <p className='w-[400px] font-medium text-sm text-gray-500'>Role:</p>
                  <p className='w-full font-medium text-sm text-gray-800'>
                    {loading
                      ? <Skeleton.Input active style={{ height: 18 }} />
                      : Array.isArray(user?.role) ? user?.role.map(r => r.name).join(', ') : ''}
                  </p>
                </div>
              </div>
              : <>
                <Form.Item name="name" label="Full name" >
                  <Input placeholder="e.g. Emma Smith" />
                </Form.Item>
                {/* Email */}
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                  <Input disabled placeholder="e.g. smith@website.com" />
                </Form.Item>
                {/* Role Selection */}
                <Form.Item name="roles" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
                  <Select maxTagCount={2} mode="multiple" placeholder="Select role">
                    {roles.map((r) => (
                      <Select.Option key={r.id} value={r.id}>
                        {r.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>}

          </div>
        )}

        {/* Role */}

        {tab == 'role' && (
          <div className='mt-1'>
            <div className='flex mb-4 items-center gap-3'>
              <p className='text-sm font-medium'>Role name:</p>
              <Select
                onChange={(e) => setSelectedRoleId(e)}
                defaultValue={selectedRoleId}
                className='w-[150px]'
              >
                {Array.isArray(user?.role) && user?.role?.map(e => (
                  <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                ))}
              </Select>
            </div>
            {loadingRole
              ? <Permission />
              : <>
                {Object?.entries(permissions || [])?.map(([k, v]) => (
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
                ))}
              </>
            }
          </div>
        )}
      </Form>

    </Drawer>
  );
};

export default memo(ModalViewUser)
