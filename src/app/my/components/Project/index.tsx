'use client';

import { useEffect } from 'react';
import { Project } from '@/types/app/my';
import { Tabs, Tab, Card, CardBody } from '@/ThriveUI';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

export default ({ data }: { data: Project[] }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div data-aos="zoom-in" className="character pb-20">
        <div className="text-center text-xl mb-8">我的作品</div>

        <div className="w-[80%] xl:w-[1200px] mx-auto">
          <div className="flex w-full flex-col">
            <Tabs className="flex w-full flex-col justify-center">
              {data?.map((item, index) => (
                <Tab key={index} tabKey={String(index)} title={item.name}>
                  <Card>
                    <CardBody className="flex-col md:flex-row md:space-x-10 py-5 dark:bg-black-b  ">
                      <div className="sticky top-0 w-full md:w-2/6 px-4">
                        <h3 className="text-[18px] mb-4">作品预览：</h3>
                        <div className="grid grid-cols-2 gap-2 p-2.5 border dark:border-[#444e5d] rounded-xl  ">
                          <PhotoProvider>
                            {item.images?.map((img, index) => (
                              <PhotoView key={index} src={img || ''}>
                                <img src={img} alt="作品图片" className="border dark:border-[#444e5d] dark hover:scale-[1.2] rounded-lg cursor-pointer transition-[scale]" />
                              </PhotoView>
                            ))}
                          </PhotoProvider>
                        </div>
                      </div>

                      <div className="overflow-auto w-full md:w-4/6 h-60 pl-4 pr-2.5 pb-8 mt-6 md:mt-0 text-sm space-y-8">
                        <div>
                          <h3 className="text-[18px] mb-4">作品详情：</h3>
                          <p className="text-gray-700 dark:text-[#8c9ab1]">{item.description}</p>
                        </div>

                        <div>
                          <h3 className="text-[18px] mb-4">技术栈：</h3>
                          <div className="text-gray-700 dark:text-[#8c9ab1]">
                            <p className="text-xs">{item.front.name}{item.front.technology}</p>
                            <p className="text-xs">{item.control.name}{item.control.technology}</p>
                            <p className="text-xs">{item.backend.name}{item.backend.technology}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[18px] mb-4">GitHub：</h3>
                          <div className="space-y-2">
                            <div>
                              <span>{item.front.name}</span>
                              <a href={item.front.url} target="_blank" className="text-xs text-primary" rel="noreferrer">
                                {item.front.url}
                              </a>
                            </div>

                            <div>
                              <span>{item.control.name}</span>
                              <a href={item.control.url} target="_blank" className="text-xs text-primary" rel="noreferrer">
                                {item.control.url}
                              </a>
                            </div>

                            <div>
                              <span>{item.backend.name}</span>
                              <a href={item.backend.url} target="_blank" className="text-xs text-primary" rel="noreferrer">
                                {item.backend.url}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
