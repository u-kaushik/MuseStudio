'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
       <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline">Generated Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Generated Prompt</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy prompt</span>
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted rounded-md p-4 whitespace-pre-wrap font-body">
          <code>{prompt}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
