'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WandSparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateBasicPrompt, type GenerateBasicPromptInput } from '@/ai/flows/generate-prompt';
import { PromptOutput } from './prompt-output';
import { MultiChoiceOption } from './multi-choice-option';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  gender: z.string().min(1, 'Gender is required.'),
  ethnicity: z.string().min(1, 'Ethnicity is required.'),
  clothingType: z.string().min(1, 'Clothing type is required.'),
  brandPalette: z.string().min(1, 'Brand palette is required.'),
});

const GENDERS = [
  { value: 'female', label: 'Female', image: 'https://placehold.co/600x400.png', hint: 'female fashion' },
  { value: 'male', label: 'Male', image: 'https://placehold.co/600x400.png', hint: 'male fashion' },
  { value: 'non-binary', label: 'Non-binary', image: 'https://placehold.co/600x400.png', hint: 'androgynous fashion' },
];

const ETHNICITIES = [
    { value: 'asian', label: 'Asian', image: 'https://placehold.co/600x400.png', hint: 'asian fashion' },
    { value: 'black', label: 'Black', image: 'https://placehold.co/600x400.png', hint: 'black fashion' },
    { value: 'caucasian', label: 'Caucasian', image: 'https://placehold.co/600x400.png', hint: 'caucasian fashion' },
    { value: 'hispanic', label: 'Hispanic', image: 'https://placehold.co/600x400.png', hint: 'hispanic fashion' },
    { value: 'middle-eastern', label: 'Middle Eastern', image: 'https://placehold.co/600x400.png', hint: 'middle eastern fashion' },
    { value: 'multiracial', label: 'Multiracial', image: 'https://placehold.co/600x400.png', hint: 'multiracial fashion' },
]

export function BasicPromptForm() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: '',
      ethnicity: '',
      clothingType: '',
      brandPalette: '',
    },
    mode: 'onChange'
  });

  const formValues = form.watch();

  const progress = useMemo(() => {
    const totalFields = 4;
    const filledFields = Object.values(formValues).filter(value => value && value.length > 0).length;
    return (filledFields / totalFields) * 100;
  }, [formValues]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPrompt(null);
    try {
      const result = await generateBasicPrompt(values as GenerateBasicPromptInput);
      setGeneratedPrompt(result.prompt);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
       <Progress value={progress} className="w-full" />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Basic Mode</CardTitle>
          <CardDescription>Generate a prompt with a few simple selections.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Gender</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {GENDERS.map((gender) => (
                                <MultiChoiceOption
                                    key={gender.value}
                                    label={gender.label}
                                    image={gender.image}
                                    data-ai-hint={gender.hint}
                                    isSelected={field.value === gender.value}
                                    onSelect={() => field.onChange(gender.value)}
                                />
                            ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={form.control}
                  name="ethnicity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Ethnicity</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {ETHNICITIES.map((ethnicity) => (
                                <MultiChoiceOption
                                    key={ethnicity.value}
                                    label={ethnicity.label}
                                    image={ethnicity.image}
                                    data-ai-hint={ethnicity.hint}
                                    isSelected={field.value === ethnicity.value}
                                    onSelect={() => field.onChange(ethnicity.value)}
                                />
                            ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="clothingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clothing Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Silk evening gown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brandPalette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Palette</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Earthy tones, pastels" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <WandSparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Prompt'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <PromptOutput isLoading={isLoading} prompt={generatedPrompt} />
    </div>
  );
}
