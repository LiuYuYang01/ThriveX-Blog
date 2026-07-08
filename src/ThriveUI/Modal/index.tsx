'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { LuX } from 'react-icons/lu';

const EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_MS = 520;
const BLUR_STYLE = {
  transition: 'background-color .45s cubic-bezier(0.22,1,.36,1),backdrop-filter .65s cubic-bezier(0.22,1,.36,1),-webkit-backdrop-filter .65s cubic-bezier(0.22,1,.36,1)',
} as const;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  titleId?: string;
  preventClose?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  titleId: titleIdProp,
  preventClose,
  className = '',
}: ModalProps) {
  const reduce = useReducedMotion();
  const autoId = useId();
  const titleId = titleIdProp ?? autoId;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [show, setShow] = useState(open);
  const [blur, setBlur] = useState(false);
  const [exit, setExit] = useState(false);

  const dismiss = (force = false) => {
    if ((!force && preventClose) || exit) return;
    setExit(true);
    setBlur(false);
    timer.current = setTimeout(() => {
      setShow(false);
      setExit(false);
      onClose();
    }, reduce ? 0 : EXIT_MS);
  };

  useEffect(() => {
    if (open) {
      clearTimeout(timer.current);
      queueMicrotask(() => {
        setExit(false);
        setShow(true);
      });
      return;
    }
    if (show && !exit) {
      queueMicrotask(() => dismiss(true));
    }
     
  }, [open]);

  useEffect(() => {
    if (!show || exit) return;
    if (reduce) {
      queueMicrotask(() => setBlur(true));
      return;
    }
    queueMicrotask(() => setBlur(false));
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setBlur(true)));
    return () => cancelAnimationFrame(id);
  }, [show, exit, reduce]);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="关闭"
        onClick={() => dismiss()}
        className="absolute inset-0"
        style={{
          ...BLUR_STYLE,
          backgroundColor: blur ? 'rgba(0,0,0,.42)' : 'transparent',
          backdropFilter: blur ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: blur ? 'blur(12px)' : 'blur(0px)',
        }}
      />

      <motion.div
        role="dialog"
        aria-modal
        aria-labelledby={title ? titleId : undefined}
        className={`relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-neutral-200/80 bg-surface p-6 shadow-panel sm:mx-4 sm:rounded-3xl dark:border-neutral-700/60 ${className}`}
        initial={reduce ? false : { y: 56, opacity: 0, scale: 0.96 }}
        animate={exit ? { y: 32, opacity: 0, scale: 0.97 } : { y: 0, opacity: 1, scale: 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : exit
              ? { duration: 0.38, ease: EASE }
              : { type: 'spring', damping: 28, stiffness: 280, delay: 0.08 }
        }
      >
        {(title || description) && (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && <h2 id={titleId} className="text-lg font-semibold text-foreground">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-neutral-400">{description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss()}
              disabled={preventClose}
              className="shrink-0 cursor-pointer rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-800"
            >
              <LuX className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
        {children}
        {footer ? <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200/80 pt-4 pb-3 dark:border-neutral-700/60">{footer}</div> : null}
      </motion.div>
    </div>
  );
}

export function ModalFab({
  onClick,
  children,
  icon,
  className = '',
}: {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-6 sm:pb-8">
      <button
        type="button"
        onClick={onClick}
        className={`pointer-events-auto inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-neutral-900/85 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[scale] hover:scale-[1.04] active:scale-[0.97] dark:border-white/15 dark:bg-white/10 ${className}`}
      >
        {icon}
        {children}
      </button>
    </div>
  );
}

export default Modal;
