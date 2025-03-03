export type CreditCard = {
    id: string;
    user_id: string;
    stripe_payment_method_id: string;
    type: string;
    last4: string;
    brand: string;
    is_primary?:number
    exp_year:string
    created_at: string;
}

export type TransactionHistory = {
    time:string,
    type:string
    amount:number
}

export type CardDetails = {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
    focus: string;
  }
  

  export type  Payment = {
    id: string;
    amount: number;
    bank_last4?:number
    card_last4?:number
    bank_name?:string
    status: string;
    invoice_id: string;
    created_at: string;
    type: string;
    last4:string
    brand: string;
  }

  export type TokenTransaction = {
    user_id:string,
    amount:number,
    status:string,
    created_at:string
    type:string
    campaign_name:string
  }