import React from 'react';

import { CheckIcon } from '@heroicons/react/24/outline';

import NotificationItem from './NotificationItem';

function Notification() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex py-3 px-4 justify-between items-center">
        <p className="font-semibold text-gray-800 text-base">Notification</p>
        <div className="flex items-center gap-1 cursor-pointer">
          <CheckIcon className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 text-xs font-normal">Mark as read</span>
        </div>
      </div>

      {/* Scrollable Notification List */}
      <div className="h-[300px] notification flex flex-col overflow-y-scroll notification-scroll">
        <NotificationItem isUnread />
        <NotificationItem isUnread={false} />
        <NotificationItem isUnread={false} />
        <NotificationItem isUnread={false} />
      </div>
    </div>
  );
}

export default Notification;
