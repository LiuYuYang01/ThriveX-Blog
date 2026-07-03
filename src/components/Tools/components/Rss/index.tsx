'use client';

import { Web } from '@/types/app/config';
import { Modal, Snippet, type DisclosureProps } from '@/ThriveUI';

interface Props {
  disclosure: DisclosureProps;
  data: Web;
}

export default ({ disclosure, data }: Props) => {
  const { isOpen, onClose } = disclosure;

  return (
    <Modal open={isOpen} onClose={onClose} title="查看订阅地址" className="max-w-2xl">
      <Snippet symbol="">{data?.url + '/api/rss'}</Snippet>
    </Modal>
  );
};
