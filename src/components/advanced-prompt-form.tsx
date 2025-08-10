
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WandSparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateAdvancedPrompt, type GenerateAdvancedPromptInput } from '@/ai/flows/generate-advanced-prompt';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  morphology: z.string().min(1, 'Morphology details are required.'),
  uniformity: z.string().min(1, 'Uniformity details are required.'),
  style: z.string().min(1, 'Style details are required.'),
  essence: z.string().min(1, 'Essence details are required.'),
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Basic Mode</CardTitle>
          <CardDescription>Craft a detailed prompt using the MUSE framework and technical settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion type="multiple" defaultValue={['muse', 'technical']} className="w-full">
                <AccordionItem value="muse">
                  <AccordionTrigger className="text-lg font-headline">MUSE Framework</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <FormField control={form.control} name="morphology" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morphology</FormLabel>
                        <FormControl><Textarea placeholder="Describe the subject's form, shape, and structure..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="uniformity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uniformity</FormLabel>
                        <FormControl><Textarea placeholder="Describe the texture, material, and consistency..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="style" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <FormControl><Textarea placeholder="Describe the artistic style, era, and aesthetic..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="essence" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Essence</FormLabel>
                        <FormControl><Textarea placeholder="Describe the mood, feeling, and core concept..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="technical">
                  <AccordionTrigger className="text-lg font-headline">Technical Details</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <FormField control={form.control} name="photography" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photography</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Shot on 70mm, f/2.8, shallow depth of field, full body shot..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="lighting" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lighting</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Volumetric lighting, cinematic, golden hour, soft shadows..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button type="submit" disabled={isLoading} className="mt-8">
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Prompt'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
