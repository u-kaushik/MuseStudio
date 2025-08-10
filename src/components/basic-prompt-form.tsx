'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WandSparkles, ArrowLeft, ArrowRight } from 'lucide-react';

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

const formSteps = [
  { name: 'gender', type: 'multi-choice', label: 'Model Gender', options: GENDERS },
  { name: 'ethnicity', type: 'multi-choice', label: 'Model Ethnicity', options: ETHNICITIES },
  { name: 'clothingType', type: 'input', label: 'Clothing Type', placeholder: 'e.g., Silk evening gown' },
  { name: 'brandPalette', type: 'input', label: 'Brand Palette', placeholder: 'e.g., Earthy tones, pastels' },
] as const;


export function BasicPromptForm() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

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

  const progress = useMemo(() => {
    return ((currentStep + 1) / formSteps.length) * 100;
  }, [currentStep]);

  async function handleNext() {
    const fieldName = formSteps[currentStep].name;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setCurrentStep((prev) => prev - 1);
  }

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
  
  const isLastStep = currentStep === formSteps.length - 1;

  return (
    <div className="space-y-6">
       <Progress value={progress} className="w-full" />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Basic Mode</CardTitle>
          <CardDescription>Generate a prompt with a few simple selections. ({currentStep + 1} / {formSteps.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="min-h-[250px]">
                {formSteps.map((step, index) => (
                  <div key={step.name} className={currentStep === index ? 'block' : 'hidden'}>
                    {step.type === 'multi-choice' && (
                       <Controller
                          control={form.control}
                          name={step.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{step.label}</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(step.options || []).map((option) => (
                                        <MultiChoiceOption
                                            key={option.value}
                                            label={option.label}
                                            image={option.image}
                                            data-ai-hint={option.hint}
                                            isSelected={field.value === option.value}
                                            onSelect={() => field.onChange(option.value)}
                                        />
                                    ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )}
                    {step.type === 'input' && (
                       <FormField
                          control={form.control}
                          name={step.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{step.label}</FormLabel>
                              <FormControl>
                                <Input placeholder={step.placeholder} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {!isLastStep && (
                  <Button type="button" onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {isLastStep && (
                  <Button type="submit" disabled={isLoading}>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    {isLoading ? 'Generating...' : 'Generate Prompt'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <PromptOutput isLoading={isLoading} prompt={generatedPrompt} />
    </div>
  );
}
