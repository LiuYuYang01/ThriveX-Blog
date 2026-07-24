'use client';

import { useCallback, useState } from 'react';

export interface DisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open?: boolean) => void;
}

export type DisclosureProps = Pick<DisclosureReturn, 'isOpen' | 'onClose'>;

export function useDisclosure(defaultOpen = false): DisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpenChange = useCallback((open?: boolean) => {
    if (typeof open === 'boolean') setIsOpen(open);
    else setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, onOpen, onClose, onOpenChange };
}
