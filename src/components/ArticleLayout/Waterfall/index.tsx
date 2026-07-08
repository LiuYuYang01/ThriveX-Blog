'use client';

import Link from 'next/link';
import { Article } from '@/types/app/article';
import { getRandomImage } from '@/utils';
import CoverImage from '@/components/CoverImage';
import Masonry from 'react-masonry-css';

interface WaterfallProps {
  data: Paginate<Article[]>;
  covers: string[];
}

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  700: 2,
};

export default ({ data, covers }: WaterfallProps) => {
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid mb-12" columnClassName="masonry-grid_column">
      {data.result.map((item) => (
        <div key={item.id} className="group overflow-hidden mt-2.5 rounded-xl bg-white dark:bg-black-b border dark:border-black-b hover:shadow-[0_10px_20px_1px_rgb(83,157,253,.1)]   cursor-pointer">
          <Link href={`/article/${item.id}`}>
            <div className="overflow-hidden relative h-32 scale-100 hover:scale-125 z-10 transition-[scale] duration-300 ease-out">
              <CoverImage
                src={getRandomImage(item.cover, covers)}
                alt={item.title}
                sizes="(max-width: 700px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="py-2 px-4">
              <h1 className="mb-2 text-black dark:text-white group-hover:text-primary line-clamp-2  ">{item.title}</h1>
              <div className="text-sm text-gray-500 dark:text-[#8c9ab1] line-clamp-4">{item.description}</div>
            </div>
          </Link>
        </div>
      ))}
    </Masonry>
  );
};
