
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptOutputProps {
  prompt: string | null;
}

export function PromptOutput({ prompt }: PromptOutputProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  };

  if (!prompt) {
    return (
        <div className="space-y-2 mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
  }

  return (
    <div className="relative mt-6">
        <Button variant="ghost" size="icon" onClick={onCopy} className="absolute top-2 right-2 h-8 w-8">
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy prompt</span>
        </Button>
        <pre className="text-sm bg-muted rounded-md p-4 pr-12 whitespace-pre-wrap font-body">
          <code>{prompt}</code>
        </pre>
    </div>
  );
}
