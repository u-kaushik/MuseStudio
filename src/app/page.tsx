
'use client';

import { Suspense } from 'react';
import { HomePageContent } from '@/components/home-page-content';
import { GeneratingAnimation } from '@/components/generating-animation';

export default function Home() {
  return (
    <Suspense fallback={<GeneratingAnimation />}>
      <HomePageContent />
    </Suspense>
  );
}
