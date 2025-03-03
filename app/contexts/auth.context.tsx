import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { getMe } from '~/apis/auth';
import { Permission } from '~/models/role.model';
import { User } from '~/models/User.model';

import { useNavigate } from '@remix-run/react';

type AuthContextType = {
    userInfo: User | null;
    updateUserInfo: (newValue: User | null) => void;
    handleLogout: () => void
    onPayment: boolean,
    setOnPayment: Dispatch<SetStateAction<boolean>>
    handleRefreshUserInfo: () => void
    hasPermission: (requiredPermissions: Permission | Permission[]) => boolean | undefined
}
const MyContext = createContext<AuthContextType | undefined>(undefined);
type AuthContextProviderProps = { children: ReactNode }
const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const navigate = useNavigate()
    const [onPayment, setOnPayment] = useState<boolean>(false)

    const updateUserInfo = (info: User | null) => {
        setUserInfo(info);
    };

    const handleLogout = (): void => {
        localStorage.clear()
        sessionStorage.clear()
        navigate('/logout')
    }

    const handleRefreshUserInfo = async (): Promise<void> => {
        await getMe().then((res) => {
            setUserInfo(res?.data);
        });
    };


    const hasPermission = (requiredPermissions: Permission | Permission[]) => {
        if (Array.isArray(requiredPermissions)) {
            return requiredPermissions.every((perm) => userInfo?.permissions?.includes(perm));
        }
        return userInfo?.permissions.includes(requiredPermissions);
    };

    return (
        <MyContext.Provider value={{ userInfo, updateUserInfo, handleLogout, handleRefreshUserInfo, onPayment, setOnPayment, hasPermission }}>
            {children}
        </MyContext.Provider>
    );
};
const useAuthContext = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('AuthContext must be used within a AuthContextProvider');
    }
    return context;
};
export { AuthContextProvider, useAuthContext };