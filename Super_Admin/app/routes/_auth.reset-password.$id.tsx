import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
} from 'formik';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import * as Yup from 'yup';
import { resetPassword } from '~/apis/auth';
import Logo from '~/assets/logo.svg';
import Success_IC from '~/assets/tick-circle.png';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  CONFIRM_PASSWORD_REQUIRED,
  PASSWORD_MISSMATCH,
} from '~/constants/messages.constant';
import { createPasswordValidationSchema } from '~/validators/account.validator';

import type { MetaFunction } from '@remix-run/cloudflare';
import {
  useNavigate,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [
        { title: "Spiral - Reset Password" },
    ];
};

export const resetPasswordValidationSchema = Yup.object().shape({
    password: createPasswordValidationSchema(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], PASSWORD_MISSMATCH)
        .required(CONFIRM_PASSWORD_REQUIRED),
});

export default function Page() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const handleSubmit = async (values: { password: string, confirmPassword: string }) => {
        setLoading(true)
        await resetPassword(values.password, values.confirmPassword, id as string)
            .then(() => setIsSuccess(true))
            .catch((err) => { setIsSuccess(false); toast.error(err?.message) })
            .finally(() => setLoading(false))
    };

    return (
        <div className="w-full mx-auto h-[100vh] flex items-center justify-center">
            <ToastContainer />
            <div className="mx-auto flex flex-col items-center w-[460px] h-full justify-center">
                <img className='mb-[170px]' src={Logo} alt="logo" />
                {isSuccess && <img className='mb-8' src={Success_IC} />}
                <h1 className="text-3xl mb-2 text-gray-900 font-bold">
                    {isSuccess ? 'Password Updated!' : 'Reset Your Password'}
                </h1>
                <p className='text-gray-700 text-sm text-center w-[359px]'>
                    {isSuccess
                        ? 'Your password has been changed successfully. Use your new password to log in.'
                        : 'To complete your password reset, please enter your new password below:'}
                </p>
                {!isSuccess && (
                    <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={resetPasswordValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <FormikForm className="w-full mt-10 flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New password</Label>
                                    <Field
                                        as={Input}
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm password</Label>
                                    <Field
                                        as={Input}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                                </div>
                                <Button
                                    type="submit"
                                    size='lg'
                                    loading={loading}
                                    className="w-full mt-8"
                                    disabled={isSubmitting}
                                >
                                    Continue
                                </Button>
                            </FormikForm>
                        )}
                    </Formik>
                )}
                {isSuccess && (
                    <div className='mt-8 w-[460px]'>
                        <Button onClick={(): void => navigate('/login')} className='w-full' size='lg' >
                            Login now
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}