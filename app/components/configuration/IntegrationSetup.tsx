import React, { useState } from 'react';

import {
  message,
  Switch,
} from 'antd';
import { updateIntegration } from '~/apis/configuration';
import Shopify from '~/assets/shopify.png';
import Woo from '~/assets/woo.png';
import { CustomConfig } from '~/models/configuration.model';

type IntegrationSetupProps = {
    mainConfig?: CustomConfig;
    onSuccess: (newConfig: CustomConfig) => void
};

function IntegrationSetup({ mainConfig, onSuccess }: IntegrationSetupProps) {
    const [integration, setIntegration] = useState<string[]>(mainConfig?.integration ?? []);

    const handleToggle = (platform: string, checked: boolean) => {
        setIntegration((prev) => {
            const integration = checked
                ? [...prev, platform]
                : prev.filter((item) => item !== platform); // Remove if unchecked

            const payload = { integration }

            updateIntegration(mainConfig?.id as string, payload as any)
                .then(res => {
                    message.success('Update Integration successfully!')
                    onSuccess(res.data)
                })
            return integration;
        });
    };

    if (!mainConfig) return null;

    return (
        <div>
            <h2 className="font-medium text-xl text-gray-800">Integration Setup</h2>
            <p className="mt-2 text-xs text-gray-500">The comprehensive directory of integration</p>

            <div className="mt-12 flex items-center gap-6">
                {/* Shopify Card */}
                <div className="rounded-lg border max-w-[396px] flex flex-col border-gray-200 p-4 shadow-sm">
                    <img src={Shopify} className="w-12 h-12 object-cover" alt="shopify" />
                    <p className="text-base font-medium text-black mt-3">Shopify</p>
                    <p className="mt-2 text-sm text-gray-500">
                        E-commerce platform for building and managing online stores with ease.
                    </p>
                    <div className="flex mt-6 gap-2 items-center">
                        <Switch
                            onChange={(checked) => handleToggle("shopify", checked)}
                            checked={integration.includes("shopify")}
                            className="w-[42px]"
                        />
                        <p className="text-xs font-normal">Active</p>
                    </div>
                </div>

                {/* WooCommerce Card */}
                <div className="rounded-lg border max-w-[396px] flex flex-col border-gray-200 p-4 shadow-sm">
                    <img src={Woo} className="w-12 h-12 object-cover" alt="woocommerce" />
                    <p className="text-base font-medium text-black mt-3">WooCommerce</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Powerful WordPress plugin for creating and managing online stores.
                    </p>
                    <div className="flex mt-6 gap-2 items-center">
                        <Switch
                            onChange={(checked) => handleToggle("woocommerce", checked)}
                            checked={integration.includes("woocommerce")}
                            className="w-[42px]"
                        />
                        <p className="text-xs font-normal">Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntegrationSetup;
