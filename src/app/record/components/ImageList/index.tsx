'use client';

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface Props {
  list: string[];
}

export default ({ list }: Props) => {
  if (!list?.length) return null;

  const cols = list.length >= 4 ? 4 : list.length;
  const gridClass = cols === 3 ? 'grid-cols-3' : cols === 4 ? 'grid-cols-4' : cols === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const photoH = cols === 3 ? 'h-[118px]' : 'h-[164px]';

  return (
    <PhotoProvider speed={() => 800}>
      <div className={`grid gap-3 ${gridClass}`}>
        {list.slice(0, 4).map((src, i) => (
          <PhotoView key={i} src={src}>
            <button type="button" className={`group relative w-full overflow-hidden rounded-[7px] bg-[#d8dde3] ${photoH} cursor-pointer`}>
              <img src={src} alt={`闪念图片-${i}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {i === 3 && list.length > 4 && (
                <>
                  <span className="absolute inset-0 bg-[rgba(17,22,25,0.35)]" />
                  <span className="absolute inset-0 z-[2] grid place-items-center text-[22px] font-bold text-white">+{list.length - 3}</span>
                </>
              )}
            </button>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};
