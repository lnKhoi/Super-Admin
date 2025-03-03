import * as React from 'react';

import { cn } from '~/lib/utils';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
    label?: string;
    errorMessage?: string;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, hasError, label, errorMessage, ...props }, ref) => {
        return (
            <div>
                {label && <Label htmlFor={props.id}>{label}</Label>}
                <div className={cn(
                    "flex h-9 w-full mt-1 items-center gap-1 rounded-md border px-3 py-1 text-sm border-none shadow-sm bg-gray-100 transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-0",
                    hasError ? 'border-red-500' : 'border-input focus:border-blue-600',
                    className
                )}>
                    <MagnifyingGlassIcon width={20} color='#6B7280' />

                    <input
                        className='w-full bg-gray-100 border-none outline-none ml-1'
                        type={type}

                        ref={ref}
                        {...props}
                    />
                </div>
                {errorMessage && (
                    <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
                )}
            </div>
        );
    }
);

InputSearch.displayName = "Input";
export { InputSearch };
