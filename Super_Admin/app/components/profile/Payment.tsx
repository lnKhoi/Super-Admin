import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  message,
  Radio,
  Skeleton,
  Tabs,
  Tooltip,
} from 'antd';
import {
  addPaymentMethod,
  checkConnectedAccount,
  getPaymentMethods,
  getTotalTokens,
  removePaymentMethod,
  setPrimaryCard,
} from '~/apis/stripe';
import PaymentCard from '~/assets/balance-card.png';
import Paypal from '~/assets/paypal.png';
import { STRIPE_KEY } from '~/constants/env.constant';
import {
  availableTokensDesc,
  lockedTokensDesc,
  paymentMethodBrandLogo,
  paymentTabs,
  totalBalanceDesc,
} from '~/constants/payment.constant';
import { useAuthContext } from '~/contexts/auth.context';
import type {
  CreditCard,
  Payment,
} from '~/models/payment.model';
import CheckoutForm from '~/sdks/CheckoutForm';

import {
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentMethodsSkeleton from '../custom/skeletons/PaymentMethods';
import TagColor from '../ui/tagColor';
import BuyToken from './BuyToken';
import ConnectStripeAccount from './ConnectStripeAccount';
import ModalSuccessPayment from './ModalSuccessPayment';
import ModalSuccessPayout from './ModalSuccessPayout';
import WithdrawToken from './WithdrawToken';

type ModalType = 'verify-user' | 'buy-token' | 'withdraw' | 'connect-stripe' | 'widthdraw-success' | 'payment-success' | ''
type LoadingType = 'payment-info' | 'delete-payment' | 'verify-user' | 'list-payment-methods' | ''

function Payment() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [warning, setWarning] = useState<boolean>(true)
  const { setOnPayment, onPayment } = useAuthContext()

  const [selectedCard, setSelectedCard] = useState<string>('')
  const [addedToken, setAddedToken] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isSelectPayment, setIsSelectPayment] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState<string>("");

  const [modalType, setModalType] = useState<ModalType>('')
  const [loadingType, setLoadingType] = useState<LoadingType>('')
  const [totalToken, setTotalToken] = useState<{ available: number, locked: number }>({ available: 0, locked: 0 })

  const [messageApi, contextHolder] = message.useMessage();
  const stripePromise = loadStripe(STRIPE_KEY);

  const options = { clientSecret: clientSecret };
  const emptyCard = cards.length === 0


  // GET PAYMENT - BALANCE INFO
  const getPaymentInfo = () => {
    setLoadingType('payment-info')
    Promise.all([getPaymentMethods(), addPaymentMethod(), getTotalTokens()])
      .then(([paymentMethods, clientIntent, balance]) => {
        setClientSecret(clientIntent?.data?.clientSecret)
        setCards(paymentMethods?.data)

        setTotalToken({ available: balance?.data?.wallet?.balance, locked: balance?.data?.wallet?.lockBalance })
      })
      .catch(error => { console.error('Error fetching data:', error) })
      .finally(() => setLoadingType(''))
  };

  useEffect(() => { getPaymentInfo() }, [])

  // PAYMENT - BUY TOKEN
  const handlePayment = (total: number) => {
    setModalType('payment-success')
    setAddedToken(total)
  }

  // REMOVE PAYMENT METHOD
  const handleRemovePaymentMethod = (id: string) => {
    setLoadingType('delete-payment')
    removePaymentMethod(id)
      .then(() => {
        const newPaymentMethod = cards.filter(c => c.id !== id)
        setCards(newPaymentMethod)
      })
      .catch(() => messageApi.error('Failed to Delete payment method. Try again!'))
      .finally(() => setLoadingType(''))
  }

  // VERIFY USER BEFORE WITHDRAW
  const handleWithdraw = () => {
    setLoadingType('verify-user')
    checkConnectedAccount()
      .then(() => setModalType('withdraw'))
      .catch(err => {
        // Account is not ready for payouts.
        err?.status == 400 && setModalType('connect-stripe')
      })
      .finally(() => setLoadingType(''))
  }

  // SET CARD DEFAULT
  const handleSetPaymentDefault = (id: string) => {
    setPrimaryCard(id).then(() => {
      setLoadingType('list-payment-methods')
      getPaymentMethods().then(res => {
        messageApi.success('Update primary card successfully!')
        setCards(res.data)
      })
        .finally(() => setLoadingType(''))
    })
  }

  return (
    <div>
      {contextHolder}
      {/* WARNING IF NO PAYMENT METHOD LINKED */}
      {warning && emptyCard && loadingType !== 'payment-info' && (
        <div className='flex items-center mb-6 justify-between px-3 h-[54px] rounded-lg bg-blue-100'>
          <div className='flex items-center gap-3'>
            <ExclamationCircleIcon className='w-6 h-6 text-blue-500' />
            <p className='text-sm font-normal text-gray-800'>We need your attention! To start using tools, Please
              <span onClick={() => setIsSelectPayment(true)} className='text-blue-500 cursor-pointer text-sm font-bold ml-2'>Add Payment Method</span>
            </p>
          </div>
          <XMarkIcon onClick={() => setWarning(false)} className='cursor-pointer w-6 h-6 text-gray-500' />
        </div>
      )}
      <div className='p-5 border flex items-center justify-between border-gray-200 rounded-xl'>
        <div className='flex flex-col  w-full'>
          <div className='w-full grid grid-cols-3'>
            <div>
              <div className='flex items-center gap-1'>
                <p className='text-lg text-gray-800 font-normal'>Available Balance</p>
                <Tooltip
                  title={<div className="text-center block ">{availableTokensDesc}</div>}
                >
                  <ExclamationCircleIcon className="w-5 cursor-pointer h-5 text-gray-500" />
                </Tooltip>

              </div>
              <p className='text-2xl font-semibold text-gray-800 flex items-center gap-1'>
                {loadingType === 'payment-info' ? <Skeleton.Node style={{ width: 60, height: 25 }} active /> : totalToken?.available?.toFixed(2)} Tokens
              </p>
            </div>
            <div>
              <div className='flex items-center gap-1'>
                <p className='text-lg text-gray-800 font-normal'>Locked Tokens</p>
                <Tooltip
                  title={<div className="text-center block ">{lockedTokensDesc}</div>}
                >
                  <ExclamationCircleIcon className="w-5 cursor-pointer h-5 text-gray-500" />
                </Tooltip>
              </div>
              <p className='text-2xl font-semibold text-gray-800 flex items-center gap-1'>
                {loadingType === 'payment-info' ? <Skeleton.Node style={{ width: 60, height: 25 }} active /> : totalToken?.locked?.toFixed(2)} Tokens
              </p>
            </div>
            <div>
              <div className='flex items-center gap-1'>
                <p className='text-lg text-gray-800 font-normal'>Total Balance</p>
                <Tooltip
                  title={<div className="text-center block ">{totalBalanceDesc}</div>}
                >
                  <ExclamationCircleIcon className="w-5 cursor-pointer h-5 text-gray-500" />
                </Tooltip>
              </div>
              <p className='text-2xl font-semibold text-gray-800 flex items-center gap-1'>
                {loadingType === 'payment-info' ? <Skeleton.Node style={{ width: 60, height: 25 }} active /> : (totalToken?.available + totalToken?.locked)?.toFixed(2)} Tokens
              </p>
            </div>
          </div>
          <div className='flex mt-5 items-center gap-3'>
            <Button
              onClick={() => setModalType('buy-token')}
              disabled={emptyCard}
              className='w-[50px]'
              type='primary'>
              Buy
            </Button>
            <Button
              loading={loadingType === 'verify-user'}
              disabled={emptyCard}
              onClick={handleWithdraw}
              className='bg-gray-100 border-gray-100'>Withdraw</Button>
          </div>
        </div>
        <img src={PaymentCard} alt="balance card" />
      </div>
      <div className='border border-gray-200 py-5 mt-5 rounded-xl'>
        <div className='flex items-center justify-between px-5 pb-5 border-b border-b-gray-200'>
          <p className='text-lg font-semibold text-gray-800'>Payment Methods</p>
          {!isSelectPayment
            ? <Button disabled={cards.length >= 5} onClick={() => setIsSelectPayment(true)} type='primary'>Add New</Button>
            : <Button onClick={() => { setIsSelectPayment(false); setPaymentMethod('') }}>Cancel</Button>
          }
        </div>

        {/* SELECT PAYMENT METHOD */}
        {isSelectPayment && (
          <Radio.Group className='w-full' onChange={(v) => setPaymentMethod(v.target.value)} value={paymentMethod}>
            <div className='mt-5 mx-5 flex flex-col gap-7'>
              <Radio value="creditCard">
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-800'>Credit Card</span>
                  <span className='text-xs font-normal text-gray-500'>Visa, Master Card</span>
                </div>
              </Radio >
              {/* CREDIT CARD FORM */}
              <div className='w-calc()'>
                {(paymentMethod === 'creditCard' && clientSecret !== '') &&
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                  </Elements>}
              </div>
              <Radio value="paypal">
                <img className='transform translate-y-1' src={Paypal} alt="paypal" />
              </Radio>
            </div>
          </Radio.Group>
        )}

        {/* NO PAYMENT AVAILABLE */}
        {(paymentMethod === '' && !isSelectPayment && emptyCard && loadingType !== 'payment-info') && (
          <div className='mt-5 flex  flex-col items-center justify-center'>
            <h6 className='font-bold text-gray-800'>No payment link created</h6>
            <p className='mt-1 text-gray-500 text-sm font-normal w-[390px] text-center'>
              Receive payment by sharing alink of a payment page with your customer
            </p>
          </div>
        )}

        {/* PAYMENT METHODS CARD */}
        {!isSelectPayment && (loadingType == 'payment-info' || loadingType == 'list-payment-methods') && (
          [1, 2, 3].map(s => <PaymentMethodsSkeleton key={s} />)
        )}
        {!isSelectPayment && loadingType !== 'payment-info' && loadingType !== 'list-payment-methods' && cards?.map((card, idx) => (
          <div
            key={card.id}
            onMouseEnter={() => setSelectedCard(card.id)}
            onMouseLeave={() => setSelectedCard('')}
            className='mt-5 cursor-pointer  px-5 py-4 rounded-xl flex items-center justify-between mx-8 border border-dashed'>
            <div className='flex items-center gap-3'>
              <img className='w-[67px] h-[38px] object-cover rounded-lg'
                src={paymentMethodBrandLogo[card.brand as keyof typeof paymentMethodBrandLogo]}
                alt="payment logo" />
              <div className='flex flex-col'>
                <p className='text-sm font-medium text-gray-800 capitalize'>****{card?.last4}</p>
                <span className='text-xs font-normal mt-[2px] text-gray-500'>Card expired at {card?.exp_year}</span>
              </div>
              {card.is_primary == 1 && (
                <TagColor hideCircle status='Primary' color='#0F766E' background='#CCFBF1' />
              )}
            </div>
            {/* BUTTON ACTIONS */}
            <div className='flex items-center gap-3'>
              {card.is_primary !== 1 &&
                <p
                  onClick={() => handleSetPaymentDefault(card.id)}
                  className='text-sm font-medium text-blue-500 hover:text-blue-600 transition-all'>Set as default
                </p>}
              <div className='w-[36px] transition-all h-[36px] hover:bg-gray-200 cursor-pointer rounded-md flex items-center justify-center bg-gray-100'>
                <PencilSquareIcon className='text-gray-800 w-5 h-5' />
              </div>
              <Button
                disabled={card.is_primary == 1}
                className='bg-gray-100 border-none'
                icon={<TrashIcon className={`${card.is_primary == 1 ? 'text-gray-400' : 'text-gray-800'} w-5 h-5`} />}
                loading={loadingType === 'delete-payment' && card.id === selectedCard}
                onClick={() => { handleRemovePaymentMethod(card.id); setSelectedCard(card.id) }}
              />
            </div>
          </div>
        ))}

        {/* BUY TOKEN */}
        {modalType === 'buy-token' && (
          <BuyToken
            balance={totalToken.available}
            onPayment={handlePayment}
            onclose={() => setModalType('')}
            open={modalType === 'buy-token'}
            cards={cards}
          />
        )}

        {/* WITHDRAW TOKEN */}
        {modalType === 'withdraw' && (
          <WithdrawToken
            balance={totalToken.available}
            onWithdrawSuccess={() => setModalType('widthdraw-success')}
            onclose={() => setModalType('')}
            open={modalType === 'withdraw'}
          />
        )}
      </div>

      {/* PAYMENT TRANSACTION + TOKEN TRANSACTION */}
      <Tabs defaultActiveKey="1" items={paymentTabs} className='mt-3' />

      {/* MODAL PAYMENT SUCCESS */}
      {modalType == 'payment-success' && (
        <ModalSuccessPayment
          open={modalType == 'payment-success'}
          newToken={addedToken}
          onClose={() => { setModalType(''); getPaymentInfo(); setOnPayment(!onPayment) }}
        />
      )}

      {/* MODAL WITHDRAW SUCCESS */}
      {modalType == 'widthdraw-success' && (
        <ModalSuccessPayout
          onClose={() => { setModalType(''); getPaymentInfo(); setOnPayment(!onPayment) }}
          open={modalType === 'widthdraw-success'} />
      )}

      {/* MODAL CONNECT WITH STRIPE ACCOUNT BEFORE WITHDRAW */}
      {modalType == 'connect-stripe' &&
        <ConnectStripeAccount
          open={modalType == 'connect-stripe'}
          onclose={() => setModalType('')}
        />}
    </div>
  )
}

export default Payment
