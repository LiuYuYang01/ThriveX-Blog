'use client';

import { type ReactNode } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Field } from '../Field';
import TextareaControl, { type TextareaControlProps } from './Control';

export interface TextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<TextareaControlProps, 'name' | 'error'> {
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  fieldClassName?: string;
}

export function Textarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  required,
  rules,
  fieldClassName,
  ...textareaProps
}: TextareaProps<TFieldValues, TName>) {
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      required={required}
      rules={rules}
      className={fieldClassName}
      render={({ field, fieldState }) => (
        <TextareaControl
          {...field}
          {...textareaProps}
          id={String(name)}
          error={!!fieldState.error}
        />
      )}
    />
  );
}
