import React, {
  ChangeEvent,
  FC,
  useEffect,
  useState,
} from 'react';

import { Button } from 'antd';
import TimezoneSelect, { type ITimezone } from 'react-timezone-select';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { updateUserInfo } from '~/apis/auth';
import Avatar from '~/assets/avatar.jpeg';
import { useAuthContext } from '~/contexts/auth.context';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

const ProfileDetails: FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { userInfo, handleRefreshUserInfo } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone | string>(
        userInfo?.brand?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const [formData, setFormData] = useState({
        brandName: "",
        email: "",
        phoneNumber: "",
    });

    // Update formData when userInfo changes
    useEffect(() => {
        if (userInfo) {
            setFormData({
                brandName: userInfo.name || "",
                email: userInfo.email || "",
                phoneNumber: userInfo.brand?.phone || "",
            });

            setSelectedTimezone(userInfo?.brand?.timezone as string)
        }
    }, [userInfo]);

    const handleCancel = () => {
        if (userInfo) {
            setFormData({
                brandName: userInfo.name || "",
                email: userInfo.email || "",
                phoneNumber: userInfo.brand?.phone || "",
            });
        }
        setIsEditing(false);
    };

    const handleSave = () => {
        setLoading(true);
        const payload = {
            timezone:
                typeof selectedTimezone === "string"
                    ? selectedTimezone
                    : selectedTimezone.value,
        };

        updateUserInfo(payload)
            .then((res) => {
                setIsEditing(false);
                handleRefreshUserInfo()
                toast.success("Update Brand Info Successfully!");

            })
            .catch((err) => toast.warning(err?.message))
            .finally(() => setLoading(false));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full mx-auto bg-white py-5 rounded-2xl border border-gray-200">
            <ToastContainer />
            <div className="flex items-center px-8 pb-4 justify-between border-b border-b-gray-200">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gray-100 border border-gray-100 hover:border-gray-200"
                    >
                        <PencilSquareIcon className="w-5 h-5 text-gray-800" /> Edit
                    </Button>
                )}
            </div>
            <div className="flex items-center px-8 mt-8 mb-6">
                <div className="w-[128px] h-[128px] rounded-full overflow-hidden">
                    <img
                        src={Avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="space-y-4 px-8 pb-3">
                <div className="flex items-center">
                    <label className="block text-sm w-[250px] text-gray-600">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${isEditing
                                ? "border-gray-300 focus:border-blue-500"
                                : "bg-gray-100"
                            }`}
                    />
                </div>

                <div className="flex items-center">
                    <label className="block w-[250px] text-sm text-gray-600">
                        Business Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                </div>

                <div className="flex items-center">
                    <label className="block text-sm w-[250px] text-gray-600">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                </div>

                <div className="flex hidden items-center">
                    <label className="block text-sm w-[250px] text-gray-600">
                        Timezone
                    </label>
                    <TimezoneSelect
                        isDisabled={!isEditing}
                        name="timezone"
                        className="w-full"
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                    />
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end mt-6 px-8 gap-3">
                    <Button type="default" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        type="primary"
                        loading={loading}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProfileDetails;
