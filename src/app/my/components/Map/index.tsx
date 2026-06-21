'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { useConfigStore } from '@/stores';

export default function MapContainer({ position }: { position: number[] }) {
  const gaodeMap = useConfigStore((state) => state.config.gaode_map_key);
  let map: any;

  useEffect(() => {
    AOS.init();

    const { key_code, security_code } = gaodeMap ?? {};
    if (!key_code?.trim() || !security_code?.trim()) return;

    import('@amap/amap-jsapi-loader').then(async (AMapLoader) => {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: security_code,
      };

      AMapLoader.load({
        key: key_code,
        version: '2.0',
        plugins: ['AMap.Scale', 'AMap.Marker'],
      })
        .then((AMap) => {
          map = new AMap.Map('container', {
            viewMode: '3D',
            zoom: 7,
            center: position,
          });

          new AMap.Marker({
            position,
            map,
          });
        })
        .catch((e) => {
          console.log('加载地图失败：', e);
        });

      return () => map?.destroy();
    });
  }, [gaodeMap, position]);

  return (
    <>
      <div data-aos="zoom-in" className="w-full md:w-5/12 flex flex-col mr-0 md:mr-20">
        <div className="text-center text-xl mb-8">我的家乡</div>

        <div id="container" className="w-full max-h-96 h-60 sm:h-96 border rounded-3xl"></div>
      </div>
    </>
  );
}
