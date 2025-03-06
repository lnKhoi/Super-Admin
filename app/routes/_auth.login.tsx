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
import { login } from '~/apis/auth';
import Background from '~/assets/login-bg.png';
import Logo from '~/assets/logo.svg';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  EMAIL_REQUIRED,
  INVALID_EMAIL,
} from '~/constants/messages.constant';

import { MetaFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Spiral - Login" }];
};

// Yup schema validation
const validationSchema = Yup.object().shape({
  email: Yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
});


export default function Page() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    await login(values.email)
      .then((res) => {
        navigate(`/verify-otp`, { state: { email: values.email } })
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setLoading(false))
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="w-full mx-auto h-[100vh] flex items-center bg-white justify-center"
    >

      <ToastContainer />
      <img className='absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={Logo} alt="logo" />
      <div className="mx-auto flex flex-col items-center p-8 rounded-2xl shadow-md w-[460px]  bg-white">
        <h1 className="text-3xl  text-black font-bold">
          Log in to Admin Portal
        </h1>
        <p className='text-sm mt-2 text-gray-700 font-normal mb-2'>Welcome back! Please enter your email</p>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          validateOnChange={true}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, handleChange }) => {
            return (
              <>
                <FormikForm className="mt-[30px] w-full">
                  <div className="grid w-full  gap-4">
                    <div className="grid gap-2">
                      <Field
                        onChange={handleChange}
                        as={Input}
                        id="email"
                        label='Email'
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        hasError={touched.email && !!errors.email}
                        errorMessage={touched.email && errors.email ? errors.email : ''}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="default"
                      loading={loading}
                      className="w-full mt-1"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                  </div>
                </FormikForm>
              </>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
