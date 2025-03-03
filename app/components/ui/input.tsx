import * as React from 'react';

import { cn } from '~/lib/utils';

import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean; 
  label?: string;
  errorMessage?: string; 
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, label, errorMessage, ...props }, ref) => {
    return (
      <div>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full mt-1 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-0",
            hasError ? 'border-red-500' : 'border-input focus:border-blue-600',
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
