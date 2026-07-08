import Show from '@/components/Show';
import { Cate } from '@/types/app/cate';
import { getCateNavHref, getCateNavRel, getCateNavTarget } from '@/utils/cateNav';
import Link from 'next/link';
import { Fragment } from 'react';
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
          <div className="flex fixed top-0 left-0 w-full h-full z-[1000]">
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '66.666667%', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 30, opacity: { duration: 0.2 } }} className="shrink-0 overflow-auto p-5 dark:border-[#2b333e] bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(44,51,62,0.9)] backdrop-blur-[5px] hide_sliding">
              <ul className="flex flex-col space-y-2">
                {list?.map((one) => (
                  <Fragment key={one.id}>
                    {one.type === 'cate' && (
                      <li className="group/one relative rounded-md">
                        {one.children.length ? (
                          <span className="flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary! text-[#333] dark:text-white whitespace-nowrap cursor-default">
                            {one.icon} {one.name}
                            <IoIosArrowDown className="ml-2" />
                          </span>
                        ) : (
                          <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary!   text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                            {one.icon} {one.name}
                          </Link>
                        )}

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[60px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:text-primary!" onClick={onClose}>
                                  {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}

                    {one.type === 'page' && (
                      <li className="group/one relative rounded-md">
                        {one.children.length ? (
                          <span className="flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary! text-[#333] dark:text-white whitespace-nowrap cursor-default">
                            {one.icon} {one.name}
                            <IoIosArrowDown className="ml-2" />
                          </span>
                        ) : (
                          <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary! text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                            {one.icon} {one.name}
                          </Link>
                        )}

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[60px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:text-primary!" onClick={onClose}>
                                  {two.icon} {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}

                    {one.type === 'nav' && (
                      <li className="group/one relative rounded-md">
                        {one.children.length ? (
                          <span className="flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary! text-[#333] dark:text-white whitespace-nowrap cursor-default">
                            {one.icon} {one.name}
                            <IoIosArrowDown className="ml-2" />
                          </span>
                        ) : (
                          <Link href={getCateNavHref(one)} target={getCateNavTarget(one.type)} rel={getCateNavRel(one.type)} className={`flex justify-between items-center p-3 px-5 text-[15px] group-hover/one:text-primary! text-[#333] dark:text-white whitespace-nowrap`} onClick={onClose}>
                            {one.icon} {one.name}
                          </Link>
                        )}

                        <Show is={!!one.children.length}>
                          <ul className="overflow-hidden top-[60px] w-full rounded-md">
                            {one.children?.map((two) => (
                              <li key={two.id} className="group/two">
                                <Link href={getCateNavHref(two)} target={getCateNavTarget(two.type)} rel={getCateNavRel(two.type)} className="inline-block w-full p-2.5 pl-10 text-[15px] box-border text-[#666] dark:text-[#8c9ab1] hover:text-primary!" onClick={onClose}>
                                  {two.icon} {two.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Show>
                      </li>
                    )}
                  </Fragment>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 min-w-0 overflow-hidden h-full bg-[rgba(0,0,0,0.6)]" onClick={onClose} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
