import 'react-toastify/dist/ReactToastify.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  toast,
  ToastContainer,
} from 'react-toastify';
import {
  getMe,
  OTPPayload,
  resendOtp,
  verifyOTP,
} from '~/apis/auth';
import Background from '~/assets/login-bg.png';
import Logo from '~/assets/logo.svg';
import Loading from '~/components/ui/loading';
import { useAuthContext } from '~/contexts/auth.context';
import { useCountdown } from '~/hooks/useCountdown';

import { MetaFunction } from '@remix-run/cloudflare';
import {
  useLocation,
  useNavigate,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Verify OTP' }];
};

export default function Page() {
  const { id } = useParams();
  const location = useLocation();

  const {updateUserInfo} = useAuthContext()
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [err, setErr] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { time, startCountdown, resetCountdown } = useCountdown(600);
  const { time: time2, startCountdown: start2, isRunning, resetCountdown: reset2 } = useCountdown(60);

  const handleReset = (): void => {
    reset2();
    handleResendOtp()
    resetCountdown();
    startCountdown();
    start2();
    setOtp(Array(6).fill('')); // Reset OTP
    setErr(''); // Clear error
  };

  const handleResendOtp = () => {
    resendOtp(location?.state?.email).then(() => {
      toast.success('Please check email to get new OTP');
    })
  }

  const handleVerifyOTP = async (): Promise<void> => {
    setLoading(true);
    const otpString = otp.join('');
    const payload = { otp: otpString, email: location?.state?.email };

    await verifyOTP(payload as OTPPayload)
      .then((res) => {
        toast.success('Verify successfully!');
        localStorage.setItem('remix_us_tk',res.data.id)
        handleLogin()
      })
      .catch((err) => {
        setErr(err?.message || 'Verification failed.');
        setOtp(Array(6).fill('')); // Reset OTP on failure
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (value: string, index: number) => {
    const updatedOtp = [...otp];

    const characters = value.split('');
    let currentIndex = index;

    characters.forEach((char) => {
      if (currentIndex < otp.length) {
        updatedOtp[currentIndex] = char;
        currentIndex += 1;
      }
    });

    setOtp(updatedOtp);

    if (currentIndex < otp.length) {
      const nextInput = document.getElementById(`otp-${currentIndex}`);
      nextInput?.focus();
    }
  };

  const handleLogin = async (): Promise<void> => {
    await getMe().then((res) => {
        updateUserInfo(res.data)
        navigate('/admin/overview')
    }).catch((err) => toast.error(err?.message))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    startCountdown();
    start2();
  }, []);

  // Trigger OTP verification when all fields are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleVerifyOTP();
    }
  }, [otp]);

  useEffect(() => {
    location?.state?.email == null && navigate('/login')
  }, [location])

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="flex h-screen w-full items-center justify-center bg-gray-100">
      <ToastContainer />
      <img className='absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={Logo} alt="logo" />
      <div className="flex  flex-col items-center justify-center w-[460px] h-[352px] bg-white rounded-2xl shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Email Verification</h1>
        <p className="text-sm text-gray-600">A Verification code has been sent to</p>
        <span className="mt-1 text-sm font-bold text-gray-700">
          {location?.state?.email}
        </span>
        <div className="mt-6 text-sm text-gray-600">OTP Expires in: <span className="font-bold">{time}s</span></div>

        <div className="mt-8 flex gap-2">
          {otp.map((digit, index) => (
            <input
              id={`otp-${index}`}
              key={index}
              maxLength={otp.length - index}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-bold text-gray-700"
            />
          ))}
        </div>

        {err && <span className="mt-4 text-sm text-red-500">{err}</span>}

        {loading && (
          <div className="flex items-center mt-4 gap-2">
            <Loading />
            <p className="text-gray-600">Verifying your code...</p>
          </div>
        )}

        <div className="flex items-center mt-6 gap-2">
          <p className="text-sm text-gray-600">Didn’t receive the code?</p>
          <button
            onClick={() => (isRunning ? null : handleReset())}
            disabled={isRunning}
            className={`text-sm font-bold ${isRunning ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
              }`}
          >
            Resend Code {isRunning && <span>({time2}s)</span>}
          </button>
        </div>
      </div>

    </div>
  );
}
