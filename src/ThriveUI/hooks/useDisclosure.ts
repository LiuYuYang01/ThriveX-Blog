'use client';

import { useState } from 'react';

export interface DisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open?: boolean) => void;
}

export type DisclosureProps = Pick<DisclosureReturn, 'isOpen' | 'onClose'>;

export function useDisclosure(defaultOpen = false): DisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onOpenChange = (open?: boolean) => {
    if (typeof open === 'boolean') setIsOpen(open);
    else setIsOpen((prev) => !prev);
  };

  return { isOpen, onOpen, onClose, onOpenChange };
}
