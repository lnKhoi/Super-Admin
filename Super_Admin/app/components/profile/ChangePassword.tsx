import { useState } from 'react';

import {
  Button,
  Form,
  Input,
  message,
} from 'antd';
import {
  changePassword,
  ChangePasswordPayload,
  updatePasswordDefault,
} from '~/apis/auth';
import { PASSWORD_REGEX } from '~/constants/regex.constant';
import { useAuthContext } from '~/contexts/auth.context';

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading,setLoading] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const {handleRefreshUserInfo} = useAuthContext()

  const validatePassword = (_: any, value: string) => {
    if (!value || PASSWORD_REGEX.test(value)) {
      setPasswordError('');
      return Promise.resolve();
    }
    setPasswordError('Password must be 8-20 characters long and contain at least one number, one uppercase, and one special character.');
    return Promise.reject(new Error(passwordError));
  };

  const onFinish = (values: ChangePasswordPayload) => {
    setLoading(true)
    changePassword(values).then(res => {
      updatePasswordDefault()
      messageApi.success('New password has been updated successfully!')
      form.resetFields()
      handleRefreshUserInfo()
    })
    .catch(err => messageApi.error(err?.message))
    .finally(() => setLoading(false))
  };

  return (
    <div className="flex items-center justify-center">
      {contextHolder}
      <div className="bg-white  w-[460px]">
        <h2 className="text-2xl font-semibold text-center">Change Password</h2>
        <p className="text-sm text-gray-500 font-medium w-[358px] mx-auto text-center mb-[40px]">To complete your change password, please enter your password below:</p>
        
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="Current password" name="oldPassword" rules={[{ required: true, message: 'Please enter your current password!' }]}>
            <Input.Password className="h-10" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>

          <Form.Item label="New password" name="newPassword" rules={[{ validator: validatePassword }]}
            validateStatus={passwordError ? 'error' : ''} help={passwordError}>
            <Input.Password className="h-10" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>

          <Form.Item label="Confirm new password" name="confirmNewPassword" dependencies={['newPassword']} rules={[{ required: true, message: 'Please confirm your new password!' }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            })]}>
            <Input.Password className="h-10" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" className="w-full mt-4 h-10 bg-blue-600 hover:bg-blue-700">Confirm</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
