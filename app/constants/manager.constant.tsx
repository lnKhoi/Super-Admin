import { FC } from 'react';

import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  EyeIcon,
  PencilSquareIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  TrashIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
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
  { to: "/admin/overview", icon: Squares2X2Icon, label: "Overview" },
  { to: "/admin/users", icon: UsersIcon, label: "Users" },
  { to: "/admin/organizations", icon: Square3Stack3DIcon, label: "Organizations" },
  { to: "/admin/billing", icon: CheckBadgeIcon, label: "Billing" },
  { to: "/admin/configurations", icon: WrenchScrewdriverIcon, label: "Configuration" },
  { to: "/admin/settings", icon: Cog6ToothIcon, label: "Settings" },
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

