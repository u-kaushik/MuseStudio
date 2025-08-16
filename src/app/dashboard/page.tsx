
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, MoreHorizontal, Trash2, UserPlus, Building, GraduationCap, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import { useClients, Client } from '@/hooks/use-clients';
import { useCampaigns, Campaign } from '@/hooks/use-campaigns';
import { AddClientForm } from '@/components/add-client-form';
import { AddCampaignForm } from '@/components/add-campaign-form';

type Prompt = {
  id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  isSaved: boolean;
  prompt: string;
};

// Mock data - replace with actual data fetching
const savedPrompts: Prompt[] = [
  { id: '1', title: 'Cyberpunk Street Fashion', date: '2023-10-27', isFavorite: true, isSaved: true, prompt: 'A full-body shot of a female model in a cyberpunk-style outfit, futuristic cityscape at night, neon lights, high-tech gear, shot on 70mm, f/2.8.' },
  { id: '2', title: 'Vintage Autumn Look', date: '2023-10-25', isFavorite: false, isSaved: true, prompt: 'A male model wearing a vintage tweed jacket in an autumn park, golden hour lighting, soft shadows, warm color palette, shallow depth of field.' },
  { id: '3', 'title': 'Minimalist Activewear', date: '2023-10-22', isFavorite: true, isSaved: true, prompt: 'A non-binary model in minimalist, neutral-toned activewear, clean studio background, geometric shapes, dynamic pose, bright, even lighting.' },
];

export const brandPalettes = [
  { name: 'Earthy Tones', colors: ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3', '#2F4F4F'] },
  { name: 'Ocean Blues', colors: ['#00008B', '#0000CD', '#4169E1'] },
  { name: 'Monochrome', colors: ['#000000', '#36454F', '#808080', '#D3D3D3'] },
];

const lifetimeAccessUsers = ['ukaushik37@gmail.com', 'vay.kaushik@gmail.com'];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { clients, addClient, removeClient } = useClients();
  const { campaigns, addCampaign } = useCampaigns();
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddClientOpen, setAddClientOpen] = useState(false);
  const [isAddCampaignOpen, setAddCampaignOpen] = useState(false);
  const [workspaceType, setWorkspaceType] = useState('');
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);

  const brand = clients.find(c => c.id === 'fashion-brand-details');

  useEffect(() => {
    if (user && user.email) {
      setHasLifetimeAccess(lifetimeAccessUsers.includes(user.email));
    }
  }, [user]);

  useEffect(() => {
    const storedWorkspaceType = localStorage.getItem('workspaceType');
    if (storedWorkspaceType) {
      setWorkspaceType(storedWorkspaceType);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);
  
  const handleViewPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  };
  
  const handleAddClient = (client: Omit<Client, 'id'>) => {
    const id = workspaceType === 'fashion-brand' ? 'fashion-brand-details' : crypto.randomUUID();
    addClient({ ...client, id });
    setAddClientOpen(false);
  };

  const handleAddCampaign = (campaign: Omit<Campaign, 'id'>) => {
    addCampaign({ ...campaign, id: crypto.randomUUID() });
    setAddCampaignOpen(false);
  }

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
              <DropdownMenuItem onClick={() => navigateTo('/dashboard')}>Dashboard</DropdownMenuItem>
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
                <h1 className="text-3xl font-headline">Dashboard</h1>
                 <Button asChild>
                    <Link href="/">Create New Prompt</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <GraduationCap className="h-8 w-8 text-accent" />
                        <div>
                            <CardTitle>M.U.S.E. Lessons</CardTitle>
                            <CardDescription>Unlock the full potential of AI with our expert-led mini-course.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border bg-card-foreground/5 p-4">
                        <p className="font-medium">Get started with the M.U.S.E. framework.</p>
                        {hasLifetimeAccess ? (
                            <Badge variant="secondary">Lifetime Access</Badge>
                        ) : (
                            <Button>Enroll Now</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {workspaceType === 'fashion-brand' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Brand</CardTitle>
                    <CardDescription>Manage your brand name, palette, and objective.</CardDescription>
                  </div>
                  {!brand && (
                     <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
                        <DialogTrigger asChild>
                             <Button><Building className="mr-2" /> Add Brand Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Your Brand Details</DialogTitle>
                                <DialogDescription>
                                    Enter the details for your brand.
                                </DialogDescription>
                            </DialogHeader>
                            <AddClientForm onSubmit={handleAddClient} onCancel={() => setAddClientOpen(false)} isBrandFlow={true} />
                        </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  {brand ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Brand Name</h4>
                        <p>{brand.name}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Default Brand Palette</h4>
                        <p>{brand.defaultBrandPalette}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Commercial Objective</h4>
                        <p>{brand.commercialObjective}</p>
                      </div>
                       <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
                          <DialogTrigger asChild>
                               <Button variant="outline">Edit Brand Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                              <DialogHeader>
                                  <DialogTitle>Edit Your Brand Details</DialogTitle>
                                  <DialogDescription>
                                      Update the details for your brand.
                                  </DialogDescription>
                              </DialogHeader>
                              <AddClientForm
                                onSubmit={handleAddClient}
                                onCancel={() => setAddClientOpen(false)}
                                isBrandFlow={true}
                                initialData={brand}
                              />
                          </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                     <p className="text-center text-muted-foreground py-8">You haven't added your brand details yet.</p>
                  )}
                </CardContent>
              </Card>
            )}


          {workspaceType === 'freelancer' && (
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <CardTitle>Clients</CardTitle>
                      <CardDescription>Manage your clients and their brand assets.</CardDescription>
                  </div>
                   <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
                      <DialogTrigger asChild>
                           <Button><UserPlus className="mr-2" /> Add Client</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Add New Client</DialogTitle>
                              <DialogDescription>
                                  Enter the details for your new client.
                              </DialogDescription>
                          </DialogHeader>
                          <AddClientForm onSubmit={handleAddClient} onCancel={() => setAddClientOpen(false)} />
                      </DialogContent>
                  </Dialog>
              </CardHeader>
              <CardContent>
                {clients.filter(c => c.id !== 'fashion-brand-details').length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Default Palette</TableHead>
                        <TableHead>Default Objective</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.filter(c => c.id !== 'fashion-brand-details').map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.defaultBrandPalette}</TableCell>
                          <TableCell>{client.commercialObjective}</TableCell>
                          <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => removeClient(client.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">You haven't added any clients yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Campaigns</CardTitle>
                    <CardDescription>Manage your active and upcoming campaigns.</CardDescription>
                </div>
                 <Dialog open={isAddCampaignOpen} onOpenChange={setAddCampaignOpen}>
                      <DialogTrigger asChild>
                           <Button><PlusCircle className="mr-2" /> Add Campaign</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Create New Campaign</DialogTitle>
                              <DialogDescription>
                                  Enter the details for your new campaign.
                              </DialogDescription>
                          </DialogHeader>
                          <AddCampaignForm clients={clients} onSubmit={handleAddCampaign} onCancel={() => setAddCampaignOpen(false)} />
                      </DialogContent>
                  </Dialog>
            </CardHeader>
            <CardContent>
                 {campaigns.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Season</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>{clients.find(c => c.id === campaign.clientId)?.name || 'N/A'}</TableCell>
                            <TableCell>{campaign.season}</TableCell>
                            <TableCell>{campaign.year}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                 ) : (
                    <p className="text-center text-muted-foreground py-8">You haven't created any campaigns yet.</p>
                 )}
            </CardContent>
          </Card>


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
                            <DropdownMenuItem onClick={() => handleViewPrompt(prompt)}>View Prompt</DropdownMenuItem>
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

       {selectedPrompt && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">{selectedPrompt.title}</DialogTitle>
              <DialogDescription>
                Saved on {selectedPrompt.date}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{selectedPrompt.prompt}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
