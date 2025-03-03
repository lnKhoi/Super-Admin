import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  DatePicker,
  Modal,
  Popover,
  Radio,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Tooltip,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import {
  getListInfluencerInviteInCampaign,
  inviteInfluencerToCampaign,
} from '~/apis/campaign';
import { countries } from '~/constants/countries.constant';
import {
  ageAudience,
  genderFilterOptions,
  socials,
} from '~/constants/creator.constant';
import { INVITED_INFLUENCERS } from '~/constants/messages.constant';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { Creator } from '~/models/User.model';
import { formatNumber } from '~/utils/formatNumber';

import {
  AdjustmentsHorizontalIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import InviteCard from './InviteCard';

type Align = 'Influencer' | 'Others'

type ModalInviteInfluencerToCampaign = {
    open: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
    campaignId: string
}

export type Filter = {
    age: number[];
    gender: string[];
    location: string;
    socialMedias: string[];
    minFollow: number | string
    maxFollow: number | string
};

export type InviteInfluencer = {
    id: string | undefined,
    deadline?: string | null
}

const initialFilter = { age: [0, 100], gender: [], location: '', socialMedias: [], minFollow: 0, maxFollow: 1500000 }

function ModalInviteInfluencerToCampaign({ onClose, open, campaignId }: ModalInviteInfluencerToCampaign) {
    const [alignValue, setAlignValue] = useState<Align>('Influencer');
    const [selectAll, setSelectAll] = useState<boolean>(false)
    const [influencers, setInfluencers] = useState<Creator[]>([])
    const [modal, setModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<string>('')

    const [globalDeadline, setGlobalDeadline] = useState<null | string>('')
    const [selectedInfluencers, setSelectedInfluencers] = useState<InviteInfluencer[]>([])

    const [filter, setFilter] = useState<Filter>(initialFilter);

    const handleSelectAll = (): void => {
        setSelectAll((prev) => !prev);

        setSelectedInfluencers((_prev) => {
            if (!selectAll) {
                return influencers.map((c: Creator) => ({
                    id: c.id as string,
                    deadline: globalDeadline,
                }));
            }
            return []; // Clear selection when deselected
        });
    };

    const handleSelectCard = (id: string, checked: boolean, deadline: string) => {
        setSelectedInfluencers(prevState =>
            checked
                ? prevState.some(influencer => influencer.id === id)
                    ? prevState.map(influencer =>
                        influencer.id === id ? { ...influencer, deadline } : influencer
                    )
                    : [...prevState, { id, deadline }]
                : prevState.filter(card => card.id !== id)
        );
    };


    const handleGetInfluencers = async (filter: Filter) => {
        setLoading('get-list')
        await getListInfluencerInviteInCampaign(campaignId as string, 100, 1, filter)
            .then((res) => setInfluencers(res?.data?.creatorsWithInvitationStatus))
            .finally(() => setLoading(''))
    }


    const handleInviteInfluencers = async (): Promise<void> => {
        if (selectedInfluencers.length === 0) return;
        setLoading('invite');

        // Check duplicate influencer has been invited before
        const invitedIds = influencers?.filter(i => i?.deadline).map(e => e?.id).filter(id => id !== undefined) as string[];
        const uniqueInfluencer = selectedInfluencers?.filter(e => e?.id && !invitedIds.includes(e.id));

        inviteInfluencerToCampaign(campaignId, uniqueInfluencer)
            .then(() => {
                toast.success(INVITED_INFLUENCERS);
                setSelectedInfluencers([]);
                handleGetInfluencers(filter);
                setGlobalDeadline(null)
            })
            .catch((err) => toast.error(err?.message))
            .finally(() => setLoading(''));
    };

    useEffect(() => { handleGetInfluencers(filter) }, [alignValue])

    useEffect(() => {
        if (selectedInfluencers.length === influencers.length && selectedInfluencers.length > 0
            || influencers.every(e => !!e.deadline)) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }

    }, [selectedInfluencers, influencers])

    const handleSelectSocial = (id: string): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            socialMedias: prevFilter.socialMedias.includes(id)
                ? prevFilter.socialMedias.filter((socialId) => socialId !== id)
                : [...prevFilter.socialMedias, id],
        }));
    };

    const handleSelectGender = (id: string) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            gender: prevFilter.gender.includes(id)
                ? prevFilter.gender.filter((gender) => gender !== id)
                : [...prevFilter.gender, id],
        }));
    }

    const handleResetFilter = (): void => {
        setFilter(initialFilter)
        handleGetInfluencers(initialFilter)
        setModal(false)
    }

    const handleSetGlobalDeadline = (d: Dayjs) => {
        setGlobalDeadline(d.toISOString())
        const invitedIds = influencers?.filter(i => i?.deadline).map(e => e?.id).filter(id => id !== undefined) as string[];
        const uniqueInfluencer = selectedInfluencers?.filter(e => e?.id && !invitedIds.includes(e.id));
        const updatedData = uniqueInfluencer?.map(item => ({ ...item, deadline: d?.toISOString() }));
        setSelectedInfluencers(updatedData)
    }

    return (
        <Modal style={{ top: 30 }} width={750} title='' open={open} onCancel={() => onClose(false)} footer={[
            <div className='flex border-t border-t-gray-300 pt-5 items-center justify-end gap-2'>
                <Button onClick={(): void => onClose(false)} type='default' >Close</Button>
                <Button
                    disabled={selectedInfluencers.every(e => e.deadline == null || e.deadline == '') || selectedInfluencers.some(i => i.deadline == "")}
                    loading={loading === 'invite' && selectedInfluencers.length > 0}
                    onClick={handleInviteInfluencers}
                    type='primary' >
                    Send Invitation
                </Button>
            </div>
        ]} >
            <div>
                <h2 className='text-center text-2xl font-semibold'>Invite Influencer</h2>
                <h5 className='text-[#374151] text-center'>Invite your Influencer to review collaborate on this campaign.</h5>
                <div className='flex w-full mx-auto justify-center mt-3' >
                    <Segmented
                        defaultValue="Influencer"
                        style={{ marginBottom: 8 }}
                        onChange={(value) => setAlignValue(value as Align)}
                        options={['Influencer', 'Others',]}
                    />
                </div>
                {alignValue === 'Influencer' && (
                    <div>
                        <div className='flex mt-2 items-center justify-between'>
                            <div className='flex items-center gap-1'>
                                <Checkbox
                                    disabled={influencers.every(e => !!e?.deadline)}
                                    checked={selectAll}
                                    onChange={handleSelectAll} >Select All</Checkbox>
                                <span className='text-gray-600'>Selected ({selectedInfluencers.length})</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                {selectAll && !influencers.every(e => !!e.deadline) && (
                                    <div className='flex items-center '>
                                        <Tooltip className='cursor-pointer' title='Deadline for influencers to submit the first content version'>
                                            <ExclamationCircleIcon className='text-gray-800 h-5 w-5' />
                                        </Tooltip>
                                        <span className='text-sm ml-1 mr-3 font-medium text-gray-800'>Deadline</span>
                                        <DatePicker
                                            format={DATE_TIME_FORMAT}
                                            minDate={dayjs().add(14, 'day')}
                                            onChange={(e) => handleSetGlobalDeadline(e)}
                                            value={globalDeadline ? dayjs(globalDeadline) : null}
                                            allowClear={false} className='bg-gray-100 hover:bg-gray-100 border-none' />
                                    </div>
                                )}
                                <Popover
                                    content={
                                        <div className='w-[368px] custom-input flex flex-col gap-1'>
                                            <div>
                                                <span className='text-sm text-gray-800 font-medium'>Age Audience</span>
                                                <div>
                                                    <Radio.Group onChange={(e) => setFilter({ ...filter, age: e.target.value })}>
                                                        <div className='grid w-[330px] mt-2 grid-cols-2 gap-2'>
                                                            {ageAudience.map(a => (
                                                                <Radio key={a.label} value={a.value} >{a.label}</Radio>
                                                            ))}
                                                        </div>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                <span className='text-sm text-gray-800 font-medium'>Gender Audience</span>
                                                <div className='flex items-center gap-2 mt-2'>
                                                    {genderFilterOptions.map(g => (
                                                        <div
                                                            onClick={() => handleSelectGender(g)}
                                                            key={g}
                                                            className={`h-[34px] px-3 ${!filter.gender.includes(g) ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'} text-sm cursor-pointer font-medium flex items-center justify-center rounded-lg capitalize`}>
                                                            {g}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className='mt-4'>
                                                    <span className='text-sm text-gray-800 font-medium'>Social Media Platform</span>
                                                    <div className='flex items-center gap-2 mt-2'>
                                                        {socials.map(s => (
                                                            <div
                                                                key={s.name}
                                                                onClick={() => handleSelectSocial(s.name)}
                                                                className={`h-[34px] px-3 text-sm cursor-pointer ${filter.socialMedias.includes(s.name) ? 'bg-blue-500 text-white' : 'bg-gray-200  text-gray-800'} 
                                                                   font-medium flex items-center justify-center rounded-lg capitalize`}>
                                                                {s.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='mt-[18px] flex flex-col gap-2'>
                                                    <span className='text-sm text-gray-800 font-medium'>Location Audience</span>
                                                    <Select
                                                        placeholder="Select a country"
                                                        value={filter.location}
                                                        showSearch
                                                        allowClear
                                                        optionFilterProp="children"
                                                        onChange={(l) => setFilter({ ...filter, location: l })}
                                                    >
                                                        {countries.map((country) => (
                                                            <Select.Option key={country.value} value={country.label}>
                                                                <span role="img" aria-label={country.label} className="mr-2">
                                                                    {country.flag}
                                                                </span>
                                                                {country.label}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                                <div className='mt-4'>
                                                    <span className='text-sm text-gray-800 font-medium'>Follower Count</span>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-xs text-gray-500'>{formatNumber(filter.minFollow as number)}</span>
                                                        <Slider max={5000000} step={500000}
                                                            onChange={(value: number[]) => setFilter({ ...filter, minFollow: value[0], maxFollow: value[1] })}
                                                            range={{ draggableTrack: true }} defaultValue={[filter.minFollow as number, filter.maxFollow as number]} className='w-full' />
                                                        <span className='text-xs text-gray-500'>{formatNumber(filter.maxFollow as number)}</span></div>
                                                </div>

                                                <div className='flex w-full items-center gap-2 mt-5 justify-end'>
                                                    <Button onClick={handleResetFilter} type='default' >Reset</Button>
                                                    <Button onClick={() => { handleGetInfluencers(filter); setModal(false) }} type='primary' >Apply</Button>
                                                </div>
                                            </div>

                                        </div>
                                    }
                                    title=""
                                    placement='bottom'
                                    trigger="click"
                                    open={modal}
                                    onOpenChange={() => setModal(!modal)}
                                >
                                    <button className='bg-[#F3F4F6] hover:bg-[#D1D5DB] transition-all flex items-center justify-center gap-1 text-sm h-[35px] w-[85px] font-semibold rounded-[7px] text-[#1F2937]'>
                                        <AdjustmentsHorizontalIcon width={16} /> Filter
                                    </button>
                                </Popover>
                            </div>
                        </div>
                        <div className='h-[410px] mb-8 mt-4 pr-2 overflow-y-scroll w-full flex flex-col gap-3'>
                            {loading === 'get-list'
                                ? <> {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-4">
                                        <Skeleton key={index} active avatar paragraph={{ rows: 1 }} />
                                    </div>
                                ))}</>
                                : <> {influencers.map(i => (
                                    <InviteCard
                                        resetDeadline={selectedInfluencers.length > 0 && selectAll}
                                        selectedInfluencer={selectedInfluencers}
                                        key={i.id}
                                        onSelect={handleSelectCard}
                                        globalDeadlineTrigger={globalDeadline}
                                        checked={selectedInfluencers.some(e => i.id == e.id) || !!i.deadline}
                                        influencer={i} />
                                ))}</>
                            }
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default ModalInviteInfluencerToCampaign