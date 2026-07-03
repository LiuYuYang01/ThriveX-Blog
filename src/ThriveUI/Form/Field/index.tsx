'use client';

import { useId, type ReactNode } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';

export interface FieldLayoutProps {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

function FieldLayout({
  label,
  htmlFor,
  hint,
  error,
  required,
  className = '',
  children,
}: FieldLayoutProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      {children}

      {hint ? (
        <p id={hintId} className="text-xs text-neutral-400">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldDescribedBy(hintId?: string, errorId?: string) {
  return [hintId, errorId].filter(Boolean).join(' ') || undefined;
}

export interface FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  className?: string;
  control?: ControllerProps<TFieldValues, TName>['control'];
  render: ControllerProps<TFieldValues, TName>['render'];
}

export function Field<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  required,
  rules,
  className,
  control: controlProp,
  render,
}: FieldProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>();
  const control = controlProp ?? form.control;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={(controllerProps) => {
        const errorMessage = controllerProps.fieldState.error?.message;

        return (
          <FieldLayout
            label={label}
            htmlFor={String(name)}
            hint={hint}
            required={required}
            error={errorMessage}
            className={className}
          >
            {render(controllerProps)}
          </FieldLayout>
        );
      }}
    />
  );
}

export { Controller, FormProvider, useForm, useFormContext };
export type { FieldPath, FieldValues, RegisterOptions, UseFormProps, UseFormReturn };
