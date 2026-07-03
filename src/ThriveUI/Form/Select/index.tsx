'use client';

import { type ReactNode } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Field } from '../Field';
import SelectControl, { type SelectControlProps, type SelectOption } from './Control';

export type { SelectOption };

export interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string | number = string | number,
> extends Omit<SelectControlProps<TValue>, 'value' | 'onChange' | 'onBlur' | 'error' | 'name'> {
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  fieldClassName?: string;
}

export function Select<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string | number = string | number,
>({
  name,
  label,
  hint,
  required,
  rules,
  fieldClassName,
  ...selectProps
}: SelectProps<TFieldValues, TName, TValue>) {
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      required={required}
      rules={rules}
      className={fieldClassName}
      render={({ field, fieldState }) => (
        <SelectControl
          {...selectProps}
          id={String(name)}
          value={(field.value as TValue | null | undefined) ?? null}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={!!fieldState.error}
        />
      )}
    />
  );
}
