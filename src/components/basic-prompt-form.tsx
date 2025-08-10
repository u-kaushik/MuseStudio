
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { WandSparkles, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateBasicPrompt, type GenerateBasicPromptInput } from '@/ai/flows/generate-prompt';
import { MultiChoiceOption } from './multi-choice-option';
import { Progress } from '@/components/ui/progress';
import { ColorPicker } from './color-picker';
import { GeneratingAnimation } from './generating-animation';

const formSchema = z.object({
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  ethnicity: z.string().min(1, 'Ethnicity is required.'),
  clothingType: z.string().min(1, 'Clothing type is required.'),
  brandPalette: z.array(z.string()).min(3, 'At least three colors are required.'),
});

const COMMERCIAL_OBJECTIVES = [
    { value: 'brand-awareness', label: 'Brand Awareness', image: 'https://placehold.co/600x400.png', hint: 'brand campaign' },
    { value: 'product-listing', label: 'Product Listing (PLP)', image: 'https://placehold.co/600x400.png', hint: 'product grid' },
    { value: 'product-detail', label: 'Product Detail (PDP)', image: 'https://placehold.co/600x400.png', hint: 'product details' },
];

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

const CLOTHING_TYPES = [
    { value: 'streetwear', label: 'Streetwear', image: 'https://placehold.co/600x400.png', hint: 'streetwear fashion' },
    { value: 'formal', label: 'Formal Wear', image: 'https://placehold.co/600x400.png', hint: 'formal fashion' },
    { value: 'casual', label: 'Casual Wear', image: 'https://placehold.co/600x400.png', hint: 'casual fashion' },
    { value: 'sportswear', label: 'Sportswear', image: 'https://placehold.co/600x400.png', hint: 'sportswear fashion' },
    { value: 'evening-gown', label: 'Evening Gown', image: 'https://placehold.co/600x400.png', hint: 'evening gown' },
    { value: 'business-suit', label: 'Business Suit', image: 'https://placehold.co/600x400.png', hint: 'business suit' },
];

const formSteps = [
  { name: 'commercialObjective', type: 'multi-choice', label: 'Commercial Objective', options: COMMERCIAL_OBJECTIVES },
  { name: 'gender', type: 'multi-choice', label: 'Model Gender', options: GENDERS },
  { name: 'ethnicity', type: 'multi-choice', label: 'Model Ethnicity', options: ETHNICITIES },
  { name: 'clothingType', type: 'multi-choice', label: 'Clothing Type', options: CLOTHING_TYPES },
  { name: 'brandPalette', type: 'color-picker', label: 'Brand Palette' },
] as const;


export function BasicPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commercialObjective: '',
      gender: '',
      ethnicity: '',
      clothingType: '',
      brandPalette: ['#8B4513', '#A0522D', '#D2B48C'],
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'brandPalette',
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
    try {
      const result = await generateBasicPrompt(values as GenerateBasicPromptInput);
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

  const isLastStep = currentStep === formSteps.length - 1;

  const colorLabels = ['Primary', 'Secondary', 'Tertiary', 'Accent 1', 'Accent 2'];

  return (
    <div className="space-y-6">
       <Progress value={progress} className="w-full" />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Advanced Mode</CardTitle>
          <CardDescription>Generate a prompt with a few simple selections. ({currentStep + 1} / {formSteps.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="min-h-[350px]">
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
                    {step.type === 'color-picker' && (
                        <FormItem>
                            <FormLabel>{step.label}</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="flex flex-row gap-2">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="relative flex-1">
                                            <Label className="text-xs text-muted-foreground">{colorLabels[index]}</Label>
                                            <Controller
                                                control={form.control}
                                                name={`brandPalette.${index}`}
                                                render={({ field: colorField }) => (
                                                    <ColorPicker
                                                        background={colorField.value}
                                                        onChange={colorField.onChange}
                                                    />
                                                )}
                                            />
                                             {index >= 3 && (
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => remove(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    </div>
                                    {fields.length < 5 && (
                                        <Button type="button" variant="outline" onClick={() => append('#000000')}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Accent Color
                                        </Button>
                                    )}
                                </div>
                            </FormControl>
                             <FormMessage />
                        </FormItem>
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
    </div>
  );
}
