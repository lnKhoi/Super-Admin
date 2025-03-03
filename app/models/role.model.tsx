import {
  User,
  UserPermission,
} from './User.model';

export type Role = {
    name: string,
    description: string,
    users: string[] | UserPermission[] | User[],
    id:string,
    brandId?:string,
    createdAt?:string
    permissions: string[]
    create_at?:string
}

export type Permission  =
| 'approve-influencers-gift-request'
| 'assign-user-to-role'
| 'buy-tokens'
| 'change-password'
| 'chat-with-influencer'
| 'connect-shopify'
| 'create-user'
| 'create-campaign'
| 'create-profile'
| 'create-role'
| 'dispute-content'
| 'download-content'
| 'download-csv-template'
| 'download-invoice'
| 'edit-campaign'
| 'edit-profile'
| 'edit-user'
| 'enter-manufacturing-cost-shipping-fee'
| 'give-star-to-influencer'
| 'import-influencer-csv'
| 'invite-imported-influencers'
| 'link-payment-method'
| 'post-content-on-behalf'
| 'remove-role'
| 'remove-user'
| 'remove-user-from-role'
| 'review-content'
| 'review-content-deadline'
| 'setting-timezone'
| 'subscribe-plan'
| 'suggest-content-deadline'
| 'view-applicants'
| 'view-campaign'
| 'view-content'
| 'view-customer-order'
| 'view-finance-overview'
| 'view-imported-influencer'
| 'view-influencer-list-profile'
| 'view-influencer-orders'
| 'view-influencer-payment'
| 'view-payment-token-history'
| 'view-profile'
| 'view-report'
| 'view-role'
| 'view-shopify-products'
| 'view-user'
| 'view-wallet'
| 'withdraw-tokens'
| 'view-permissions'
