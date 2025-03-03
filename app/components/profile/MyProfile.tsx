import React from 'react';

import { Tabs } from 'antd';
import { integrationTabs } from '~/constants/myProfile.constant';

function MyProfile() {

    const onChange = (key: string) => {
    };

    return (
        <div>
            <Tabs defaultActiveKey="shopify" items={integrationTabs} onChange={onChange} />
        </div>
    )
}

export default MyProfile
