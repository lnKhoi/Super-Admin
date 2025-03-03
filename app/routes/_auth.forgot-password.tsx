import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

import {
  Field,
  Form as FormikForm,
  Formik,
} from 'formik';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import * as Yup from 'yup';
import {
  forgotPassword,
  resendOTP,
} from '~/apis/auth';
import Logo from '~/assets/logo.svg';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  EMAIL_REQUIRED,
  INVALID_EMAIL,
} from '~/constants/messages.constant';

import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Spiral - Forgot Password" }];
};

// Yup schema validation
const validationSchema = Yup.object().shape({
  email: Yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
});

export default function Page() {
  const [email,setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const handleConfirmEmail = async (email: string) => {
    setLoading(true);
    setEmail(email)
    await forgotPassword(email)
      .then(() => setIsConfirmed(true))
      .catch((error) => toast.error(error?.message))
      .finally(() => setLoading(false));
  };

  const handleResendOTP = async () => {
      await resendOTP({email:email}).then( () =>  toast.success('Please check email to get new OTP'))
  };

  return (
    <div className="w-full mx-auto h-[100vh] flex items-center justify-center">
      <ToastContainer />
      <div className="mx-auto flex flex-col items-center w-[460px] h-full justify-center">
        <img className='mb-[170px]' src={Logo} alt="logo" />
        <h1 className="text-3xl mb-2 text-gray-900 font-bold">
          {isConfirmed ? 'Check Your Email' : 'Forgot Your Password'}
        </h1>
        {isConfirmed
          ? <div className="text-sm mb-[30px] text-gray-700 text-center">
              Thanks! If <span className='text-gray-950 font-semibold'>your email</span> matches an email we have on file, we've sent you an email containing further instructions for resetting your password.
              <br />
            </div>
          : <h1 className="text-sm mb-[30px] text-gray-700 text-center">
              Enter the email address associated with your account and we’ll send you a link to reset your password.
            </h1>
        }

        {isConfirmed && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleConfirmEmail(values.email)}
          >
            {({ values }) => (
              <span className='text-center text-sm text-gray-700'>
                If you haven't received an email in 5 minutes, check your spam,
                <br />
                <span onClick={handleResendOTP} className='underline text-blue-500 font-semibold cursor-pointer'>resend</span>, or try a different 
                <span onClick={(): void => setIsConfirmed(false)} className='underline cursor-pointer text-blue-500 font-semibold ml-[2px]'>email</span>.
              </span>
            )}
          </Formik>
        )}

        {!isConfirmed && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleConfirmEmail(values.email)}
          >
            {({ isSubmitting, isValid, dirty, touched, errors }) => (
              <FormikForm className="w-full mt-3">
                <div className="grid gap-2">
                  <Field
                    as={Input}
                    label='Email'
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    hasError={touched.email && !!errors.email}
                    errorMessage={touched.email && errors.email ? errors.email : ''}
                  />
                </div>
                <Button
                  size="lg"
                  loading={loading}
                  type="submit"
                  className="w-full mt-8"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Continue
                </Button>
              </FormikForm>
            )}
          </Formik>
        )}

        <div className="mt-4 text-center text-sm">
          Recovered your account?{" "}
          <Link to='/login' className="underline font-bold text-blue-500">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
