import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
} from 'antd';
import debounce from 'lodash/debounce';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { createCampaign } from '~/apis/campaign';
import Discount from '~/components/campaign/Discount';
import ModalConfirmToken from '~/components/campaign/ModalConfirmToken';
import TotalBudgetBox from '~/components/campaign/TotalBudgetBox';
import {
  ageRangeCampaign,
  campaignStatusOptions,
  contentFormatOptions,
  genderOptions,
  postDurationOptions,
  storyDurationOptions,
} from '~/constants/campaign.constant';
import { countries } from '~/constants/countries.constant';
import { socials } from '~/constants/creator.constant';
import {
  BUDGET_REQUIRED,
  CAMPAIGN_REQUIRED,
  LOCATION_REQUIRED,
  MAXIMUM_PARTICIPANT,
  PLEASE_SELECT_DURATION,
  PLEASE_SELECT_GENDER,
  REQUIRED,
} from '~/constants/messages.constant';
import { Campaign } from '~/models/Campaign.model';
import Editor from '~/plugins/editor';

import { MetaFunction } from '@remix-run/cloudflare';
import {
  Link,
  useNavigate,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Campaign' }]
}

const { Option } = Select;

const CampaignForm = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);

  const navigate = useNavigate()
  const budget = Form.useWatch('budget', form);
  const contentFormat = Form.useWatch('contentFormat', form)
  const contentStatus = Form.useWatch('status', form)
  const maximumParticipants = Form.useWatch('maximumParticipants', form);
  const [modalConfirmToken, setModalConfirmToken] = useState<boolean>(false)

  // CHECK BALANCE OF BRAND AND CONFIRM TOKEN
  const onFinish = async (): Promise<void> => {
    selectedSocials.length == 0
      ? toast.error('Please select social media')
      : contentStatus === 'active' ? setModalConfirmToken(true) : handleCreateCampaign()
  };

  // CREATE CAMPAGIN
  const handleCreateCampaign = async () => {
    const values: Campaign = form.getFieldsValue()
    setLoading(true)

    const payload = {
      ...values,
      discountValue: Number(values.discountValue),
      campaignOverview: content,
      deadline: '3024-12-27T04:06:33.865Z',
      socialMedia: selectedSocials
    }

    delete payload.removed;

    await createCampaign(payload as Campaign)
      .then((res) => {
        toast.success('Create campaign successfully!')
        form.resetFields()
        setSelectedSocials([])
        sessionStorage.removeItem('campaignFormValues')
        setContent('')
        navigate('/manager/campaigns')
      })
      .catch(err => toast.error(err?.message))
      .finally(() => setLoading(false))
  }

  // SELECT SOCIAL MEDIAS
  const handleSelectSocial = (id: string) => {
    setSelectedSocials((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((socialId) => socialId !== id)
        : [...prevSelected, id]
    );

    const newValue = selectedSocials?.includes(id) ? [] : [id];
    sessionStorage.setItem('campaignFormValues',
      JSON.stringify({ ...form.getFieldsValue(), socialMedias: newValue }));
  };

  // CHANGE CONTENT OVERVIEW
  const handleChangeContent = (content: string) => {
    setContent(content);
  }

  // CALCULATION TOTAL BUDGET
  useEffect(() => {
    if (budget && maximumParticipants) {
      const totalBudget = budget * maximumParticipants;
      form.setFieldsValue({ totalBudget });
    }
  }, [budget, maximumParticipants]);

  // Debounced function to save form data to localStorage when user leaving
  const handleDraftCampaign = debounce(() => {
    sessionStorage.setItem('campaignFormValues',
      JSON.stringify({ ...form.getFieldsValue(), socialMedias: selectedSocials }));
  }, 1000);

  // Load form values from localStorage when the component mounts
  useEffect(() => {
    const getLastFormValues = sessionStorage.getItem('campaignFormValues');

    if (getLastFormValues) {
      const parsedValues = JSON.parse(getLastFormValues);

      if (parsedValues.socialMedias) {
        setSelectedSocials(parsedValues?.socialMedias)
      }

      form.setFieldsValue(parsedValues);
    }
  }, [form]);

  return (
    <div className='custom-select custom-form'>
      <ToastContainer />
      <Breadcrumb
        className='fixed h-[40px] w-full '
        items={[
          { title: <Link to={'/manager/campaigns'}>Campaigns</Link>, },
          { title: <p className='text-gray-800'>Add Campaign</p> },
        ]}
      />
      <div className='flex items-start gap-6 w-full mt-14 mx-auto justify-center'>
        {/* Form Add Campaign */}
        <div className='w-[650px]'>
          <h2 className='text-2xl font-medium mb-5'>Add Campaign</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleDraftCampaign}
            style={{ margin: 'auto' }}
          >

            {/* Campaign Name */}
            <Form.Item
              label="Campaign Name"
              name="name"
              rules={[{ required: true, message: CAMPAIGN_REQUIRED }]}
            >
              <Input placeholder='Enter campain name' className='bg-gray-100 border-none hover:bg-gray-100' maxLength={150} showCount />
            </Form.Item>

            {/* Campaign Budget */}
            <div className='flex items-center gap-3 justify-between'>
              <Form.Item
                className='w-1/2'
                label="Per-Influencer Budget"
                name="budget"
                rules={[{ required: true, message: BUDGET_REQUIRED }]}
                extra="The amount allowcated to each influencer"
              >
                <InputNumber
                  prefix="$"
                  placeholder='0.00'
                  className='bg-gray-100 border-none'
                  maxLength={10}
                  suffix='Token'
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                className='w-1/2'
                label="Maximum Participants"
                name="maximumParticipants"
                rules={[{ required: true, message: MAXIMUM_PARTICIPANT }]}
                extra="Max Influencers participating in a Campaign"

              >
                <InputNumber
                  className='bg-gray-100 hover:bg-gray-200 border-none'
                  min={1}
                  placeholder='0'
                  maxLength={3}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className='w-full'
                label="Influencer Budget"
                name="totalBudget"
                rules={[{ required: true, message: BUDGET_REQUIRED }]}
                extra="Total funds allocated for the campaign's influencer"
              >
                <InputNumber
                  name='budget'
                  placeholder='0.00'
                  prefix="$"
                  className='bg-gray-100 hover:bg-gray-100 cursor-not-allowed border-none'
                  disabled
                  suffix='Token'
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            {/* Social media */}
            <div className='mb-6'>
              <h6 className='text-sm text-gray-800 font-medium' >Social Media</h6>
              <p className='text-sm text-gray-500 mb-5'>Place content posted for</p>
              <div className='mt-5 flex items-center gap-3'>
                {socials.map(s => (
                  <div
                    onClick={() => handleSelectSocial(s.name)}
                    className={`w-[120px] cursor-pointer relative h-[120px] rounded-xl border flex items-center justify-center ${selectedSocials.includes(s.name) ? 'border-blue-500' : 'border-gray-200'
                      }`}>
                    <Checkbox checked={selectedSocials.includes(s.name)}
                      className='absolute top-3 left-3' />
                    <div className='flex flex-col gap-1 items-center justify-center'>
                      <img src={s.icon} alt="facebook" />
                      <span className='text-[12px capitalize text-gray-700'>{s.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Format */}
            <div className="border-b pb-4 border-b-gray-200">
              <Form.Item
                className="w-1/2"
                label="Content Format"
                name="contentFormat"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <div className="flex gap-3 items-center">
                  {contentFormatOptions.map((c) => (
                    <div
                      key={c.value}
                      className={`flex gap-5 cursor-pointer border h-[44px] ${contentFormat?.includes(c.value) ? "border-blue-600" : "border-gray-200"
                        } items-center p-3 rounded-xl justify-between`}
                      onClick={() => {
                        const newValue = contentFormat?.includes(c.value) ? [] : [c.value];
                        form.setFieldsValue({ contentFormat: newValue });
                        form.setFieldValue('duration', null)
                      }}
                    >
                      <div className="flex gap-2">
                        {c.icon}
                        <span>{c.label}</span>
                      </div>
                      <Checkbox
                        checked={contentFormat?.includes(c.value)}
                        value={c.value}
                        style={{ pointerEvents: "none" }} // Prevent direct checkbox click propagation
                      />
                    </div>
                  ))}
                </div>
              </Form.Item>
            </div>

            {/* Posting Duration */}
            <h2 className='text-lg mb-4 font-semibold mt-6'>Posting Duration</h2>
            <p className='text-sm  font-normal text-gray-500  mb-[14px] -mt-3.5'>Time the influencer keeps the content on Instagram within the required timeframe. After this period, payment will be processed</p>
            <Form.Item
              label=""
              name="duration"
              rules={[{ required: true, message: PLEASE_SELECT_DURATION }]}
            >
              <Select disabled={!contentFormat} className="custom-select" placeholder="Select duration">
                {(contentFormat == 'story' ? storyDurationOptions : postDurationOptions).map(g => (
                  <Option key={g.value} value={g.value}>{g.label}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Age */}
            <h2 className='text-lg  font-semibold text-gray-800 mb-4 mt-6 border-t border-t-gray-200 pt-8'>
              Campaign Demographic
            </h2>
            <div className='flex items-center'>
              <Form.Item
                className='items-center w-full gap-20'
                name='ages'
                label='Age'
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Checkbox.Group>
                  <div className='grid gap-2 grid-cols-2'>
                    {ageRangeCampaign.map(a => (
                      <Checkbox key={a.value} value={a.value}>{a.label}</Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>

              {/* Gender */}
              <div className='w-full'>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: PLEASE_SELECT_GENDER }]}
                >
                  <Select className="custom-select" placeholder="Select gender">
                    {genderOptions.map(g => (
                      <Option key={g.value} value={g.value}>{g.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className='w-full mt-2 gap-3'>

              {/* Location */}
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: LOCATION_REQUIRED }]}
              >
                <Select
                  placeholder="Select a country"
                  showSearch
                  mode='multiple'
                  allowClear
                  maxTagCount={3}
                  maxTagPlaceholder={(omittedValues) => `...and ${omittedValues.length} more`}
                  optionFilterProp="children"
                >
                  {countries.map((country) => (
                    <Select.Option key={country.value} value={country.value}>
                      <span role="img" aria-label={country.label} className="mr-2">
                        {country.flag}
                      </span>
                      {country.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* Discount */}
            <Discount form={form} />
            {/* Editor */}
            <div className='mt-4 border-t border-gray-200 mb-6 pt-6'>
              <h6 className='text-lg text-gray-800 font-semibold' >Campaign Overview</h6>
              <p className='text-sm text-gray-500 mb-5'>A summary or description of campaign's goals and strategy.</p>
              <Editor value={content} onChange={(value) => handleChangeContent(value)} />
            </div>

            {/* Submit Button */}
            <div className='flex justify-end h-[35px] items-center'>
              <div className='h-full flex items-center'>
                <Form.Item name='status' initialValue='active' style={{ margin: 0 }}>
                  <Radio.Group>
                    {campaignStatusOptions.map(s => (
                      <Radio key={s.value} value={s.value}>{s.label}</Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className='h-full ml-4'>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Save changes
                  </Button>
                </Form.Item>
              </div>
              <Form.Item label="" className='hidden' name="discountCode"></Form.Item>
              <Form.Item className='hidden' label="" name="discountValue"></Form.Item>
              <Form.Item className='hidden' label="" name="discountType"></Form.Item>
              <Form.Item className='hidden' label="" name="removed"></Form.Item>
            </div>
          </Form>
        </div>
        {/* TOTAL CAMPAIGN BUDGET */}
        <TotalBudgetBox perInfluencerBudget={budget} maximumParticipants={maximumParticipants} />
        {/* MODAL CONFIRM TOKEN */}
        {modalConfirmToken &&
          <ModalConfirmToken
            open={modalConfirmToken}
            perInfluencerBudget={budget}
            maximumParticipants={maximumParticipants}
            onConfirm={handleCreateCampaign}
            onclose={() => setModalConfirmToken(false)}
          />}
      </div>
    </div>

  );
};

export default CampaignForm;
