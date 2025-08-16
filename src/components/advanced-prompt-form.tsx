
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { WandSparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateAdvancedPrompt, type GenerateAdvancedPromptInput } from '@/ai/flows/generate-advanced-prompt';
import { GeneratingAnimation } from './generating-animation';

const formSchema = z.object({
  morphology: z.string().min(1, 'Morphology is required.'),
  uniformity: z.string().min(1, 'Uniformity is required.'),
  style: z.string().min(1, 'Style is required.'),
  essence: z.string().min(1, 'Essence is required.'),
  photography: z.string().min(1, 'Photography settings are required.'),
  lighting: z.string().min(1, 'Lighting settings are required.'),
});

export function AdvancedPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      morphology: '',
      uniformity: '',
      style: '',
      essence: '',
      photography: '',
      lighting: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generateAdvancedPrompt(values as GenerateAdvancedPromptInput);
      const params = new URLSearchParams();
      params.set('prompt', result.prompt);
      params.set('title', result.title);
      router.push(`/result?${params.toString()}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate prompt. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <GeneratingAnimation />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Advanced Mode</CardTitle>
          <CardDescription>Use the multi-step wizard to craft a detailed prompt for your campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="morphology"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Morphology</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Slender female model, sharp jawline, high cheekbones..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uniformity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uniformity</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Flowing silk dress, vibrant red color, intricate gold embroidery..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Haute couture, avant-garde, inspired by baroque art..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="essence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Essence</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Confident and powerful mood, a sense of drama and luxury..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photography"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photography</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Full-body shot, 85mm lens, f/1.8, shallow depth of field..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lighting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lighting</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Dramatic studio lighting, single key light, deep shadows..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    {isLoading ? 'Generating...' : 'Generate Prompt'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
