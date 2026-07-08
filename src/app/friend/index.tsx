import { Web as WebConfig } from '@/types/app/config';
import { Web } from '@/types/app/web';
import { User } from '@/types/app/user';

import FriendCard from './components/FriendCard';
import FriendHero, { OwnerCard } from './components/FriendHero';
import FriendSectionHeader from './components/FriendSectionHeader';
import FriendToast from './components/FriendToast';

interface Props {
  data: { [string: string]: { order: number; list: Web[] } };
  web?: WebConfig;
  author?: User;
}

export default ({ data, web, author }: Props) => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="min-h-screen relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28 space-y-16">
          <FriendHero web={web} author={author} />

          {Object.keys(data)?.map((type, sectionIndex) => (
            <section key={type} className="relative">
              <FriendSectionHeader type={type} showApply={sectionIndex === 0} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {type === '全站置顶' && <OwnerCard />}

                {data[type].list?.map((item, index) => (
                  <FriendCard key={item.id} item={item} type={type} index={index} />
                ))}
              </div>
            </section>
          ))}
        </main>

        <FriendToast />
      </div>
    </>
  );
};
