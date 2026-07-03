'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { fieldClassName } from '../shared/fieldStyles';

export interface InputControlProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const InputControl = forwardRef<HTMLInputElement, InputControlProps>(
  ({ className = '', error, ...props }, ref) => (
    <input ref={ref} className={fieldClassName({ className, error })} {...props} />
  ),
);

InputControl.displayName = 'InputControl';

export default InputControl;
