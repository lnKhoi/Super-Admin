import React, {
  cloneElement,
  useState,
} from 'react';

import {
  Avatar,
  Dropdown,
  Menu,
} from 'antd';
import { toast } from 'react-toastify';
import { deleteCampaign } from '~/apis/campaign';
import DefaultAvatar from '~/assets/avatar.jpeg';
import { campaignMenuItems } from '~/constants/manager.constant';
import {
  DELETE_CAMPAGIN_SUCCESS,
  DELETE_CAMPAIGN_FAILED,
} from '~/constants/messages.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { getColorStatusCampaign } from '~/helpers/campaign.helper';
import { Campaign } from '~/models/Campaign.model';
import { Permission } from '~/models/role.model';

import {
  EllipsisHorizontalIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from '@remix-run/react';

import ModalInviteInfluencerToCampaign from './ModalInviteInfluencerToCampaign';

type CampaignCardProps = {
    campaign: Campaign;
    onReload: () => void;
};

function CampaignCard({ campaign, onReload }: CampaignCardProps) {
    const navigate = useNavigate();
    const { hasPermission } = useAuthContext();
    const [isModal, setIsModal] = useState<boolean>(false);

    const handleMenuClick = (key: string) => {
        switch (key) {
            case 'invite':
                hasPermission('invite-imported-influencers') && setIsModal(true);
                break;
            case 'view':
                navigate(`/manager/${campaign.id}`);
                break;
            case 'edit':
                hasPermission('edit-campaign') && navigate(`/manager/edit/${campaign.id}`);
                break;
            case 'delete':
                campaign.joinedCreators?.length == 0 && handleDeleteCampaign();
                break;
            default:
                break;
        }
    };

    const handleDeleteCampaign = async (): Promise<void> => {
        await deleteCampaign(campaign.id as string)
            .then(() => {
                toast.success(DELETE_CAMPAGIN_SUCCESS);
                onReload();
            })
            .catch(() => {
                toast.error(DELETE_CAMPAIGN_FAILED);
            });
    };

    const menu = (
        <Menu className="custom-menu-card">
            {campaignMenuItems.map((item) => {
                const isDisabledByCreators = (item.key === 'delete' || item.key === 'edit') && (campaign.joinedCreators?.length ?? 0) > 0;
                const isDisabledByPermission = item.permission ? !hasPermission(item.permission as Permission) : false;
                const isDisabled = isDisabledByCreators || isDisabledByPermission;

                return (
                    <Menu.Item
                        disabled={isDisabled}
                        key={item.key}
                        onClick={(e) => {
                            if (!isDisabled) {
                                handleMenuClick(item.key);
                            } else {
                                e.domEvent.preventDefault();
                                e.domEvent.stopPropagation();
                            }
                        }}
                    >
                        <div className="flex gap-2 items-center">
                            {cloneElement(item.icon, {
                                color: isDisabled ? '#A0A0A0' : '#1F2937',
                            })}
                            {item.label}
                        </div>
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    return (
        <div>
            <div
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                        hasPermission('view-campaign') &&
                        !target.closest('.dropdown-button') &&
                        !target.closest('.invite-button') &&
                        !target.closest('.ant-dropdown-menu')
                    ) {
                        navigate(`/manager/${campaign.id}`);
                        localStorage.setItem('campaignTab', 'Campaign Details');
                    }
                }}
                className="h-[300px] z-0 cursor-pointer relative p-5 border flex flex-col justify-between border-gray-200 hover:shadow-lg transition-shadow rounded-[20px] shadow-md"
            >
                <div className="items-center flex justify-between">
                    <div
                        style={{ backgroundColor: getColorStatusCampaign(campaign.status)?.background }}
                        className="inline-flex items-center px-4 gap-1 rounded-[50px] h-[28px]"
                    >
                        <div
                            style={{ backgroundColor: getColorStatusCampaign(campaign.status)?.color }}
                            className="w-2 h-2 rounded-[50%]"
                        ></div>
                        <span
                            style={{ color: getColorStatusCampaign(campaign.status)?.color }}
                            className="text-[12px] capitalize"
                        >
                            {campaign.status}
                        </span>
                    </div>
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        overlayClassName="dropdown-overlay" // Add class for debugging if needed
                    >
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="dropdown-button hover:bg-gray-300 bg-gray-100 transition-all w-7 h-7 flex justify-center items-center rounded-md"
                        >
                            <EllipsisHorizontalIcon width={20} />
                        </button>
                    </Dropdown>
                </div>
                <div>
                    <h5 className="text-sm text-[#1F2937] truncate font-medium">{campaign.name}</h5>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-1/2 p-3 h-[100px] flex flex-col justify-between rounded-xl bg-[#F3F4F6]">
                        <p className="text-sm text-[#6B7280] font-semibold">Revenue on investment</p>
                        <p className="mt-2 text-[#111827] font-semibold text-[18px]">0.00 %</p>
                    </div>
                    <div className="w-1/2 p-3 h-[100px] rounded-xl bg-[#F3F4F6]">
                        <p className="text-sm text-[#6B7280] font-semibold">Performance (CVR ETC)</p>
                        <p className="mt-2 text-[#111827] font-semibold text-[18px]">0.00 %</p>
                    </div>
                </div>
                <div className="flex items-center">
                    {hasPermission('invite-imported-influencers') && (campaign.joinedCreators?.length ?? 0) === 0 && (
                        <button
                            onClick={(e) => {
                                setIsModal(true);
                                e.stopPropagation();
                            }}
                            className="invite-button bg-[#F3F4F6] hover:bg-[#D1D5DB] transition-all flex items-center justify-center gap-1 text-sm h-[36px] w-[87px] font-semibold rounded-[8px] text-[#1F2937]"
                        >
                            <UserPlusIcon width={16} /> Invite
                        </button>
                    )}
                    <Avatar.Group
                        className="h-[36px] w-[36px]"
                        size="large"
                        max={{
                            count: 4,
                            style: { color: '#374151', backgroundColor: '#F3F4F6', cursor: 'pointer' },
                            popover: { trigger: 'click' },
                        }}
                    >
                        {campaign.joinedCreators?.map((u) => (
                            <Avatar
                                className="w-[36px] min-w-[36px] h-[36px] object-cover"
                                src={u?.avatarUrl || DefaultAvatar}
                            />
                        ))}
                    </Avatar.Group>
                </div>
            </div>
            {isModal && (
                <ModalInviteInfluencerToCampaign
                    campaignId={campaign.id as string}
                    open={isModal}
                    onClose={() => setIsModal(false)}
                />
            )}
        </div>
    );
}

export default CampaignCard;