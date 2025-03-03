import { useEffect } from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { getMe } from '~/apis/auth';
import { useAuthContext } from '~/contexts/auth.context';

export const useCheckAuth = () => {
    const navigate = useNavigate();
    const { updateUserInfo } = useAuthContext();
    const location = useLocation()

    const getUserInfo = async (): Promise<void> => {
        try {
            const res = await getMe();
            updateUserInfo(res.data);
            location.pathname ==='/' && navigate('/manager/dashboard')
           
        } catch (error) {
            updateUserInfo(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);
};
