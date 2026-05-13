'use client';

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface Props {
  list: string[];
}

const imgClass = 'object-cover w-full h-full min-w-full min-h-full transition-transform duration-500 group-hover/img:scale-110';
const boxClass = 'group/img relative overflow-hidden rounded-2xl cursor-pointer flex items-center justify-center';

export default ({ list }: Props) => {
  if (!list?.length) return null;

  const speed = () => 800;
  const easing = (type: number) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)');

  // 单图：大图展示
  if (list.length === 1) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <PhotoView src={list[0]}>
          <div className={`${boxClass} max-w-md shadow-sm hover:shadow-md transition-shadow duration-300`}>
            <img src={list[0]} alt="闪念图片" className={`${imgClass} max-h-[500px]`} />
          </div>
        </PhotoView>
      </PhotoProvider>
    );
  }

  // 双图：并排展示
  if (list.length === 2) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <div className="grid grid-cols-2 gap-2">
          {list.map((src, i) => (
            <PhotoView key={i} src={src}>
              <div className={`${boxClass} aspect-square`}>
                <img src={src} alt={`闪念图片-${i}`} className={imgClass} />
              </div>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    );
  }

  // 三图：微信朋友圈风格，左大右小双排
  if (list.length === 3) {
    return (
      <PhotoProvider speed={speed} easing={easing}>
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          <PhotoView src={list[0]}>
            <div className={`${boxClass} col-span-2 row-span-2 h-full min-h-0`}>
              <img src={list[0]} alt="闪念图片-0" className={imgClass} />
            </div>
          </PhotoView>
          <PhotoView src={list[1]}>
            <div className={`${boxClass} aspect-square`}>
              <img src={list[1]} alt="闪念图片-1" className={imgClass} />
            </div>
          </PhotoView>
          <PhotoView src={list[2]}>
            <div className={`${boxClass} aspect-square`}>
              <img src={list[2]} alt="闪念图片-2" className={imgClass} />
            </div>
          </PhotoView>
        </div>
      </PhotoProvider>
    );
  }

  // 四图及以上：网格（小屏 2 列，中屏及以上 4 列）
  return (
    <PhotoProvider speed={speed} easing={easing}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {list.map((src, i) => (
          <PhotoView key={i} src={src}>
            <div className={`${boxClass} aspect-square`}>
              <img src={src} alt={`闪念图片-${i}`} className={imgClass} />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};
