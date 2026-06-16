import Show from '@/components/Show';
import { Cate } from '@/types/app/cate';
import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  list: Cate[];
  open: boolean;
  onClose: () => void;
}

export default ({ list, open, onClose }: Props) => {
  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="flex fixed top-0 left-0 w-full h-full z-[60]">
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 30, opacity: { duration: 0.2 } }} className="overflow-auto p-5 dark:border-[#2b333e] bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(44,51,62,0.9)] backdrop-blur-[5px] hide_sliding">
              <ul className="flex flex-col space-y-2">
                {list?.map((one) => (
                  <div key={one.id}>
                    {one.type === 'cate' && (
                      <li className="group/one relative hover:bg-[#e0e6ec] dark:hover:bg-[#495362] rounded-md  ">
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:!text-primary   text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                          {one.icon} {one.name}
                          <Show is={!!one.children.length}>
                            <IoIosArrowDown className="ml-2" />
                          </Show>
                        </Link>

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[50px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:!text-primary" onClick={onClose}>
                                  {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}

                    {one.type === 'page' && (
                      <li className="group/one relative hover:bg-[#e0e6ec] dark:hover:bg-[#495362] rounded-md  ">
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:!text-primary   text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                          {one.icon} {one.name}
                          <Show is={!!one.children.length}>
                            <IoIosArrowDown className="ml-2" />
                          </Show>
                        </Link>

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[50px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:!text-primary" onClick={onClose}>
                                  {two.icon} {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}

                    {one.type === 'nav' && (
                      <li className="group/one relative hover:bg-[#e0e6ec] dark:hover:bg-[#495362] rounded-md  ">
                        <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:!text-primary   text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                          {one.icon} {one.name}
                          <Show is={!!one.children.length}>
                            <IoIosArrowDown className="ml-2" />
                          </Show>
                        </Link>

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[50px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:!text-primary" onClick={onClose}>
                                  {two.icon} {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}
                  </div>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden h-full bg-[rgba(0,0,0,0.6)] w-full" onClick={onClose} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
