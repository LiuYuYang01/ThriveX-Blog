import { ReactNode } from 'react'
import Ripple from '@/components/Ripple'
import { getRandom } from '@/utils'
import { getConfigDataAPI } from '@/api/project'
import { Theme } from '@/types/app/project'

interface Props {
  src?: string // 图片列表
  isRipple?: boolean // 是否显示波浪
  children?: ReactNode
}

export default async ({ src, isRipple = true, children }: Props) => {
  const { data } = (await getConfigDataAPI<Theme>('layout')) || { data: {} as Theme }
  const covers = JSON.parse(data.covers || '[]')

  const sty = {
    backgroundImage: `url(${src ? src : covers[getRandom(0, covers.length - 1)]})`
  }

  return (
    <>
      <div
        className="overflow-hidden h-screen sm:h-screen md:h-screen relative bg-cover bg-center after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]"
        style={sty}
      >
        <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full"></div>
        <div>{children}</div>
      </div>

      {isRipple && <Ripple />}
    </>
  )
}
