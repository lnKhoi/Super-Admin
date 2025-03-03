import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Table,
  Upload,
} from 'antd';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import {
  getInfluencerImported,
  importCSV,
} from '~/apis/creator';
import { creatorColumns } from '~/constants/creator.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Creator } from '~/models/User.model';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/cloudflare';
import {
  Link,
  useNavigate,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [{ title: 'Invite Influencer' }]
}

const { Dragger } = Upload;


const InviteInfluencer = () => {
    const { userInfo ,hasPermission} = useAuthContext()
    const [influencers, setInfluencers] = useState<Creator[]>([])

    const navigate = useNavigate()

    const handleImportCSV = async (info: any): Promise<void> => {
        const file = info.file.originFileObj;
        const formData = new FormData();
        formData.append('file', file);

        if (info.file.status !== 'uploading') {
            await importCSV(formData).then(() => {
                handleGetListInfluencerImported()
            })
        }
    };

    const handleGetListInfluencerImported = async (): Promise<void> => {
        await getInfluencerImported( 100, 1)
            .then((res) => {
                setInfluencers(res?.data?.paginatedInfluencersData)
                toast.success('Import Influencer Successfully')
            })
    }

    useEffect(() => {
        userInfo && !hasPermission('import-influencer-csv') && navigate('/page-not-found')
    },[userInfo])

    if(!userInfo) return <></>

    return (
        <div className='custom-select'>
            <ToastContainer />
            <div className='fixed h-[60px] w-[calc(100%-250px)] top-0 flex items-center justify-between '>
                <Breadcrumb
                    className=''
                    items={[
                        { title: <Link to={'/manager/creators'}>Creator</Link>, },
                        { title: <p className='text-gray-800'>Import Influencer</p> },
                    ]}
                />
                {/* <Button onClick={() => toast.success('Import Influencer Successfully')} type='primary'>Import & Save data</Button> */}
            </div>
            <div className='w-[1024px] mt-14 mx-auto'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-gray-900  mb-5 text-lg font-medium text-center'>Upload CSV</h2>
                    <p className='text-sm text-gray-900'>Don't have the template? <span className='text-blue-500 cursor-pointer' >Download Template</span></p>
                </div>
                <div className='mt-2 h-[152px]'>
                    <Dragger showUploadList={false} onChange={(file) => handleImportCSV(file)} >
                        <div className='flex items-center flex-col justify-center'>
                            <div className="h-[44px] w-[44px] rounded-[50%] bg-gray-100 flex items-center justify-center">
                                <CloudArrowUpIcon className='text-gray-500' width={20} />
                            </div>
                            <p className="text-sm mt-4 text-gray-800 font-medium ">
                                Drop your file here or <span className='text-blue-500'>browse</span>
                            </p>
                            <span className='text-gray-500 text-xs mt-3'>Pick a file up to 200MB.</span>
                        </div>
                    </Dragger>
                </div>
                {/* INFLUENCER */}
                {influencers.length > 0 && (
                    <div className='mt-4'>
                        <Table<Creator> columns={creatorColumns as any} dataSource={influencers} />
                    </div>
                )}
            </div>
        </div>

    );
};

export default InviteInfluencer;
