
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from './icons';
import { useAuth } from '@/hooks/use-auth';
import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Icons.logo className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-headline">Muse Studio</h1>
            </Link>
             <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/">Create New Prompt</Link>
                </Button>
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
                    <DropdownMenuItem onClick={() => navigateTo('/dashboard')}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateTo('/?tab=settings')}>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-muted/40">
            {children}
        </main>
    </div>
  );
}
