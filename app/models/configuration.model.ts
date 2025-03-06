import { User } from './User.model';

export type CustomConfig = {
    name: string,
    id?:string
    createdAt?:string
    payment: {
        commissionFee: number,
        monthlyFee: number,
        creditFee: number,
        paymentMethod: string[]
    },
    integration: string[],
    brands: User [] | string[] 

}