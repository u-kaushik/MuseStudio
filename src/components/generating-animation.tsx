
'use client';

import { Sparkles } from 'lucide-react';

export function GeneratingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <Sparkles className="h-16 w-16 text-primary animate-pulse" />
      <h2 className="mt-4 text-2xl font-headline text-primary">Generating your prompt...</h2>
      <p className="mt-2 text-muted-foreground">Please wait a moment.</p>
    </div>
  );
}
