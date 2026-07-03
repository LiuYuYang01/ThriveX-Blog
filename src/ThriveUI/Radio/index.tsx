'use client';

import { type ReactNode } from 'react';

export interface RadioGroupProps {
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface RadioProps {
  value: string;
  children?: ReactNode;
}

export function RadioGroup({
  label,
  value,
  defaultValue,
  onValueChange,
  children,
  className = '',
}: RadioGroupProps) {
  const current = value ?? defaultValue ?? '';

  const radios = (Array.isArray(children) ? children : [children]).filter(
    (c): c is React.ReactElement<RadioProps> =>
      !!c && typeof c === 'object' && 'type' in c && c.type === Radio,
  );

  return (
    <fieldset className={className}>
      {label ? <legend className="mb-2 text-sm font-medium">{label}</legend> : null}
      <div className="flex flex-wrap gap-2">
        {radios.map((radio) => {
          const selected = radio.props.value === current;
          return (
            <label
              key={radio.props.value}
              className="inline-flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                className="sr-only"
                checked={selected}
                onChange={() => onValueChange?.(radio.props.value)}
              />
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary' : 'border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
              </span>
              {radio.props.children}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Radio(props: RadioProps) {
  void props;
  return null;
}

export default RadioGroup;
