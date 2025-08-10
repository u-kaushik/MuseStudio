import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicPromptForm } from "@/components/basic-prompt-form";
import { AdvancedPromptForm } from "@/components/advanced-prompt-form";
import { SettingsPage } from "@/components/settings-page";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-headline">Muse Studio</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
           <Button variant="outline" size="sm">
              Upgrade
            </Button>
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman portrait" alt="User" />
            <AvatarFallback>MU</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="basic" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="basic">Basic Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="basic" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <BasicPromptForm />
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <AdvancedPromptForm />
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <div className="mx-auto max-w-4xl">
              <SettingsPage />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
