
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from './icons';
import { useAuth } from '@/hooks/use-auth';
import { useClients } from '@/hooks/use-clients';
import { useCampaigns } from '@/hooks/use-campaigns';
import { Home, Settings, FolderKanban, Bot } from 'lucide-react';
import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { clients } = useClients();
  const { campaigns } = useCampaigns();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const workspaceType = typeof window !== 'undefined' ? localStorage.getItem('workspaceType') : 'freelancer';
  const brand = clients.find(c => c.id === 'fashion-brand-details');

  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  const handleCampaignClick = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
        const client = clients.find(c => c.id === campaign.clientId);
        const params = new URLSearchParams();
        params.set('campaign', campaign.name);
        if (client) {
             params.set('client', client.name);
             params.set('commercialObjective', client.commercialObjective);
             params.set('brandPalette', client.defaultBrandPalette);
        }
        router.push(`/?${params.toString()}`);
    }
  }

  const renderCampaigns = (clientId: string) => {
    return campaigns
      .filter(campaign => campaign.clientId === clientId)
      .map(campaign => (
        <SidebarMenuSubItem key={campaign.id}>
          <SidebarMenuSubButton onClick={() => handleCampaignClick(campaign.id)}>
            {campaign.name}
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ));
  };

  const isActive = (path: string) => {
      if (path === '/settings') {
          return searchParams.get('tab') === 'settings';
      }
      return pathname === path && searchParams.get('tab') !== 'settings';
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-accent" />
            <h1 className="text-xl font-headline">Muse Studio</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" isActive={isActive('/dashboard')}>
                <Home />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="/" isActive={isActive('/')}>
                    <Bot />
                    Prompt Wizard
                </SidebarMenuButton>
            </SidebarMenuItem>
            
            {workspaceType === 'fashion-brand' && brand && (
                 <SidebarMenuItem>
                    <SidebarMenuButton>
                        <FolderKanban />
                        {brand.name}
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                       {renderCampaigns(brand.id)}
                    </SidebarMenuSub>
                </SidebarMenuItem>
            )}

            {workspaceType === 'freelancer' && clients.filter(c => c.id !== 'fashion-brand-details').map(client => (
                <SidebarMenuItem key={client.id}>
                    <SidebarMenuButton>
                        <FolderKanban />
                        {client.name}
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                        {renderCampaigns(client.id)}
                    </SidebarMenuSub>
                </SidebarMenuItem>
            ))}


          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/?tab=settings" isActive={isActive('/settings')}>
                        <Settings />
                        Settings
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" />
             <div className="flex items-center gap-4">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
