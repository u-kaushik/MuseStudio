
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { WandSparkles, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateBasicPrompt, type GenerateBasicPromptInput } from '@/ai/flows/generate-prompt';
import { MultiChoiceOption } from './multi-choice-option';
import { Progress } from '@/components/ui/progress';
import { ColorPicker } from './color-picker';
import { GeneratingAnimation } from './generating-animation';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  gender: z.string().default('female'), // Defaulting as step is removed
  style: z.string().min(1, 'Style is required.'),
  mood: z.string().min(1, 'Mood is required.'),
  complexion: z.string().min(1, 'Complexion is required.'),
  intensity: z.number().min(0).max(100),
  clothingType: z.string().default('streetwear'), // Defaulting as step is removed
  brandPalette: z.array(z.string()).min(1, "Please select at least one color"),
  brandGuidelinesFile: z.any().optional(),
  brandGuidelinesText: z.string().optional(),
});

const COMMERCIAL_OBJECTIVES = [
    { value: 'brand-awareness', label: 'Brand Awareness', description: 'Engage and attract a wide audience.', image: 'https://placehold.co/600x400.png', hint: 'brand campaign' },
    { value: 'product-listing', label: 'Product Listing (PLP)', description: 'Showcase products in a grid.', image: 'https://placehold.co/600x400.png', hint: 'product grid' },
    { value: 'product-detail', label: 'Product Detail (PDP)', description: 'Focus on a single product\'s features.', image: 'https://placehold.co/600x400.png', hint: 'product details' },
];

const STYLES = [
    { value: 'classic-elegance', label: 'Classic Elegance', description: 'Timeless luxury with soft silhouettes.', image: 'https://placehold.co/600x400.png', hint: 'classic fashion' },
    { value: 'modern-minimal', label: 'Modern Minimal', description: 'Clean lines and understated design.', image: 'https://placehold.co/600x400.png', hint: 'minimalist fashion' },
    { value: 'dramatic-glamour', label: 'Dramatic Glamour', description: 'Bold editorial looks with striking shapes.', image: 'https://placehold.co/600x400.png', hint: 'glamorous fashion' },
];

const MOODS = [
    { value: 'mystery-curiosity', label: 'Mystery & Curiosity', description: 'Create intrigue and spark curiosity.', image: 'https://placehold.co/600x400.png', hint: 'mysterious mood', compatibleStyles: ['classic-elegance', 'modern-minimal', 'dramatic-glamour'] },
    { value: 'energy-excitement', label: 'Energy & Excitement', description: 'Ignite energy and excitement.', image: 'https://placehold.co/600x400.png', hint: 'energetic mood', compatibleStyles: ['dramatic-glamour'] },
    { value: 'trust-sophistication', label: 'Trust & Sophistication', description: 'Project trust, calm and sophistication.', image: 'https://placehold.co/600x400.png', hint: 'sophisticated mood', compatibleStyles: ['classic-elegance', 'modern-minimal'] },
];

const COMPLEXIONS = [
    { value: 'light-complexion', label: 'Light Complexion', description: 'Fair skin, blonde hair, blue eyes.', image: 'https://placehold.co/600x400.png', hint: 'light complexion' },
    { value: 'medium-complexion', label: 'Medium Complexion', description: 'Tan or olive skin, brown hair, green eyes.', image: 'https://placehold.co/600x400.png', hint: 'medium complexion' },
    { value: 'dark-complexion', label: 'Dark Complexion', description: 'Deep skin, black hair, brown eyes.', image: 'https://placehold.co/600x400.png', hint: 'dark complexion' },
];

const formSteps = [
  { name: 'commercialObjective', type: 'multi-choice', title: 'Step 1: Select Your Commercial Objective', description: 'Choose the primary goal for your visual content.', options: COMMERCIAL_OBJECTIVES },
  { name: 'brandPalette', type: 'color-picker', title: 'Step 2: Input your brand palette', description: 'Select up to five colours that represent your brand, upload a brand guideline PDF or describe your brand vibe in text. These selections shape the mood and tone of your AI model.' },
  { name: 'style', type: 'multi-choice', title: 'Step 3: Define your brand style and mood', description: 'Select the style, mood and model complexion that best represent your brand.', options: STYLES, subCategory: 'Style' },
  { name: 'mood', type: 'multi-choice', title: 'Step 3: Define your brand style and mood', description: 'Select the style, mood and model complexion that best represent your brand.', options: MOODS, subCategory: 'Mood' },
  { name: 'complexion', type: 'multi-choice', title: 'Step 3: Define your brand style and mood', description: 'Select the style, mood and model complexion that best represent your brand.', options: COMPLEXIONS, subCategory: 'Complexion' },
  { name: 'intensity', type: 'slider', title: 'Step 3: Define your brand style and mood', description: 'Select the style, mood and model complexion that best represent your brand.', subCategory: 'Intensity' },
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
      gender: 'female',
      style: '',
      mood: '',
      complexion: '',
      intensity: 50,
      clothingType: 'streetwear',
      brandPalette: ['#D2B48C', '#FFFFFF', '#000000'],
      brandGuidelinesFile: null,
      brandGuidelinesText: '',
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'brandPalette',
  });

  const progress = useMemo(() => {
    // Group steps by title to calculate progress
    const uniqueSteps = formSteps.reduce((acc, step) => {
        if (!acc.some(s => s.title === step.title)) {
            acc.push(step);
        }
        return acc;
    }, [] as typeof formSteps);
    
    const currentTitle = formSteps[currentStep].title;
    const currentUniqueStepIndex = uniqueSteps.findIndex(s => s.title === currentTitle);
    
    return ((currentUniqueStepIndex + 1) / uniqueSteps.length) * 100;
  }, [currentStep]);


  const selectedStyle = form.watch('style');

  const availableMoods = useMemo(() => {
    if (!selectedStyle) return MOODS;
    const filtered = MOODS.filter(mood => mood.compatibleStyles.includes(selectedStyle));
    if (!filtered.some(mood => mood.value === form.getValues('mood'))) {
        form.setValue('mood', '', { shouldValidate: true });
    }
    return filtered;
  }, [selectedStyle, form]);

  async function handleNext() {
    const currentStepInfo = formSteps.find((_, index) => {
      const title = formSteps[index].title;
      const currentTitle = formSteps[currentStep].title;
      return title === currentTitle;
    });
  
    if (!currentStepInfo) return;
  
    const stepsWithSameTitle = formSteps.filter(step => step.title === currentStepInfo.title);
    const fieldNamesToValidate = stepsWithSameTitle.map(step => step.name);
  
    // @ts-ignore
    const isValid = await form.trigger(fieldNamesToValidate);
    if (isValid) {
      const lastIndexOfCurrentTitle = formSteps.map(s => s.title).lastIndexOf(currentStepInfo.title);
      setCurrentStep(lastIndexOfCurrentTitle + 1);
    }
  }

  function handleBack() {
    const currentTitle = formSteps[currentStep].title;
    const firstIndexOfCurrentTitle = formSteps.findIndex(s => s.title === currentTitle);
    
    if (firstIndexOfCurrentTitle > 0) {
      const prevStepTitle = formSteps[firstIndexOfCurrentTitle - 1].title;
      const firstIndexOfPrevStepTitle = formSteps.findIndex(s => s.title === prevStepTitle);
      setCurrentStep(firstIndexOfPrevStepTitle);
    } else {
        setCurrentStep(0);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // The generateBasicPrompt expects ethnicity, so we map complexion to it.
      const mappedValues = {
        ...values,
        ethnicity: values.complexion,
      }
      // @ts-ignore
      const result = await generateBasicPrompt(mappedValues as GenerateBasicPromptInput);
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

  const uniqueStepTitles = formSteps.reduce((acc, step) => {
    if (!acc.includes(step.title)) {
        acc.push(step.title);
    }
    return acc;
  }, [] as string[]);
  
  const isLastStep = uniqueStepTitles.indexOf(formSteps[currentStep].title) === uniqueStepTitles.length - 1;

  const colorLabels = ['Primary Colour', 'Secondary Colour', 'Tertiary Colour', 'Accent Colour 1', 'Accent Colour 2'];

  const currentFormStep = formSteps[currentStep];

  const groupedSteps: { [key: string]: (typeof formSteps[number])[] } = formSteps.reduce((acc, step) => {
    if (!acc[step.title]) {
        acc[step.title] = [];
    }
    acc[step.title].push(step);
    return acc;
  }, {});

  const currentTitle = formSteps[currentStep].title;
  const currentUniqueStepIndex = uniqueStepTitles.indexOf(currentTitle);
  const totalUniqueSteps = uniqueStepTitles.length;


  return (
    <div className="space-y-6">
       <Progress value={progress} className="w-full" />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{currentFormStep.title} ({currentUniqueStepIndex + 1} / {totalUniqueSteps})</CardTitle>
          <CardDescription>{currentFormStep.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="min-h-[350px]">
                {Object.entries(groupedSteps).map(([title, steps]) => {
                    const isActive = currentFormStep.title === title;
                    return (
                        <div key={title} className={isActive ? 'block' : 'hidden'}>
                            <div className="space-y-8">
                            {steps.map(step => (
                                <div key={step.name}>
                                    {step.type === 'multi-choice' && (
                                        <Controller
                                            control={form.control}
                                            name={step.name as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {step.subCategory && <FormLabel>{step.subCategory}</FormLabel>}
                                                    <FormControl>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            {(step.name === 'mood' ? availableMoods : (step.options || [])).map((option) => (
                                                                <MultiChoiceOption
                                                                    key={option.value}
                                                                    label={option.label}
                                                                    description={option.description}
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
                                     {step.type === 'slider' && (
                                         <Controller
                                            control={form.control}
                                            name={step.name as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex justify-between items-center">
                                                        {step.subCategory && <FormLabel>{step.subCategory}</FormLabel>}
                                                        <span className="text-sm text-muted-foreground">{field.value}</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            defaultValue={[field.value]}
                                                            onValueChange={(value) => field.onChange(value[0])}
                                                            max={100}
                                                            step={1}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This determines how closely the result adheres to the prompt. Higher values are more pronounced.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                             {currentFormStep.type === 'color-picker' && (
                                <div className="space-y-8">
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {fields.map((field, index) => (
                                                    <div key={field.id} className="relative flex-1">
                                                        <Label className="text-xs text-muted-foreground">{colorLabels[index]}</Label>

                                                        <div className="flex items-center gap-2">
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
                                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        {fields.length < 5 && (
                                            <Button type="button" variant="outline" onClick={() => append('#000000')}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Accent Color
                                            </Button>
                                        )}
                                        <FormMessage />
                                    </FormItem>

                                    <FormField
                                        control={form.control}
                                        name="brandGuidelinesFile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Upload Brand Guidelines (PDF)</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="brandGuidelinesText"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand guidelines (optional text)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Elegant, bold, sophisticated." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                  Need inspiration? Try phrases like:
                                                  <ul className="list-disc pl-5 mt-1">
                                                    <li>"Timeless luxury with a contemporary edge"</li>
                                                    <li>"Bold streetwear infused with youthful energy"</li>
                                                    <li>"Elegant minimalism grounded in nature"</li>
                                                  </ul>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                              )}
                            </div>
                        </div>
                    )
                })}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentUniqueStepIndex === 0}>
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

    
