import { LYRICLIST_NULL_TEXT } from '@/constant'
import { ScrollShadow } from '@heroui/scroll-shadow'

interface lyricBox {
  currentLyricIndex: number
  lyricList: any[]
  lyricBoxRef: any
  leading?: number
}

export default function LyricBox(props: lyricBox) {
  // 获取歌词相关信息的hook
  const { currentLyricIndex, lyricList, lyricBoxRef, leading } = props

  //样式类名
  const pClass = (index: number) =>
    (currentLyricIndex === index ? 'font-semibold bg-white-100/50 scale-125' : undefined) +
    ' transition'
  //样式对象
  const style = { padding: `${leading ?? 5}px 0` }

  return (
    <ScrollShadow hideScrollBar size={100} className="w-[280px]">
      <div ref={lyricBoxRef} className="transition">
        {lyricList.length > 0 ? (
          lyricList.map((item, index) => (
            <p
              key={item.time + item.content}
              className={`text-center leading-[18px] ${pClass(index)}`}
              style={style}
            >
              {item.content}
            </p>
          ))
        ) : (
          <div className="text-[15px] text-center">{LYRICLIST_NULL_TEXT}</div>
        )}
      </div>
    </ScrollShadow>
  )
}
