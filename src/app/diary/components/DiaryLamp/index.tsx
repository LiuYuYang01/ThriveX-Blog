// 桌角的台灯：灯是剪影，光落在桌面上，封面和书页共用同一盏
import './index.scss';

export default function DiaryLamp() {
  return (
    <div aria-hidden className="diary-lamp">
      <span className="diary-lamp-halo" />
      <span className="diary-lamp-pool" />
      <span className="diary-lamp-base" />
      <span className="diary-lamp-stem" />
      <span className="diary-lamp-arm" />
      <span className="diary-lamp-shade" />
      <span className="diary-lamp-bulb" />
    </div>
  );
}
