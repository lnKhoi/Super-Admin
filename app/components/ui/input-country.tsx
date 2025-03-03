import 'react-phone-number-input/style.css';

import React, {
  forwardRef,
  useState,
} from 'react';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import {
  PHONE_INVALID,
  PHONE_REQUIRED,
} from '~/constants/messages.constant';
import { cn } from '~/lib/utils';

import { Label } from './label';

export interface CustomPhoneInputProps {
    hasError?: boolean;
    className?: string;
    value: string;
    onChange: (value: string) => void;
}

const PhoneNumberInput = forwardRef<HTMLInputElement, CustomPhoneInputProps>(
    ({ value, onChange, className, hasError, ...props }, ref) => {
        const [touched, setTouched] = useState(false);
        const [error, setError] = useState('');

        const handleBlur = () => {
            setTouched(true);
            if (!value) {
                setError(PHONE_REQUIRED);
            } else if (!isValidPhoneNumber(value)) {
                setError(PHONE_INVALID);
            } else {
                setError('');
            }
        };

        return (
            <div className="w-full -mt-1">
                <Label>Phone number</Label>
                <PhoneInput
                    value={value}
                    onChange={(newValue) => {
                        onChange(newValue || '');
                        if (touched) {
                            handleBlur();
                        }
                    }}
                    limitMaxLength
                    // onBlur={handleBlur}
                    placeholder="Enter phone number"
                    international
                    defaultCountry='AU'
                    className={cn(
                        "flex h-9 w-full mt-1 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-0",
                        hasError || error ? 'border-red-500' : 'border-input focus:border-blue-600',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <div className="text-red-600 text-sm mt-1">{error}</div>
                )}
            </div>
        );
    }
);

export default PhoneNumberInput;
