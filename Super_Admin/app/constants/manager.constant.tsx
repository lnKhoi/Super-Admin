import { FC } from 'react';

import {
  ArchiveBoxIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  EyeIcon,
  FireIcon,
  HomeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export type NavItem = {
  to: string;
  label: string;
  icon?: FC<{ className?: string }> | null;
  permissions?: string[];
  children?: NavItem[];
  active?: string;
}


export const navItems: NavItem[] = [
  { to: "/manager/dashboard", icon: HomeIcon, label: "Dashboard" },
  {
    to: "/manager/campaigns",
    icon: FireIcon,
    label: "Campaigns",
    permissions: ['view-campaign']
  },
  {
    to: "/manager/creators",
    icon: UserIcon,
    label: "Creators",
    permissions: ['view-imported-influencer']
  },
  {
    to: "/manager/contents",
    icon: DocumentChartBarIcon,
    label: "Contents",
    permissions: ['view-content']
  },
  {
    to: "",
    icon: ArchiveBoxIcon,
    label: "Products",
    permissions: ['view-influencer-orders'],
    children: [
      { label: 'Order Tracking', to: '/manager/products/order-tracking', icon: null,  permissions: ['view-influencer-orders'], },
    ],
  },
  {
    to: "/manager/finance",
    icon: ChartBarSquareIcon,
    label: "Finance",
    permissions: ['view-finance-overview']
  },
  {
    to: "/manager/analytics",
    icon: ChartBarIcon,
    label: "Analytics",
  },
  {
    to: "/",
    icon: Cog6ToothIcon,
    label: "Settings",
    children: [
      { label: 'Users', to: '/manager/users-permission', icon: null, permissions: ['view-user'] },
      { label: 'Roles', to: '/manager/roles', icon: null, permissions: ['view-role'] },
      { label: 'Permissions', to: '/manager/permissions', icon: null, permissions: ['view-permissions'] },
    ],
  },
];

export const profileTab = [
  { to: "/manager/my-profile", icon: UserCircleIcon, label: "My Profile", active: 'Profile Details' },
  { to: "#", icon: Cog6ToothIcon, label: "Setting", active: 'Profile Details' },
  { to: "/manager/my-profile", icon: CreditCardIcon, label: "Payment Methods", active: 'Billing' },
];

export const campaignMenuItems = [
  {
    key: 'invite',
    permission:'invite-imported-influencers',
    icon: <UserPlusIcon width={16} color='#1F2937' />,
    label: 'Invite',
  },
  {
    key: 'view',
    icon: <EyeIcon width={16} color='#1F2937' />,
    label: 'View details',
  },
  {
    key: 'edit',
    icon: <PencilSquareIcon width={16} color='#1F2937' />,
    label: 'Edit',
    permission: 'edit-campaign'
  },
  {
    key: 'delete',
    icon: <TrashIcon width={16} color='#1F2937' />,
    label: 'Delete',
    permission: 'delete-campaign'
  },
];

