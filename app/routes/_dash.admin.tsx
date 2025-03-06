import {
  createElement,
  useState,
} from 'react';

import {
  Layout,
  Menu,
} from 'antd';
import Logo from '~/assets/logo.svg';
import CustomConfig from '~/components/configuration/CustomConfig';
import {
  NavItem,
  navItems,
} from '~/constants/manager.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Permission } from '~/models/role.model';

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from '@remix-run/react';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Utility function to render icons dynamically
const renderIcon = (Icon: React.ComponentType<any> | null, className = "h-5 w-5") => {
  return Icon ? createElement(Icon, { className }) : null;
};

function SidebarMenu({
  items,
  onLogout,
  permissions,
  activeCustomConfig,
  setActiveCustomConfig,
  activeMenuItem,
  setActiveMenuItem,
}: {
  items: NavItem[];
  onLogout: () => void;
  permissions: Permission[];
  activeCustomConfig: boolean;
  setActiveCustomConfig: (active: boolean) => void;
  activeMenuItem: string | null;
  setActiveMenuItem: (key: string | null) => void;
}) {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={activeCustomConfig ? [] : [activeMenuItem || location.pathname]}
      onClick={({ key }) => {
        setActiveMenuItem(key); // Activate menu item
        setActiveCustomConfig(false); // Deactivate CustomConfig
      }}
      style={{
        paddingTop: 18,
        borderRight: 0,
        backgroundColor: "#F4F4F4",
      }}
    >
      {items.map((item) =>
        item.children ? (
          <SubMenu
            key={item.to}
            title={
              <div className="flex items-center gap-2 text-sm font-medium">
                {item.icon && renderIcon(item.icon)}
                <span>{item.label}</span>
              </div>
            }
          >
            {item.children.map((child) => (
              <Menu.Item key={child.to}>
                <Link to={child.to}>
                  <div className="flex nav-item items-center gap-2">
                    {child.icon && renderIcon(child.icon)}
                    <span>{child.label}</span>
                  </div>
                </Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={item.to} style={{ height: 36, marginTop: 4, width: 237, marginLeft: 11, padding: 10 }}>
            <Link to={item.to}>
              <div className="flex items-center h-full gap-2 text-sm font-medium">
                {item.icon && renderIcon(item?.icon)}
                {item.label}
              </div>
            </Link>
          </Menu.Item>
        )
      )}
    </Menu>
  );
}

function Page() {
  const { userInfo } = useAuthContext();
  const navigate = useNavigate();
  const [activeCustomConfig, setActiveCustomConfig] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

  const handleLogout = () => {
    navigate('/login');
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={258} className="h-[100vh] bg-[#f4f4f4] overflow-hidden">
        <div className="h-[60px] flex notification items-center bg-[#f4f4f4] border-b border-b-gray-200 pr-5 pl-[27px] justify-between">
          <img src={Logo} className="h-[24px]" alt="logo" />
        </div>
       
          <SidebarMenu
            items={navItems.slice(0, navItems.length - 1)}
            onLogout={handleLogout}
            permissions={userInfo?.permissions as Permission[] || []}
            activeCustomConfig={activeCustomConfig}
            setActiveCustomConfig={setActiveCustomConfig}
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
          />
    
        <CustomConfig activeCustomConfig={activeCustomConfig} setActiveCustomConfig={setActiveCustomConfig} setActiveMenuItem={setActiveMenuItem} />
      </Sider>
      <div className="flex w-full bg-white flex-col h-[100vh] overflow-y-scroll">
        <Outlet />
      </div>
    </Layout>
  );
}

export default Page;
