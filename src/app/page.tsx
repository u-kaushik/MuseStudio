
'use client';

import { Suspense } from 'react';
import { HomePageContent } from '@/components/home-page-content';
import { GeneratingAnimation } from '@/components/generating-animation';
import { AppLayout } from '@/components/app-layout';

export default function Home() {
  return (
    <AppLayout>
        <Suspense fallback={<GeneratingAnimation />}>
            <HomePageContent />
        </Suspense>
    </AppLayout>
  );
}
