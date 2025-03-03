import React, { useState } from 'react';

import { Button } from 'antd';
import { DOMAIN } from '~/constants/env.constant';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false); 

    const handleError = (error: StripeError) => {
        alert(error.message || 'An unknown error occurred.');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            alert('Stripe.js is not loaded yet.');
            return;
        }

        setLoading(true); 

        // @ts-ignore
        const { setupIntent, error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: `${DOMAIN}/manager/my-profile`, 
            },
        });

        if (error) {
            handleError(error);
        } else if (setupIntent) {
            alert(`PaymentIntent created: ${setupIntent.id}`);
        }

        setLoading(false); 
    };

    return (
        <form className='max-w-[1200px]' onSubmit={handleSubmit}>
            <PaymentElement />
            <Button className='mt-3' type="primary" htmlType="submit" loading={loading}>
                Save
            </Button>
        </form>
    );
};

export default CheckoutForm;
