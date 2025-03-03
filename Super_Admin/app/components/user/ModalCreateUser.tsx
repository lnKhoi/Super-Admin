import React, {
  FC,
  memo,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
} from 'antd';
import {
  createUserPermission,
  EditUserPayload,
  editUserPermission,
} from '~/apis/permission';
import { getRoles } from '~/apis/role';
import { Role } from '~/models/role.model';
import { UserPermission } from '~/models/User.model';

import CustomSelect from '../ui/CustomSelect';

type ModalCreateUserProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void
  user: string | UserPermission | any
  type: 'create-user' | 'edit-user'
};

const ModalCreateUser: FC<ModalCreateUserProps> = ({ open, onClose, onSuccess, type, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingPer, setLoadingPer] = useState<boolean>(false)
  const [emails, setEmails] = useState<string[]>([])
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = (values: EditUserPayload) => {
    setLoading(true);

    const API = type == 'create-user'
      ? createUserPermission({ ...values, emails: emails })
      : editUserPermission({ ...values }, user.id)

    API.then(() => {
      onSuccess(type)
      onClose()
    })
      .catch((err) => { messageApi.error(err.message); })
      .finally(() => { setLoading(false) });
  };

  const handleSubmit = () => {
    form.submit();
  };

  const handleGetRoles = () => {
    setLoadingPer(true)
    getRoles().then(res => {
      setRoles(res.data.data)
      if (type == 'edit-user') {
        form.setFieldsValue({
          email: user?.email,
          roles: Array.isArray(user.role)
            ? user.role.map((e: UserPermission) => typeof e == 'object' ? e?.id : '')
            : []
        })
      }
    })
      .finally(() => setLoadingPer(false))
  }

  useEffect(() => handleGetRoles(), [])

  useEffect(() => {
    if (type == 'edit-user') {
      form.setFieldsValue({ email: user.email, });
    } else {
      form.resetFields();
    }
  }, [user]);

  const handleSelectChange = (selected: string[]) => {
    setEmails(selected)
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<div className='flex items-center justify-center flex-col'>
        <h2 className='text-2xl font-semibold'>{type == 'create-user' ? 'Create' : 'Edit'} User</h2>
        {type == 'create-user' && <p className='text-sm font-normal mt-1'>Invite your members to review collaborating on your organization</p>}
      </div>}
      width={650}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button loading={loading} type="primary" onClick={handleSubmit}>
            {type == 'create-user' ? 'Create' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {type == 'create-user'
          ? <div className='mb-3 mt-8'>
            <p className='mb-1'><span className='text-red-500'>*</span> Email</p>
            <CustomSelect
              onChange={handleSelectChange}
            />
          </div>
          : <Form.Item name='email' label='Email' rules={[{ required: true, message: "Please enter an email" }]}>
            <Input disabled />
          </Form.Item>
        }

        {/* Role Selection */}
        <Form.Item name="roles" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
          <Select loading={loadingPer} maxTagCount={2} mode="multiple" placeholder="Select role">
            {roles.map((r) => (
              <Select.Option key={r.id} value={r.id}>
                {r.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(ModalCreateUser)
