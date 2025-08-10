
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, MoreHorizontal, Trash2 } from 'lucide-react';

import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';

// Mock data - replace with actual data fetching
const savedPrompts = [
  { id: '1', title: 'Cyberpunk Street Fashion', date: '2023-10-27', isFavorite: true, isSaved: true, prompt: 'A full-body shot of a female model in a cyberpunk-style outfit...' },
  { id: '2', title: 'Vintage Autumn Look', date: '2023-10-25', isFavorite: false, isSaved: true, prompt: 'A male model wearing a vintage tweed jacket in an autumn park...' },
  { id: '3', 'title': 'Minimalist Activewear', date: '2023-10-22', isFavorite: true, isSaved: true, prompt: 'A non-binary model in minimalist, neutral-toned activewear...' },
];

const brandPalettes = [
  { name: 'Earthy Tones', colors: ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3', '#2F4F4F'] },
  { name: 'Ocean Blues', colors: ['#00008B', '#0000CD', '#4169E1'] },
  { name: 'Monochrome', colors: ['#000000', '#36454F', '#808080', '#D3D3D3'] },
];

export default function BrandBoardPage() {
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
        <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline">Brand Board</h1>
                 <Button asChild>
                    <Link href="/">Create New Prompt</Link>
                </Button>
            </div>

          <Card>
            <CardHeader>
              <CardTitle>Saved Prompts</CardTitle>
              <CardDescription>All your saved and favorited prompts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedPrompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell>
                         {prompt.isFavorite && <Heart className="h-5 w-5 text-red-500 fill-current" />}
                      </TableCell>
                      <TableCell className="font-medium">{prompt.title}</TableCell>
                      <TableCell>{prompt.date}</TableCell>
                      <TableCell>
                        <Badge variant={prompt.isSaved ? 'default' : 'secondary'}>
                          {prompt.isSaved && <Bookmark className="mr-1 h-3 w-3" />}
                          Saved
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Prompt</DropdownMenuItem>
                            <DropdownMenuItem>Remove Favorite</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Brand Palettes</CardTitle>
                    <CardDescription>Your saved color palettes for consistent branding.</CardDescription>
                </div>
                <Button>Add New Palette</Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brandPalettes.map((palette) => (
                        <Card key={palette.name}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">{palette.name}</CardTitle>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2">
                                {palette.colors.map((color) => (
                                    <div key={color} className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: color }} />
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
