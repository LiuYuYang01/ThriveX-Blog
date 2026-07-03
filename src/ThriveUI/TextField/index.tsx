'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { fieldClassName } from '../Form/shared/fieldStyles';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  endContent?: ReactNode;
  fieldClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, endContent, fieldClassName: fieldWrapCls, className, id, ...props }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${fieldWrapCls ?? ''}`}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={fieldClassName({ className: endContent ? 'pr-10' : className, error: !!error })}
            {...props}
          />
          {endContent ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">{endContent}</span>
          ) : null}
        </div>
        {hint ? <p className="text-xs text-neutral-400">{hint}</p> : null}
        {error ? (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';

export default TextField;
