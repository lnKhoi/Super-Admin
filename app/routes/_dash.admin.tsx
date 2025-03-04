import { createElement } from 'react';

import {
  Layout,
  Menu,
} from 'antd';
import Logo from '~/assets/logo.svg';
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

// Utility to render icons dynamically
const renderIcon = (Icon: React.ComponentType<any> | null, className = "h-5 w-5") => {
  return Icon ? createElement(Icon, { className }) : null;
};

// Sidebar Menu Component
function SidebarMenu({
  items,
}: {
  items: NavItem[];
  onLogout: () => void;
  permissions: Permission[];
}) {
  const location = useLocation();


  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[location.pathname]}
      style={{
        height: "100%",
        paddingTop:18,
        borderRight: 0,
        backgroundColor: "#F4F4F4",
      }}
    >
      {items.map((item) =>
        item.children ? (
          <SubMenu
            key={item.to}
            title={
              <div
                className="flex items-center gap-2"
                style={{
                  fontSize: 14,
                  alignItems: "center",
                  height: 36,
                  display: "flex",
                  width: "100%",
                  marginTop: 4,
                  marginBottom: 4,
                  marginLeft: 4,
                }}
              >
                {item.icon && renderIcon(item.icon)}
                <span>{item.label}</span>
              </div>
            }
          >
            {item.children.map((child) => (
              <Menu.Item key={child.to}>
                <Link to={child.to}>
                  <div className="flex items-center gap-2">
                    {child.icon && renderIcon(child.icon)}
                    <span>{child.label}</span>
                  </div>
                </Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item
            style={{ height: 36, marginTop: 4, width: 235, marginLeft: 10, padding: 10 }}
            key={item.to}
          >
            <Link to={item.to}>
              <div
                style={{ fontSize: 14, display: "flex" }}
                className="flex items-center h-full gap-2"
              >
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


// Main Page Component with Route Protection
function Page() {
  const { userInfo } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login')
    localStorage.clear()
    sessionStorage.clear()
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={258} className="h-[100vh] bg-[#f4f4f4] overflow-hidden">
        <div className="h-[60px] flex notification items-center bg-[#f4f4f4] border-b border-b-gray-200 pr-5 pl-[27px] justify-between">
          <img src={Logo} className="h-[24px]" alt="logo" />
        </div>
        <SidebarMenu
          items={navItems}
          onLogout={handleLogout}
          permissions={userInfo?.permissions as Permission[] || []}
        />
      </Sider>
      <div className="flex w-full bg-white  flex-col h-[100vh] overflow-y-scroll">
        <Outlet />
      </div>
    </Layout>
  );
}

export default Page;