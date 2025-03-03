import React, {
  useEffect,
  useState,
} from 'react';

import ModalRequireChangePassword
  from '~/components/profile/ModalRequireChangePassword';
import { useAuthContext } from '~/contexts/auth.context';

function Dashboard() {
  const [requrieChangePw, setRequireChangePw] = useState<boolean>(false)
  const { userInfo, handleRefreshUserInfo } = useAuthContext()

  // Require change password with invited account
  useEffect(() => {
    userInfo?.isDefaultPassword ? setRequireChangePw(true) : setRequireChangePw(false)
  }, [userInfo])

  return (
    <div>
      {requrieChangePw && <ModalRequireChangePassword onclose={() => setRequireChangePw(false)} open={requrieChangePw} />}
    </div>
  )
}

export default Dashboard
