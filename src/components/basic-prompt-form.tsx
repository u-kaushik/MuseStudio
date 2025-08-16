
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WandSparkles, Upload } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeImageForPrompt, type AnalyzeImageInput } from '@/ai/flows/analyze-image-flow';
import { GeneratingAnimation } from './generating-animation';

const formSchema = z.object({
  image: z.any().refine((files) => files?.length === 1, 'Image is required.'),
});

export function BasicPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const file = values.image[0];
      const imageDataUri = await toBase64(file);
      const result = await analyzeImageForPrompt({ imageDataUri });

      const params = new URLSearchParams();
      params.set('prompt', result.prompt);
      params.set('title', result.title);
      router.push(`/result?${params.toString()}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze image. Please try again.',
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
          <CardTitle className="font-headline">Basic Mode</CardTitle>
          <CardDescription>Upload an image to automatically generate a prompt based on the MUSE framework.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspiration Image</FormLabel>
                    <FormControl>
                        <div 
                            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/80"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {preview ? (
                                <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={!preview || isLoading}>
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Analyzing...' : 'Generate Prompt'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
