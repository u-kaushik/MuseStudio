
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const workspaceTypes = [
    {
        id: 'freelancer',
        title: 'Freelancer',
        description: 'Work with multiple clients',
    },
    {
        id: 'fashion-brand',
        title: 'Fashion Brand',
        description: 'Create campaigns for your own brand',
    }
]

export default function WorkspaceTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      localStorage.setItem('workspaceType', selectedType);
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <Icons.logo className="h-12 w-12 text-accent" />
            </div>
          <CardTitle className="font-headline text-3xl">Choose your workspace type</CardTitle>
          <CardDescription>This will help us tailor your experience.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {workspaceTypes.map((type) => (
                    <div
                        key={type.id}
                        className={cn(
                            'relative rounded-lg p-6 cursor-pointer border-2 text-center',
                            selectedType === type.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => setSelectedType(type.id)}
                    >
                        {selectedType === type.id && (
                            <div className="absolute top-2 right-2 bg-background rounded-full text-primary">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        )}
                        <h3 className="text-xl font-headline mb-2">{type.title}</h3>
                        <p className="text-muted-foreground">{type.description}</p>
                    </div>
                ))}
            </div>
          <Button onClick={handleContinue} className="w-full" disabled={!selectedType}>
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
