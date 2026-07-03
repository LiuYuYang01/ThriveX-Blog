'use client';

import { type ReactNode } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Field } from '../Field';
import InputControl, { type InputControlProps } from './Control';

export interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputControlProps, 'name' | 'error'> {
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  fieldClassName?: string;
}

export function Input<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  required,
  rules,
  fieldClassName,
  ...inputProps
}: InputProps<TFieldValues, TName>) {
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      required={required}
      rules={rules}
      className={fieldClassName}
      render={({ field, fieldState }) => (
        <InputControl
          {...field}
          {...inputProps}
          id={String(name)}
          error={!!fieldState.error}
        />
      )}
    />
  );
}
