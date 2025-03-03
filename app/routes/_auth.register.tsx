import 'react-toastify/dist/ReactToastify.css';

import React, { useState } from 'react';

import {
  Button as AntButton,
  Checkbox,
  Form,
  Input,
  Select,
} from 'antd';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { registerBrand } from '~/apis/auth';
import LoginBanner from '~/assets/login-banner.png';
import Logo from '~/assets/logo.svg';
import PhoneNumberInput from '~/components/ui/input-country';
import { SignupPayload } from '~/models/User.model';
import { passwordRules } from '~/validators/account.validator';

import { EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from '@remix-run/react';

const { Option } = Select;

export default function Page() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [accepted, setAccepted] = useState<boolean>(true);
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [isShowCfPassword, setIsShowCfPassword] = useState<boolean>(false);

    const handleSubmit = async (values: SignupPayload) => {
        setLoading(true);
        const payload = { ...values, phone };

        await registerBrand(payload)
            .then((res) => {
                navigate(`/verify-otp/${res?.data?.userId}`, {
                    state: { email: values.email },
                });
            })
            .catch((err) => toast.error(err?.message))
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex h-[100vh] w-full items-center justify-between">
            <ToastContainer />
            <div className="flex min-h-full w-1/2 flex-col items-center justify-center">
                <img
                    src={Logo}
                    alt="logo"
                    className="mb-[30px] h-[45px] object-contain"
                />
                <h1 className="mb-[30px] text-3xl font-bold text-black">Sign up</h1>
                <Form
                    name="register"
                    className="w-[460px]"
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        category: [],
                    }}
                >
                    {/* Full Name Field */}
                    <Form.Item
                        label="Brand Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Full name is required.' },
                        ]}
                    >
                        <Input placeholder="e.g. John Marr" />
                    </Form.Item>

                    {/* Email Field */}
                    <Form.Item
                        label="Business Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email is required.' },
                            { type: 'email', message: 'Invalid email address.' },
                        ]}
                    >
                        <Input placeholder="m@example.com" />
                    </Form.Item>

                    {/* Phone Number Field */}
                    <Form.Item label="">
                        <PhoneNumberInput value={phone} onChange={setPhone} />
                    </Form.Item>

                    {/* Password Field */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={passwordRules}
                    >
                        <div className="relative">
                            <Input
                                type={isShowPassword ? 'text' : 'password'}
                                className="pr-10"
                            />
                            <EyeIcon
                                onClick={() => setIsShowPassword(!isShowPassword)}
                                className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-500"
                            />
                        </div>
                    </Form.Item>

                    {/* Confirm Password Field */}
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match.'));
                                },
                            }),
                        ]}
                    >
                        <div className="relative">
                            <Input
                                type={isShowCfPassword ? 'text' : 'password'}
                                className="pr-10"
                            />
                            <EyeIcon
                                onClick={() => setIsShowCfPassword(!isShowCfPassword)}
                                className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-500"
                            />
                        </div>
                    </Form.Item>

                    <div className="flex items-center gap-4">
                        <Checkbox
                            defaultChecked={accepted}
                            onChange={e => setAccepted(e.target.checked)}
                        >
                            <div className="text-sm leading-5 text-gray-800">
                                By clicking on signup you agree to{' '}
                                <a href="/privacy-policy" target="_blank">
                                    <span className="cursor-pointer underline">
                                        Terms of Services
                                    </span>{' '}
                                    and{' '}
                                    <span className="cursor-pointer underline">
                                        Privacy Policy
                                    </span>
                                </a>
                            </div>
                        </Checkbox>
                    </div>

                    <AntButton
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={!accepted}
                        className="mt-4 w-full h-[45px]"
                    >
                        Sign Up
                    </AntButton>

                    <div className="mt-4 text-center text-sm text-gray-800">
                        Already have an account?{' '}
                        <a href="/login" className="font-bold text-blue-500 underline">
                            Log in
                        </a>
                    </div>
                </Form>
            </div>
            <div className="h-full w-1/2">
                <img
                    src={LoginBanner}
                    alt="banner"
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
}
