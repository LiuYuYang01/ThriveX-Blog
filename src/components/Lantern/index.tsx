import React from 'react';
import './index.scss';

interface Props {
  data: string[];
}

export default ({ data }: Props) => {
  // 定义灯笼的位置数组
  const positions = [
    { left: '10px', top: '0' },
    { left: '160px', top: '0' },
    { right: '160px', top: '0' },
    { right: '10px', top: '0' },
  ];

  return (
    <div className="w-full hidden md:block">
      {data.map((item, index) => (
        <div key={index} className="lantern-box z-999" style={positions[index]}>
          <div className="lantern-light">
            <div className="lantern-line"></div>
            <div className="lantern-circle">
              <div className="lantern-rect">
                <div className="lantern-text">{item}</div>
              </div>
            </div>
            <div className="lantern-tassel-top">
              <div className="lantern-tassel-middle"></div>
              <div className="lantern-tassel-bottom"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
