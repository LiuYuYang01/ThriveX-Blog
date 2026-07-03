'use client';

import { Modal, Button, TextField, useDisclosure } from '@/ThriveUI';
import { MdEnhancedEncryption } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getArticleDataAPI } from '@/api/article';
import { toast, ToastContainer } from 'react-toastify';

interface Props {
  id: number;
}

export default function Encrypt({ id }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [password, setPassword] = useState('');

  const { isOpen, onOpen } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleVerifyPassword = async () => {
    const res = await getArticleDataAPI(id, password);

    if (res?.code === 200) {
      router.push(`${pathname}?password=${password}`);
    } else {
      toast.error('访问密码错误，请重新输入');
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {}}
        preventClose
        title="🔑 该文章已加密"
        footer={
          <>
            <Button variant="light" onPress={() => router.push('/')}>
              返回
            </Button>
            <Button color="primary" onPress={handleVerifyPassword}>
              校验
            </Button>
          </>
        }
      >
        <TextField
          ref={inputRef}
          endContent={<MdEnhancedEncryption className="pointer-events-none flex-shrink-0 text-2xl text-neutral-400" />}
          label="访问密码"
          type="password"
          placeholder="文章受保护，请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.code === 'Enter') {
              handleVerifyPassword();
            }
          }}
        />
      </Modal>

      <ToastContainer />
    </>
  );
}
