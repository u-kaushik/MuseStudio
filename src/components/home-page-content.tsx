
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyzeImageForm } from "@/components/analyze-image-form";
import { BasicPromptForm } from "@/components/basic-prompt-form";
import { SettingsPage } from "@/components/settings-page";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Lock } from "lucide-react";

function getInitialTab(tabParam: string | null) {
  if (tabParam === 'settings' || tabParam === 'advanced') {
    return tabParam;
  }
  return 'basic';
}

function HomePageContentComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('basic');

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

  return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="basic">
                Basic Mode
              </TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="basic" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <AnalyzeImageForm />
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <BasicPromptForm />
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <SettingsPage />
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
