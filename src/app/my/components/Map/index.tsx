'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAppConfig } from '@/components/AppConfigProvider';

export default function MapContainer({ position }: { position: number[] }) {
  let map: any;
  const { publicConfig } = useAppConfig();
  const gaodeConfig = publicConfig?.gaode_map_key;

  useEffect(() => {
    AOS.init();

    // 后台未配置高德 Key 时不加载地图
    if (!gaodeConfig?.key_code) return;
    const { key_code, security_code } = gaodeConfig;

    // 确保代码仅在客户端执行
    import('@amap/amap-jsapi-loader').then((AMapLoader) => {
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
            viewMode: '3D', // 是否为3D地图模式
            zoom: 7,
            center: position, // 初始化地图中心点位置
          });

          new AMap.Marker({
            position, // 标记位置
            map, // 将标记添加到地图
          });
        })
        .catch((e) => {
          console.log('加载地图失败：', e);
        });

      return () => map?.destroy();
    });
  }, [gaodeConfig]);

  return (
    <>
      <div data-aos="zoom-in" className="w-full md:w-5/12 flex flex-col mr-0 md:mr-20">
        <div className="text-center text-xl mb-8">我的家乡</div>

        <div id="container" className="w-full max-h-96 h-60 sm:h-96 border rounded-3xl"></div>
      </div>
    </>
  );
}
