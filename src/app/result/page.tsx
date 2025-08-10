
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PromptOutput } from '@/components/prompt-output';
import { GeneratingAnimation } from '@/components/generating-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Heart, Pen, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

function ResultContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const initialTitle = searchParams.get('title');

  const [title, setTitle] = useState(initialTitle || 'Untitled Prompt');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [date, setDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Set date only on client-side to avoid hydration mismatch
    setDate(new Date().toLocaleString());
  }, []);

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

  const handleSave = () => {
    toast({ title: 'Success', description: 'Prompt saved successfully!' });
  };
  
  const handleFavorite = () => {
    toast({ title: 'Success', description: 'Prompt added to favorites!' });
  };


  return (
    <>
      <Progress value={100} className="w-full mb-6" />
        <CardHeader>
          <div className="flex items-start justify-between">
              <div className="flex-1">
                   {isEditingTitle ? (
                      <div className="flex items-center gap-2">
                          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-headline" />
                          <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(false)}><Check/></Button>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2">
                          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(true)}><Pen/></Button>
                      </div>
                   )}
                  <p className="text-sm text-muted-foreground mt-1">{date}</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleSave}><Bookmark className="mr-2"/> Save</Button>
                  <Button variant="outline" onClick={handleFavorite}><Heart className="mr-2"/> Favorite</Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <PromptOutput prompt={prompt} />
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2" /> Create Another Prompt
            </Link>
          </Button>
        </CardFooter>
    </>
  );
}

export default function ResultPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateToSettings = () => {
    router.push('/?tab=settings');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-headline">Muse Studio</h1>
        </Link>
        <div className="ml-auto flex items-center gap-4">
           <Button variant="outline" size="sm">
              Upgrade
            </Button>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png"} data-ai-hint="woman portrait" alt="User" />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'M'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigateTo('/brand-board')}>Brand Board</DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToSettings}>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <Suspense fallback={<GeneratingAnimation />}>
              <ResultContent />
            </Suspense>
          </Card>
        </div>
      </main>
    </div>
  );
}
