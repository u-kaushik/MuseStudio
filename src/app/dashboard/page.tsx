
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, MoreHorizontal, Trash2, UserPlus, Building, GraduationCap, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import { useClients, Client } from '@/hooks/use-clients';
import { useCampaigns, Campaign } from '@/hooks/use-campaigns';
import { AddClientForm } from '@/components/add-client-form';
import { AddCampaignForm } from '@/components/add-campaign-form';
import { AppLayout } from '@/components/app-layout';

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

const museLessons = [
    { 
        letter: 'M', 
        title: 'Morphology',
        description: 'Understand the form, shape, and structure of your subject.',
        progress: 75,
        image: 'https://placehold.co/600x400.png',
        hint: 'fashion model pose'
    },
    { 
        letter: 'U',
        title: 'Uniformity',
        description: 'Master texture, material, and consistency in your visuals.',
        progress: 50,
        image: 'https://placehold.co/600x400.png',
        hint: 'fabric texture'
    },
    { 
        letter: 'S',
        title: 'Style',
        description: 'Define the artistic style, era, and aesthetic of your brand.',
        progress: 25,
        image: 'https://placehold.co/600x400.png',
        hint: 'vintage fashion sketch'
    },
    { 
        letter: 'E',
        title: 'Essence',
        description: 'Capture the mood, feeling, and core concept of your campaign.',
        progress: 10,
        image: 'https://placehold.co/600x400.png',
        hint: 'inspirational mood board'
    }
];

function DashboardContent() {
  const { user, loading } = useAuth();
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
  
  return (
    <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline">Dashboard</h1>
             <Button asChild>
                <Link href="/">Create New Prompt</Link>
            </Button>
        </div>
        
        <Accordion type="multiple" defaultValue={['muse-launch', 'brand-details', 'clients', 'campaigns', 'saved-prompts', 'brand-palettes']} className="w-full space-y-4">
            <AccordionItem value="muse-launch" className="border rounded-lg bg-card">
                <Card>
                    <AccordionTrigger className="p-6">
                        <div className="flex items-center gap-4">
                            <GraduationCap className="h-8 w-8 text-accent" />
                            <div>
                                <CardTitle>M.U.S.E. Launch</CardTitle>
                                <CardDescription>Create commercially ready AI fashion models</CardDescription>
                            </div>
                        </div>
                        {hasLifetimeAccess ? (
                            <Badge variant="secondary" className="mr-4">Lifetime Access</Badge>
                        ) : (
                            <Button asChild className="mr-4">
                                <Link href="/">Get Started</Link>
                            </Button>
                        )}
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {museLessons.map((lesson) => (
                                <Card key={lesson.letter} className="flex flex-col">
                                    <Image src={lesson.image} data-ai-hint={lesson.hint} alt={lesson.title} width={600} height={400} className="object-cover w-full h-40 rounded-t-lg" />
                                    <CardHeader>
                                        <CardTitle className="font-headline">{lesson.letter}: {lesson.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-2">
                                        <Progress value={lesson.progress} />
                                        <span className="text-xs text-muted-foreground">{lesson.progress}% complete</span>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>

            {workspaceType === 'fashion-brand' && (
                <AccordionItem value="brand-details" className="border rounded-lg bg-card">
                    <Card>
                        <AccordionTrigger className="p-6">
                            <div>
                                <CardTitle>Your Brand</CardTitle>
                                <CardDescription>Manage your brand name, palette, and objective.</CardDescription>
                            </div>
                             {!brand && (
                                <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="mr-4"><Building className="mr-2" /> Add Brand Details</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Your Brand Details</DialogTitle>
                                            <DialogDescription>Enter the details for your brand.</DialogDescription>
                                        </DialogHeader>
                                        <AddClientForm onSubmit={handleAddClient} onCancel={() => setAddClientOpen(false)} isBrandFlow={true} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
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
                                            <DialogDescription>Update the details for your brand.</DialogDescription>
                                        </DialogHeader>
                                        <AddClientForm onSubmit={handleAddClient} onCancel={() => setAddClientOpen(false)} isBrandFlow={true} initialData={brand}/>
                                    </DialogContent>
                                </Dialog>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">You haven't added your brand details yet.</p>
                            )}
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            )}

            {workspaceType === 'freelancer' && (
                <AccordionItem value="clients" className="border rounded-lg bg-card">
                    <Card>
                         <AccordionTrigger className="p-6">
                            <div>
                                <CardTitle>Clients</CardTitle>
                                <CardDescription>Manage your clients and their brand assets.</CardDescription>
                            </div>
                             <Dialog open={isAddClientOpen} onOpenChange={setAddClientOpen}>
                                <DialogTrigger asChild>
                                    <Button className="mr-4"><UserPlus className="mr-2" /> Add Client</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Client</DialogTitle>
                                        <DialogDescription>Enter the details for your new client.</DialogDescription>
                                    </DialogHeader>
                                    <AddClientForm onSubmit={handleAddClient} onCancel={() => setAddClientOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
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
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            )}
            
            <AccordionItem value="campaigns" className="border rounded-lg bg-card">
                 <Card>
                    <AccordionTrigger className="p-6">
                        <div>
                            <CardTitle>Campaigns</CardTitle>
                            <CardDescription>Manage your active and upcoming campaigns.</CardDescription>
                        </div>
                        <Dialog open={isAddCampaignOpen} onOpenChange={setAddCampaignOpen}>
                            <DialogTrigger asChild>
                                <Button className="mr-4"><PlusCircle className="mr-2" /> Add Campaign</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Campaign</DialogTitle>
                                    <DialogDescription>Enter the details for your new campaign.</DialogDescription>
                                </DialogHeader>
                                <AddCampaignForm clients={clients} onSubmit={handleAddCampaign} onCancel={() => setAddCampaignOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
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
                    </AccordionContent>
                </Card>
            </AccordionItem>
            
            <AccordionItem value="saved-prompts" className="border rounded-lg bg-card">
                 <Card>
                    <AccordionTrigger className="p-6">
                         <div>
                            <CardTitle>Saved Prompts</CardTitle>
                            <CardDescription>All your saved and favorited prompts.</CardDescription>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
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
                    </AccordionContent>
                </Card>
            </AccordionItem>
            
            <AccordionItem value="brand-palettes" className="border rounded-lg bg-card">
                 <Card>
                    <AccordionTrigger className="p-6">
                        <div>
                            <CardTitle>Brand Palettes</CardTitle>
                            <CardDescription>Your saved color palettes for consistent branding.</CardDescription>
                        </div>
                        <Button className="mr-4">Add New Palette</Button>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
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
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>


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

export default function DashboardPage() {
    return (
        <AppLayout>
            <DashboardContent />
        </AppLayout>
    )
}

    