import React from 'react';

import Avatar from '~/assets/avatar.jpeg';

type NotificationItemProps = {
    isUnread: boolean
}

function NotificationItem({ isUnread }: NotificationItemProps) {

    return (
        <div
            className={`flex items-start gap-3 p-4 cursor-pointer border-b border-b-gray-200 transition-all border-gray-200 
            ${isUnread ? 'bg-blue-50 hover:bg-blue-50' : 'bg-white hover:bg-gray-100'} `}
        >
            <img
                src={Avatar}
                className="w-[36px] h-[36px] object-cover rounded-full"
                alt="avatar"
            />

            {/* Text Section */}
            <div className="flex-1">
                <p className="text-sm text-gray-800 leading-5">
                    <span className="font-semibold">[Influencer Name]</span>
                    <span className="font-normal mx-1 text-gray-800">extended the deadline in </span>
                    <span className="font-semibold">[Campaign Name]</span>
                </p>
                <span className="text-xs text-gray-500">3 min ago</span>
            </div>

            {/* Unread Indicator (Blue Dot) */}
            {isUnread && <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></div>}
        </div>
    );
}

export default NotificationItem;
