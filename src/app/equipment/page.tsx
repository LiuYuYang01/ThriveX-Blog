import { getPageConfigDataByNameAPI } from '@/api/config';
import { FiTag, FiArrowUpRight, FiLayers } from 'react-icons/fi';

interface Equipment {
  category: string;
  description: string;
  items: { name: string; description: string; price: string; image: string; color: string }[];
}

export default async () => {
  const { data } = await getPageConfigDataByNameAPI('equipment');
  const value = data?.value as { list: Equipment[] };

  const defaultItem = {
    name: '未命名设备',
    image: '',
    price: '0',
    description: '暂无描述',
    color: '#f4f4f5', // 默认高级灰
  };

  const defaultGroup = {
    category: '未分类',
    description: '暂无描述',
    items: [] as Equipment['items'],
  };

  const safeList: Equipment[] = (value.list ?? []).map((group) => ({
    ...defaultGroup,
    ...group,
    items: (group?.items ?? []).map((item) => ({
      ...defaultItem,
      ...item,
      price: `${item.price ?? defaultItem.price}`,
      color: item.color || defaultItem.color,
    })),
  }));

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] font-sans selection:bg-primary/30">
      <title>🔭 我的设备 - 工欲善其事必先利其器</title>
      <meta name="description" content="🔭 分享我的生产力工具" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />
        <div className="absolute top-1/4 right-[-10%] w-96 h-96 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-[-10%] w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        <div className="w-[90%] lg:w-[1200px] mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 pt-6 md:pt-12">我的设备库</h1>
          <div className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            <p className="text-sm text-gray-400">工欲善其事，必先利其器</p>
          </div>
        </div>

        <div className="w-[90%] lg:w-[1200px] mx-auto space-y-28">
          {safeList.map((group, index) => (
            <section key={index} className="scroll-mt-32">
              {/* 分类 Header */}
              <div className="mb-3 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FiLayers className="text-primary text-2xl" />
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{group.category}</h2>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-2">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    // 取消了边框变色，将 transition-all 改为具体的 transform 和 shadow 动画
                    className="group flex flex-col relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <div className="relative h-56 flex items-center justify-center p-6 overflow-hidden" style={{ backgroundColor: item.color }}>
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-white/10 mix-blend-overlay" />
                      {/* 修复了一点小细节：给 bg-white 加上 /20，不然在浅色模式下可能会太白挡住原产品图 */}
                      <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px]" />

                      <img src={item.image} alt={item.name} className="relative z-10 h-full w-full object-contain transition-[scale] duration-700 ease-out group-hover:scale-110" />
                    </div>

                    <div className="p-6 flex flex-col flex-1 bg-white dark:bg-zinc-900">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors duration-300">{item.name}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center text-zinc-900 dark:text-zinc-100 font-semibold font-mono tracking-tight">
                          <FiTag className="mr-2 text-zinc-400 group-hover:text-primary transition-colors" />
                          <span className="text-xs mr-0.5">￥</span>
                          {item.price}
                        </div>

                        {/* 取消了 hover 背景变色，仅保留文字变色和旋转动画 */}
                        <button className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-transform duration-300 transform group-hover:rotate-12">
                          <FiArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
