import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  Drawer,
  message,
  Select,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
//@ts-ignore
import Slider from 'react-slick';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import {
  getContentDetails,
  rejectContentLink,
  reviewContent,
} from '~/apis/campaign';
import {
  approveContent,
  publishContent,
} from '~/apis/content';
import DefaultAvatar from '~/assets/avatar.jpeg';
import EmbedContent from '~/components/content/EmbedContent';
import ModalDisputeStory from '~/components/content/ModalDisputeStory';
import ModalPostingDate from '~/components/content/ModalPostingDate';
import ModalPreviewContent from '~/components/content/ModalPreviewContent';
import ContentDetailSkeleton
  from '~/components/custom/skeletons/ContentDetailSkeleton';
import TagColor from '~/components/ui/tagColor';
import { DATE_TIME_FORMAT_V2 } from '~/constants/time.constant';
import { useAuthContext } from '~/contexts/auth.context';
import {
  ContentStatus,
  getColorStatusContent,
} from '~/helpers/campaign.helper';
import { Content } from '~/models/Content.model';
import Editor from '~/plugins/editor';
import {
  abbreviateLastName,
  formatName,
} from '~/utils/formatNumber';

import {
  CalendarDateRangeIcon,
  CursorArrowRaysIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  LinkIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/cloudflare';
import {
  useNavigate,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Review Content' }]
}

type ModalType = 'confirm-posting-date' | 'reject-influencer-request' | 'approve-influencer-request' | 'reject-content' | 'dispute-story' | ''
type LoadingType = 'approve-content-link' | 'reject-content-link' | 'get-content-details' | 'approve-content-post' | 'reject-content-post' | ''

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  centerPadding: "10px",
};

const ContentDetails = () => {
  const { id } = useParams()
  const navigation = useNavigate()
  const { userInfo, hasPermission } = useAuthContext()
  const [selectedVersion, setSelectedVersion] = useState<string>('')

  const [reason, setReason] = useState<string>('')
  const [loading, setLoading] = useState<LoadingType>('')
  const [previewType, setPreviewType] = useState<string>('')
  const [isViewReason, setIsViewReason] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [content, setContent] = useState<Content | null>(null)

  const [modalType, setModalType] = useState<ModalType>('')
  const videoExtensions = ['mov', 'mp4'];
  const isStory = content?.campaign?.contentFormat?.includes('story')
  const lastVersion = content?.versions?.[0]?.contentId
  const allowReview = hasPermission('review-content')
  const allowToPost = hasPermission('post-content-on-behalf')
  const allowToDispute = hasPermission('dispute-content')

  // GET CONTENT DETAILS
  const handleGetContentDetails = async () => {
    setLoading('get-content-details')
    await getContentDetails(selectedVersion || id as string)
      .then((res) => setContent(res.data))
      .finally(() => setLoading(''))
  }

  // GET CONTENT BY VERSION
  useEffect(() => {
    handleGetContentDetails()
  }, [selectedVersion])

  // APPROVE CONTENT POST
  const handleApproveContent = useCallback((time: Dayjs) => {
    setLoading('approve-content-post')
    const date = dayjs(time).toISOString()

    approveContent(content?.campaignId as string, lastVersion as string, true, date, reason)
      .then(() => {
        handleGetContentDetails()
        toast.success('Content has been approved successfully')
        setModalType('')
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(''))
  }, [content?.campaignId, lastVersion, selectedVersion])

  // REJECT CONTENT POST
  const handleReject = async (): Promise<void> => {
    setLoading('reject-content-post');

    const isLinkRejection = content?.permalink && isStory;
    const rejectAction = isLinkRejection
      ? rejectContentLink(lastVersion as string, reason)
      : reviewContent(content?.campaignId as string, lastVersion as string, reason, false);

    await rejectAction
      .then(() => {
        setModalType('');
        setReason('');
        handleGetContentDetails();
        toast.success('Content has been rejected successfully');
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setLoading(''))
  };

  // POST CONTENT TO INFLUENCER PROFILE
  const handlePostContentToProfileInfluent = () => {
    setLoading('approve-content-post')
    publishContent(lastVersion as string, 'instagram',)
      .then((res) => {
        toast.success('Content has been posted!')
        handleGetContentDetails()
      })
      .catch((err) => toast.error(`Posting Failed! ${err?.message}`))
      .finally(() => setLoading(''))
  }

  // GET LASTED VERSION EVERY TIME CLICKS
  const handleRefreshVersion = useCallback(() => {
    getContentDetails(selectedVersion || id as string)
      .then((res) => setContent(res.data))
  }, [selectedVersion])


  useEffect(() => {
    userInfo && !hasPermission('view-content') && navigation('/page-not-found')
  }, [userInfo])

  return (
    <div className='custom-select'>

      {contextHolder}
      <ToastContainer />
      <Breadcrumb
        className='fixed h-[40px] w-full '
        items={[
          { title: <div className='hover:text-gray-400 cursor-pointer transition-all' onClick={() => navigation(-1)} >Contents</div>, },
          { title: <p className='text-gray-800'>Review Content</p> },
        ]}
      />
      {
        loading === 'get-content-details'
          ? <ContentDetailSkeleton />
          : <>
            <div className='mx-auto w-full mt-16 justify-center flex items-start gap-7'>
              <div>
                <div className='w-[680px] border border-gray-200 shadow-sm rounded-xl '>
                  <div className='flex border-b border-b-gray-200 items-center justify-between'>
                    <div className='flex items-center p-4 gap-2'>
                      <Square3Stack3DIcon width={20} className='text-gray-800' />
                      <p>Deliverables</p>
                    </div>
                    <div className='flex p-4 items-center justify-between gap-3'>
                      <p>Version</p>
                      <Select
                        onDropdownVisibleChange={(open) => {
                          if (open) {
                            handleRefreshVersion()
                          }
                        }}

                        onChange={(v) => setSelectedVersion(v)}
                        defaultValue={content?.id}
                        className='bg-gray-200 w-[140px] rounded-lg'>
                        {content?.versions.map(v => (
                          <Select.Option value={v.contentId} >{v.version}</Select.Option>
                        ))}
                      </Select>
                      {content?.approved !== 'posted' && (
                        <Button onClick={() => setPreviewType('preview')} className='bg-gray-100'>Preview</Button>
                      )}
                    </div>
                  </div>
                  <div className='flex p-4 items-start mt-1 gap-3'>
                    <img className='w-[36px] h-[36px] rounded-[50%] object-cover'
                      src={content?.creator?.avatarUrl || DefaultAvatar}
                      alt="avatar" />
                    <div className='flex flex-col items-start'>
                      <p className='text-sm font-medium text-gray-800'>{formatName(content?.creator.name as string)}</p>
                      <p className='text-gray-500 text-sm font-normal'>Submission date : {dayjs(content?.createdAt).format(DATE_TIME_FORMAT_V2)}</p>
                    </div>
                  </div>
                  <div className='px-4 slider-container pt-2 pb-4'>
                    {content?.urls.length as number > 4 && (
                      <Slider {...settings}>
                        {content?.urls?.map((url, index) => {
                          const isVideo = videoExtensions.includes(url.slice(-3));

                          return (
                            <div key={index} style={{ margin: "0 10px" }}>
                              {isVideo ? (
                                <video
                                  autoPlay
                                  loop
                                  muted
                                  controls
                                  className="w-[120px] h-[120px] rounded-lg object-cover"
                                  src={url}
                                />
                              ) : (
                                <img
                                  className="w-[120px] h-[120px] rounded-lg object-cover"
                                  src={url}
                                  alt="content"
                                />
                              )}
                            </div>
                          );
                        })}
                      </Slider>
                    )}
                    <div className='flex items-center gap-2'>
                      {content?.urls.length as number <= 4 && content?.urls?.map((url, index) => {
                        const isVideo = videoExtensions.includes(url.slice(-3));

                        return (
                          <div key={index} style={{ margin: "0 10px" }}>
                            {isVideo ? (
                              <video
                                autoPlay
                                loop
                                muted
                                controls
                                className="w-[120px] h-[120px] rounded-lg object-cover"
                                src={url}
                              />
                            ) : (
                              <img
                                className="w-[120px] h-[120px] rounded-lg object-cover"
                                src={url}
                                alt="content"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className='text-sm font-normal text-gray-500 mt-4'>{content?.caption} </p>
                  </div>
                </div>

                {/* Note */}
                {content?.notes !== '' && (
                  <div className='w-[680px] border border-gray-200 shadow-sm rounded-xl mt-5 p-5'>
                    <h5 className='text-sm text-gray-800'>Note</h5>
                    <p className='text-justify p-2 bg-gray-100 rounded-xl text-sm text-gray-800 mt-2'>{content?.notes}</p>
                  </div>
                )}
              </div>
              {/* Review */}

              <div className='flex flex-col gap-5 w-[330px]'>
                {/* Influencer Requested */}

                <div className='w-full border border-gray-100 rounded-xl shadow-sm'>
                  <p className='p-4 text-sm text-gray-800 '>
                    {isStory && (content?.approved == 'approved' || content?.approved == 'posted')
                      ? 'Content'
                      : 'Please review the attached content for approval. Looking forward to your feedback!'}
                  </p>

                  {/* Warning reject for brand */}
                  {(content?.versions?.length as number > 2 && lastVersion == (selectedVersion || id)) && content?.approved !== 'approved' && (
                    <div className='flex items-center gap-3 p-4 m-4 mt-0 bg-orange-100 rounded-lg'>
                      <ExclamationCircleIcon className='w-5 min-w-5 min-h-5 h-5 text-orange-500' />
                      <p className='text-sm font-normal text-gray-800'>
                        {content?.approved !== 'rejected'
                          ? 'You has rejected the content for the second time. Please note that a maximum of three rejections is allowed.'
                          : 'You has rejected the content for the third time. This is the final allowed rejection'
                        }
                      </p>
                    </div>
                  )}
                  <div className='w-full justify-between px-4 pb-4 flex items-center gap-2 '>
                    {content?.approved == 'pending' || content?.approved == 'pending-review' ? (
                      <>
                        <Button disabled={!allowReview} onClick={() => setModalType('reject-content')} className='w-1/2' type='default' >Reject</Button>
                        <Button disabled={!allowReview} onClick={() => setModalType('confirm-posting-date')} className='w-1/2' type='primary' >Approve</Button>
                      </>
                    ) : (
                      <TagColor
                        status={getColorStatusContent(content?.approved as ContentStatus)?.status as string}
                        color={getColorStatusContent(content?.approved as ContentStatus)?.color as ContentStatus}
                        background={getColorStatusContent(content?.approved as ContentStatus)?.background as ContentStatus} />
                    )}
                  </div>
                  {content?.approved !== 'posted' && content?.approved !== 'declined' && (isStory && content?.approved == 'pending') && (
                    <div className='bg-gray-100  flex gap-3 items-center p-4 justify-start'>
                      <ExclamationCircleIcon width={20} className='text-gray-500' />
                      <p className='w-[224px] text-sm text-gray-800'>Content approval time within 48 hours from submission for review</p>
                    </div>
                  )}
                </div>


                {/* Reason */}
                {(content?.approved === 'rejected' || content?.approved == 'declined') && (
                  <div className='p-4 border w-full border-gray-200 rounded-xl flex flex-col gap-4'>
                    <span className='text-sm font-medium text-gray-800'>Reason</span>
                    <p className='text-sm font-normal text-gray-800'>Your feedback has been sent to Influencer. You couldn’t edit reason or undo.</p>
                    <Button onClick={() => setIsViewReason(true)} className='w-[100px] bg-gray-100 border-none'>View Details</Button>
                  </div>
                )}
                {/* Instagram post link */}
                {isStory && content?.permalink && content.approved == 'approved' && (
                  <div className=' border w-full border-gray-200 rounded-xl flex flex-col '>
                    <span className='text-sm p-4 font-medium text-gray-800'>Instagram Post Link</span>
                    <p onClick={() => window.open(content?.permalink, "_blank")}
                      className='text-blue-500 px-4 cursor-pointer'>{abbreviateLastName(content.permalink, 35)}</p>
                    <div className='flex gap-3 px-4 mt-5 pb-4'>
                      <Button disabled={!allowToDispute} onClick={() => setModalType('dispute-story')} className='w-full' type='primary'>Dispute</Button>
                    </div>
                    <div className='bg-gray-100  flex gap-3 items-center p-4 justify-start'>
                      <ExclamationCircleIcon width={20} className='text-gray-500' />
                      <p className='w-[254px] text-sm text-gray-800'>Brand does not respond within 12 hours, the system automatically considers it approved</p>
                    </div>
                  </div>
                )}


                {/* Link Content */}
                {((content?.approved === 'approved' && !isStory) || (isStory && content?.approved !== 'pending' && content?.approved !== 'rejected')) && (
                  <div className='w-full border border-gray-200 rounded-xl shadow-sm'>
                    <div className='flex items-start pt-4  px-3  pb-3 gap-3'>
                      <CalendarDateRangeIcon width={20} height={20} className='text-gray-500' />
                      <div className='flex flex-col gap-1 w-full'>
                        <p className='text-sm font-normal text-gray-500'>Posting date</p>
                        <p className='text-gray-800 text-sm'>{dayjs(content?.post_due).format(DATE_TIME_FORMAT_V2)}</p>
                      </div>
                    </div>
                    {content?.approved == 'approved' && !isStory && (
                      <div onClick={handlePostContentToProfileInfluent} className='w-full px-5 pb-4'>
                        <Button
                          loading={loading === 'approve-content-post'}
                          disabled={loading === 'approve-content-post' || !allowToPost}
                          className='w-full' type='primary'>
                          Post to social
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {/* NEXT STEP - WAITING INFLUENCER ADD POST LINK */}
                {isStory && content?.approved == 'approved' && !content.permalink && (
                  <div className='w-full border border-gray-100 rounded-xl shadow-sm'>
                    <p className='p-4 text-sm text-gray-800 '>Instagram Post Link</p>
                    <div className='bg-gray-100  flex gap-3 items-center p-4 justify-start'>
                      <ExclamationCircleIcon width={20} className='text-gray-500' />
                      <p className='w-[254px] text-sm text-gray-800'>The next step is to wait for the Story link to be submitted by the Influencer for review before proceeding to the payment process.</p>
                    </div>
                  </div>
                )}

                {/* Link website */}
                {(content?.trackingUrl || (isStory && (content?.approved == 'posted' || content?.approved == 'approved'))) && (
                  <div className='w-full border border-gray-100 rounded-xl shadow-sm'>
                    <div className='flex items-start p-4 gap-3'>
                      <LinkIcon width={20} height={20} className='text-gray-500' />
                      <div className='flex flex-col gap-1 w-full'>
                        <p className='text-sm font-normal text-gray-500'>Link Product</p>
                        <CopyToClipboard
                          onCopy={() => messageApi.success('Copied to clipboard!')}
                          text={content?.trackingUrl as string}
                        >
                          <div className='flex cursor-pointer items-center gap-2 justify-between w-full'>
                            <p className='text-gray-500 text-sm overflow-hidden text-ellipsis whitespace-nowrap'>{abbreviateLastName(content?.trackingUrl as string, 45)}</p>
                            <DocumentDuplicateIcon width={20} height={20} className='text-gray-500 min-w-[20px]' />
                          </div>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                )}

                {/* IG POST LINK */}
                {(content?.approved === 'posted' || content?.approved == 'declined') && (
                  <div className='w-full border border-gray-100 rounded-xl shadow-sm'>
                    <div className='flex items-start p-4 gap-3'>
                      <div className='flex flex-col cursor-pointer gap-1 w-full'>
                        <div className='flex items-center gap-3'>
                          <CursorArrowRaysIcon width={20} height={20} className='text-gray-500' />
                          <p className='text-sm font-normal text-gray-500'>Instagram Post Link</p>
                        </div>
                        <p onClick={() => window.open(content?.permalink, "_blank")} className='text-blue-500 pl-8 font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap'>
                          {content?.permalink}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* IG Screenshot for story */}
                {content?.screenshotUrls?.length as number > 0 && (
                  <div className='w-full border border-gray-200 -mb-5 rounded-tl-xl rounded-tr-xl shadow-sm'>
                    <div className='flex items-start pt-4  px-3  pb-3 gap-3'>
                      <CalendarDateRangeIcon width={20} height={20} className='text-gray-500' />
                      <div className='flex flex-col gap-1 w-full'>
                        <p className='text-sm font-normal text-gray-500'>Live Post</p>
                        <p className='text-gray-800 text-sm'>{dayjs(content?.postedAt).format(DATE_TIME_FORMAT_V2)}</p>
                      </div>
                    </div>
                  </div>

                )}
                {content?.screenshotUrls?.[0] &&
                  videoExtensions.includes(content.screenshotUrls[0].slice(-3)) ? (
                  <video
                    src={content.screenshotUrls[0]}
                    className="w-full h-[400px] object-cover rounded-bl-xl rounded-br-xl"
                    controls
                  />
                ) : content?.screenshotUrls?.[0] ? (
                  <img
                    src={content.screenshotUrls[0]}
                    className="w-full h-[400px] object-cover rounded-bl-xl rounded-br-xl"
                    alt="story"
                  />
                ) : null}


                {/* Embed Post */}
                {!isStory && (
                  <EmbedContent link={content?.permalink as string} />
                )}
              </div>

              {/* Modal Reject content*/}
              <Drawer
                footer={
                  <div className="float-right gap-3 flex items-end  justify-between">
                    <Button onClick={() => setModalType('')} >Cancel</Button>
                    <Button loading={loading === 'reject-content-post'} onClick={handleReject} type="primary">Reject</Button>
                  </div>
                }
                width={600}
                title="Reject"
                open={modalType === 'reject-content'}
                onClose={() => setModalType('')}
              >
                <p className="text-sm font-normal my-5 mx-2 text-gray-500">
                  Please let us know your reason for rejecting the post
                </p>
                <Editor value={reason} onChange={(value) => setReason(value)} />
              </Drawer>

              {/* Modal Posting Date */}
              <ModalPostingDate
                open={modalType === 'confirm-posting-date'}
                onApproveContent={(time) => handleApproveContent(time)}
                loading={loading === 'approve-content-post'}
                onclose={() => setModalType('')}
              />

              {/* Modal Preview Content */}
              <ModalPreviewContent
                content={content as Content} open={previewType === 'preview'}
                onClose={() => setPreviewType('')} />

              <Drawer
                footer={
                  <div className='flex items-center justify-end mr-7'>
                    <Button onClick={() => setIsViewReason(false)}>Close</Button></div>
                }
                title='Reason'
                width={650}
                open={isViewReason}
                onClose={() => setIsViewReason(false)}>
                <Editor showToolbar={false} disabled value={content?.reason as string} />
              </Drawer>

              {/* Modal Dispute Story */}
              <ModalDisputeStory
                onSuccess={handleRefreshVersion}
                open={modalType == 'dispute-story'}
                contentId={content?.id as string}
                onclose={() => setModalType('')} />

            </div>
          </>
      }
    </div>
  );
};

export default ContentDetails;
