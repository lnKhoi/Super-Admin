export type CampaignsInFinance = {
    campaignName: string
    creatorCount: number
    totalBudget: number
    totalPayment:number
    campaignId:string
    totalPaid:number
    id:string
    totalTokenEarned: number
    totalMembers:number
}

export type FinanceMetrics = {
    totalMembers:number
    totalPayment:number
    campaignName:string
    totalPaid:number
}

export type MemberInCampaign = {
    paymentDate:string
    amountToPay:number
    creatorName:string
    status:string
}