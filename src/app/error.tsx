'use client';

import { useEffect } from 'react';
import { MdOutlineError } from 'react-icons/md';
import { Button } from '@/ThriveUI';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-black-a flex items-center justify-center">
      <div className="mx-auto flex flex-col items-center">
        <MdOutlineError className="text-[15vw] text-[#ff6262]" />
        <h1 className="text-[2vw] text-[#888] dark:text-white font-medium mt-8 text-xl">{error.message}</h1>
        <Button className="mt-6 cursor-pointer" color="primary" variant="shadow" onPress={reset}>
          重试
        </Button>
      </div>
    </div>
  );
}
