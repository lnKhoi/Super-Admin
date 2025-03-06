import React, { useState } from 'react';

import {
  Button,
  Table,
} from 'antd';
import { PolicyAndConditionColumns } from '~/constants/config.constant';

import { PlusIcon } from '@heroicons/react/24/outline';

import CreatePolicy from './CreatePolicy';

function PolicyAndConditions() {
    const [createPolicy, setCreatePolicy] = useState<boolean>(false)

    return (
        <>
            {createPolicy ? <CreatePolicy onClose={() => setCreatePolicy(false)} />
                : <>
                    <h2 className='font-medium  text-xl text-gray-800'>Policy and Conditions Management</h2>
                    <p className='mt-2 text-xs text-gray-500'>The comprehensive directory of integration</p>
                    <div className='border border-gray-200 max-w-[816px] mt-12 rounded-lg'>
                        <div className='flex p-6 items-center justify-between'>
                            <p>Policy and Conditions</p>
                            <Button onClick={() => setCreatePolicy(true)} icon type='primary'><PlusIcon className='text-white w-4 h-4' /> Create</Button>
                        </div>
                        <PolicyTable />
                    </div>
                </>
            }

        </>
    )
}

export default PolicyAndConditions

interface Policy {
    key: string;
    name: string;
    lastUpdated: string;
}


const data: Policy[] = Array.from({ length: 33 }, (_, index) => ({
    key: `${index + 1}`,
    name: "Policy 1",
    lastUpdated: "12/01/2025 5:25pm",
}));

const PolicyTable: React.FC = () => {
    return (
        <Table
            columns={PolicyAndConditionColumns as any}
            dataSource={data}
            pagination={{ pageSize: 10 }}
        />
    );
};

