import React, { FC } from 'react';

import { Skeleton } from 'antd';

const PaymentMethodsSkeleton: FC = () => {
    return (
        <div className="mt-5 px-5 py-4 rounded-xl flex items-center justify-between mx-8 border border-dashed">
            <div className="flex items-center gap-3">
                {/* Skeleton for the card brand logo */}
                <Skeleton.Node active style={{ width: 67 ,height:39}} />

                <div className="flex flex-col">
                    {/* Skeleton for the brand name */}
                    <Skeleton.Node active style={{ width: 80,height:20 }} />
                    {/* Skeleton for the card expiration */}
                    <Skeleton.Node active style={{ width: 190,height:20 }} />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Skeleton.Avatar active shape="square" size="default" />
                <Skeleton.Avatar active shape="square" size="default" />
            </div>
        </div>
    );
};

export default PaymentMethodsSkeleton;
