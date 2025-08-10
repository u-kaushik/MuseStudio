
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptOutput } from '@/components/prompt-output';
import { GeneratingAnimation } from '@/components/generating-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function ResultContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-lg text-muted-foreground">No prompt was generated.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PromptOutput prompt={prompt} />
      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2" /> Create Another Prompt
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-center gap-4 border-b bg-background px-4 sm:px-6">
        <h1 className="text-xl font-headline">Generated Prompt</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Suspense fallback={<GeneratingAnimation />}>
            <ResultContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
