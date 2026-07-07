import Image from 'next/image';
import EmptySvg from '@/assets/svg/other/empty.svg';

const Empty = ({ info }: { info: string }) => {
  return (
    <div className="w-52 mx-auto py-12 mt-5">
      <Image src={EmptySvg} alt="空状态" width={208} height={144} />
      <div className="pt-5 text-center text-gray-700 dark:text-white">{info}</div>
    </div>
  );
};

export default Empty;
