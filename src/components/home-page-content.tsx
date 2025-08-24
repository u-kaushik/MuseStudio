
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicPromptForm } from "@/components/basic-prompt-form";
import { AdvancedPromptForm } from "@/components/advanced-prompt-form";
import { SettingsPage } from "@/components/settings-page";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Lock } from "lucide-react";

function getInitialTab(tabParam: string | null) {
  if (tabParam === 'guided') {
    return tabParam;
  }
  return 'auto';
}

function HomePageContentComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('auto');

  useEffect(() => {
    const tab = searchParams.get('tab');
    setActiveTab(getInitialTab(tab));
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/?tab=${value}`, { scroll: false });
  }

  const tabFromParams = searchParams.get('tab');
  if (tabFromParams === 'settings') {
    return (
        <div className="mx-auto max-w-4xl">
            <SettingsPage />
        </div>
    )
  }

  return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2">
              <TabsTrigger value="auto">
                Auto Mode
              </TabsTrigger>
              <TabsTrigger value="guided">Guided Mode</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="auto" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <BasicPromptForm />
            </div>
          </TabsContent>
          <TabsContent value="guided" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <AdvancedPromptForm />
            </div>
          </TabsContent>
        </Tabs>
  );
}

export function HomePageContent() {
  return (
    <Suspense>
      <HomePageContentComponent />
    </Suspense>
  )
}
