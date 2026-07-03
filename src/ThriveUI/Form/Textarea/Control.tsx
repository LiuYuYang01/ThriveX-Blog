'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { fieldClassName } from '../shared/fieldStyles';

export interface TextareaControlProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextareaControl = forwardRef<HTMLTextAreaElement, TextareaControlProps>(
  ({ className = '', error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={fieldClassName({ className: `min-h-24 resize-none leading-relaxed ${className}`, error })}
      {...props}
    />
  ),
);

TextareaControl.displayName = 'TextareaControl';

export default TextareaControl;
