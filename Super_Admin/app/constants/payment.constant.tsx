import {
  Skeleton,
  TableColumnsType,
  TabsProps,
} from 'antd';
import dayjs from 'dayjs';
import AmericanExpress from '~/assets/american-express.webp';
import Discover from '~/assets/discover.png';
import MasterCard from '~/assets/mastercard.jpg';
import Visa from '~/assets/visa.png';
import PaymentHistory from '~/components/profile/PaymentHistory';
import TokenTransactionHistory
  from '~/components/profile/TokenTransactionHistory';
import TagColor from '~/components/ui/tagColor';
import {
  Payment,
  TokenTransaction,
} from '~/models/payment.model';

import { DATE_TIME_FORMAT_V2 } from './time.constant';

export const paymentHistoryColumns = (
  loading: boolean,
  handleDownload: (record: Payment) => void
): TableColumnsType<Payment> => [
    {
      title: 'Date Time',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 100 }} active size="small" />
        ) : (
          <p>{dayjs(record?.created_at).format(DATE_TIME_FORMAT_V2)}</p>
        ),
    },
    {
      title: 'Type',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 80 }} active size="small" />
        ) : (
          <p className='capitalize'>{record.type}</p>
        ),
    },
    {
      title: 'Amount',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 60 }} active size="small" />
        ) : (
          <p>${record.amount.toFixed(2)}</p>
        ),
    },
    {
      title: 'Transaction ID',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <p>{record.invoice_id}</p>
        ),
    },
    {
      title: 'Status',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <p className="text-green-600 capitalize">Success</p>
        ),
    },
    {
      title: 'Payment Method',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <div className='flex items-center gap-1'>
            <span className='capitalize'>{record.brand}</span>
            <p> {record.bank_last4 || record.card_last4 ? '....' : ''}{record?.bank_last4 || record?.card_last4}</p>
          </div>
        ),
    },
    {
      title: 'Action',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => handleDownload(record)}
          >
            Download Invoice
          </p>
        ),
    },
  ];


export const initialCardDetails = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
  focus: "",
}

export const paymentMethodBrandLogo = {
  visa: Visa,
  mastercard: MasterCard,
  amex: AmericanExpress,
  discover: Discover
};

export const availableTokensDesc = 'Tokens the brand can use immediately for transactions or withdrawals'
export const lockedTokensDesc = 'Tokens temporarily held for active campaigns to ensure funds are reserved for payments or expenses.'
export const totalBalanceDesc = "The sum of available and locked tokens in the brand's account."

export const paymentTabs: TabsProps['items'] = [
  {
    key: 'payment',
    label: 'Payment History',
    children: <PaymentHistory />,
  },
  {
    key: 'token',
    label: 'Token Transaction History',
    children: <TokenTransactionHistory />,
  },
];

export const tokenTransactionHistoryColumns = (
  loading: boolean,
): TableColumnsType<TokenTransaction> => [
    {
      title: 'Date Time',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 100 }} active size="small" />
        ) : (
          <p>{dayjs(record?.created_at).format(DATE_TIME_FORMAT_V2)}</p>
        ),
    },
    {
      title: 'Transaction Type',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 80 }} active size="small" />
        ) : (
          <p>{record.type}</p>
        ),
    },
    {
      title: 'Amount',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 60 }} active size="small" />
        ) : (
          <p>${record.amount.toFixed(2)}</p>
        ),
    },
    {
      title: 'Campaign',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <p>{record.campaign_name}</p>
        ),
    },
    {
      title: 'Status',
      render: (_, record) =>
        loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <TagColor
            status={record.status}
            background={getTokenTransactdionStatus(record?.status)?.background as string}
            color={getTokenTransactdionStatus(record.status)?.color as string} />
        ),
    },
  ];

const getTokenTransactdionStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return { background: '#CCFBF1', color: '#0F766E' }
    case 'success':
      return { background: '#CCFBF1', color: '#0F766E' }
    default:
      break;
  }
}