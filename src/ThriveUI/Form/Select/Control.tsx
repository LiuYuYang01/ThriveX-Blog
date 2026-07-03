'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { LuCheck, LuChevronDown, LuLoader } from 'react-icons/lu';
import { FIELD_ACTIVE_CLS, FIELD_INVALID_CLS, FIELD_SELECT_TRIGGER_CLS } from '../shared/fieldStyles';

export type SelectOption<T extends string | number = string | number> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export interface SelectControlProps<T extends string | number = string | number> {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T, option: SelectOption<T>) => void;
  onBlur?: () => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  emptyText?: string;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  id?: string;
  name?: string;
  maxHeight?: number;
  renderOption?: (
    option: SelectOption<T>,
    ctx: { selected: boolean; active: boolean },
  ) => ReactNode;
}

type PanelCoords = {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
};

const TRIGGER_CLS = FIELD_SELECT_TRIGGER_CLS;

const PANEL_CLS =
  'overflow-hidden rounded-2xl border border-neutral-200/60 bg-surface shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] dark:border-neutral-700/50 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)]';

const OPTION_CLS =
  'mx-1.5 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-neutral-800 transition-colors duration-150 dark:text-neutral-100';

function getEnabledIndices<T extends string | number>(options: SelectOption<T>[]) {
  return options.reduce<number[]>((acc, option, index) => {
    if (!option.disabled) acc.push(index);
    return acc;
  }, []);
}

function findOptionIndex<T extends string | number>(
  options: SelectOption<T>[],
  value: T | null | undefined,
) {
  if (value == null) return -1;
  return options.findIndex((option) => option.value === value);
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function SelectControl<T extends string | number = string | number>({
  value: valueProp,
  defaultValue = null,
  onChange,
  onBlur,
  options,
  placeholder = '请选择',
  disabled = false,
  loading = false,
  error = false,
  emptyText = '暂无选项',
  className = '',
  triggerClassName = '',
  panelClassName = '',
  id: idProp,
  name,
  maxHeight = 240,
  renderOption,
}: SelectControlProps<T>) {
  const autoId = useId();
  const listboxId = idProp ?? autoId;
  const triggerId = `${listboxId}-trigger`;

  const isControlled = valueProp !== undefined;
  const [innerValue, setInnerValue] = useState<T | null>(defaultValue);
  const value = isControlled ? (valueProp ?? null) : innerValue;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<PanelCoords | null>(null);
  const mounted = useMounted();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const enabledIndices = useMemo(() => getEnabledIndices(options), [options]);
  const selectedIndex = useMemo(() => findOptionIndex(options, value), [options, value]);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const updateCoords = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelHeight = panel?.offsetHeight ?? Math.min(maxHeight + 16, 280);
    const gap = 8;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const placement =
      spaceBelow < panelHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';

    setCoords({
      left: rect.left,
      width: rect.width,
      top: placement === 'bottom' ? rect.bottom + gap : rect.top - gap,
      placement,
    });
  }, [maxHeight]);

  const close = useCallback(() => {
    if (openRef.current) onBlur?.();
    setOpen(false);
    setActiveIndex(-1);
    setCoords(null);
  }, [onBlur]);

  const selectIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;

      if (!isControlled) setInnerValue(option.value);
      onChange?.(option.value, option);
      close();
      triggerRef.current?.focus();
    },
    [close, isControlled, onChange, options],
  );

  const openPanel = useCallback(() => {
    if (disabled || loading) return;
    setOpen(true);

    const startIndex =
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : (enabledIndices[0] ?? -1);
    setActiveIndex(startIndex);
  }, [disabled, enabledIndices, loading, options, selectedIndex]);

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (enabledIndices.length === 0) return;

      setActiveIndex((current) => {
        if (current < 0) return enabledIndices[direction === 1 ? 0 : enabledIndices.length - 1];

        const pos = enabledIndices.indexOf(current);
        if (pos < 0) return enabledIndices[0];

        const nextPos =
          direction === 1
            ? (pos + 1) % enabledIndices.length
            : (pos - 1 + enabledIndices.length) % enabledIndices.length;
        return enabledIndices[nextPos];
      });
    },
    [enabledIndices],
  );

  const handleTriggerBlur = (event: FocusEvent<HTMLButtonElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && (rootRef.current?.contains(next) || panelRef.current?.contains(next))) return;
    if (openRef.current) return;
    onBlur?.();
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateCoords();
  }, [open, options.length, loading, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => updateCoords();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [close, open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        moveActive(event.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        if (activeIndex >= 0) selectIndex(activeIndex);
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case 'Home':
        if (!open) return;
        event.preventDefault();
        if (enabledIndices[0] != null) setActiveIndex(enabledIndices[0]);
        break;
      case 'End':
        if (!open) return;
        event.preventDefault();
        if (enabledIndices.at(-1) != null) setActiveIndex(enabledIndices.at(-1)!);
        break;
      default:
        break;
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0) selectIndex(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'Home':
        event.preventDefault();
        if (enabledIndices[0] != null) setActiveIndex(enabledIndices[0]);
        break;
      case 'End':
        event.preventDefault();
        if (enabledIndices.at(-1) != null) setActiveIndex(enabledIndices.at(-1)!);
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const panel =
    open && coords && mounted
      ? createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 60,
              transform: coords.placement === 'top' ? 'translateY(-100%)' : undefined,
            }}
            onKeyDown={onPanelKeyDown}
          >
            <div className={`${PANEL_CLS} ${panelClassName}`}>
              {loading ? (
                <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-neutral-400">
                  <LuLoader className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  加载中...
                </div>
              ) : options.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-neutral-400">{emptyText}</div>
              ) : (
                <ul
                  ref={listRef}
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={triggerId}
                  className="overflow-y-auto py-1 scrollbar-none"
                  style={{ maxHeight }}
                >
                  {options.map((option, index) => {
                    const selected = option.value === value;
                    const active = index === activeIndex;
                    const optionId = `${listboxId}-option-${index}`;

                    return (
                      <li
                        key={String(option.value)}
                        id={optionId}
                        role="option"
                        data-index={index}
                        aria-selected={selected}
                        aria-disabled={option.disabled || undefined}
                        onMouseEnter={() => {
                          if (!option.disabled) setActiveIndex(index);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectIndex(index)}
                        className={`${OPTION_CLS} ${
                          option.disabled
                            ? 'cursor-not-allowed opacity-40'
                            : active
                              ? 'bg-neutral-100 dark:bg-neutral-700/50'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/35'
                        } ${selected ? 'font-medium text-primary dark:text-primary' : ''}`}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {renderOption
                            ? renderOption(option, { selected, active })
                            : option.label}
                        </span>
                        {selected ? (
                          <LuCheck className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name ? <input type="hidden" name={name} value={value ?? ''} readOnly /> : null}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-disabled={disabled || loading || undefined}
        aria-invalid={error || undefined}
        disabled={disabled || loading}
        onClick={() => (open ? close() : openPanel())}
        onBlur={handleTriggerBlur}
        onKeyDown={onTriggerKeyDown}
        className={`${TRIGGER_CLS} ${disabled || loading ? 'cursor-not-allowed opacity-60' : ''} ${
          open ? FIELD_ACTIVE_CLS : ''
        } ${error ? FIELD_INVALID_CLS : ''} ${triggerClassName}`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            selectedOption ? 'text-foreground' : 'text-neutral-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {loading ? (
          <LuLoader className="h-4 w-4 shrink-0 animate-spin text-neutral-400" strokeWidth={1.75} />
        ) : (
          <LuChevronDown
            className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            strokeWidth={1.75}
          />
        )}
      </button>

      {panel}
    </div>
  );
}
