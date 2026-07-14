import { Suspense } from 'react';

import Container from '@/components/Container';
import ArticlesFallback from '@/components/ArticlesFallback';
import SlideFallback from '@/components/SlideFallback';
import HomeShell from './components/HomeShell';
import HomeArticles from './components/HomeArticles';
import HomeSidebar from './components/HomeSidebar';

interface Props {
  searchParams: Promise<{ page?: number }>;
}

export default (props: Props) => (
  <>
    <Suspense fallback={<SlideFallback />}>
      <HomeShell />
    </Suspense>
    
    <Container>
      <Suspense fallback={<ArticlesFallback />}>
        <HomeArticles searchParams={props.searchParams} />
      </Suspense>
      <Suspense fallback={null}>
        <HomeSidebar />
      </Suspense>
    </Container>
  </>
);
