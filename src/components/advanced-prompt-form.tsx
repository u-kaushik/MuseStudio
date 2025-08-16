
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { WandSparkles, Plus, X, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateBasicPrompt, type GenerateBasicPromptInput } from '@/ai/flows/generate-prompt';
import { ColorPicker } from './color-picker';
import { GeneratingAnimation } from './generating-animation';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { brandPalettes } from '@/app/dashboard/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { MultiChoiceOption } from './multi-choice-option';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


const formSchema = z.object({
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  faceShape: z.string().min(1, "Face shape is required"),
  complexion: z.string().min(1, 'Complexion is required.'),
  bodyShape: z.string().min(1, "Body shape is required"),
  gender: z.string().default('female'),
  style: z.string().min(1, 'Style is required.'),
  mood: z.string().min(1, 'Mood is required.'),
  intensity: z.number().min(0).max(100),
  clothingType: z.string().min(1, "Clothing type is required"),
  brandPalette: z.array(z.string()).min(1, "Please select at least one color"),
  brandGuidelinesFile: z.any().optional(),
  brandGuidelinesText: z.string().optional(),
});

const COMMERCIAL_OBJECTIVES = [
    { value: 'brand-awareness', label: 'Brand Awareness', description: 'Engage and attract a wide audience.' },
    { value: 'product-listing', label: 'Product Listing (PLP)', description: 'Showcase products in a grid.' },
    { value: 'product-detail', label: 'Product Detail (PDP)', description: 'Focus on a single product\'s features.' },
];

const FACE_SHAPES = [
    { value: 'diamond', label: 'Diamond', description: 'Narrow forehead and jawline with wider cheekbones.', image: 'https://placehold.co/600x400.png', hint: 'diamond face woman' },
    { value: 'oval', label: 'Oval', description: 'Balanced proportions, slightly wider at the cheekbones.', image: 'https://placehold.co/600x400.png', hint: 'oval face woman' },
    { value: 'square', label: 'Square', description: 'Strong jawline, broad forehead, and square chin.', image: 'https://placehold.co/600x400.png', hint: 'square face woman' },
    { value: 'heart', label: 'Heart', description: 'Wider forehead that tapers down to a narrow chin.', image: 'https://placehold.co/600x400.png', hint: 'heart face woman' },
]

const BODY_SHAPES = [
    { value: 'hourglass', label: 'Hourglass', description: 'Balanced bust and hips with a defined waist.', image: 'https://placehold.co/600x400.png', hint: 'hourglass figure' },
    { value: 'rectangle', label: 'Rectangle', description: 'Straight silhouette with similar bust, waist, and hip measurements.', image: 'https://placehold.co/600x400.png', hint: 'rectangle body shape' },
    { value: 'pear', label: 'Pear', description: 'Wider hips and thighs with a smaller bust and waist.', image: 'https://placehold.co/600x400.png', hint: 'pear body shape' },
    { value: 'inverted-triangle', label: 'Inverted Triangle', description: 'Broader shoulders and bust that narrow down to the hips.', image: 'https://placehold.co/600x400.png', hint: 'inverted triangle body' },
]

const COMPLEXIONS = [
    { value: 'light-caucasian', label: 'Light', subLabel: 'Caucasian' },
    { value: 'light-east-asian', label: 'Light', subLabel: 'East Asian' },
    { value: 'medium-hispanic', label: 'Medium', subLabel: 'Hispanic/Latino' },
    { value: 'medium-middle-eastern', label: 'Medium', subLabel: 'Middle Eastern' },
    { value: 'dark-african-descent', label: 'Dark', subLabel: 'African Descent' },
    { value: 'dark-south-asian', label: 'Dark', subLabel: 'South Asian' },
];


export function AdvancedPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commercialObjective: '',
      faceShape: '',
      complexion: '',
      bodyShape: '',
      intensity: 50,
      brandPalette: ['#D2B48C', '#FFFFFF', '#000000'],
      brandGuidelinesFile: null,
      brandGuidelinesText: '',
      style: '',
      mood: '',
      clothingType: '',
    },
    mode: 'onTouched'
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
       const mappedValues = {
        ...values,
        ethnicity: values.complexion,
      }
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

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (step === 1) fieldsToValidate = ['commercialObjective'];
    if (step === 2) fieldsToValidate = ['faceShape', 'complexion', 'bodyShape'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);
  
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
              
                {step === 1 && (
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-headline">Step 1: Commercial Objective</CardTitle>
                            <CardDescription>What is the primary goal for these images?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="commercialObjective"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                {COMMERCIAL_OBJECTIVES.map(option => (
                                                    <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <div className="p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full cursor-pointer">
                                                                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                                                <Label htmlFor={option.value} className="font-normal cursor-pointer">
                                                                    <p className="font-bold">{option.label}</p>
                                                                    <p className="text-muted-foreground">{option.description}</p>
                                                                </Label>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}

                {step === 2 && (
                     <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-headline">Step 2: Morphology</CardTitle>
                            <CardDescription>Define the physical characteristics of your model.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <FormField
                                control={form.control}
                                name="faceShape"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Face Shape</FormLabel>
                                        <FormControl>
                                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {FACE_SHAPES.map((shape) => (
                                                    <MultiChoiceOption
                                                        key={shape.value}
                                                        label={shape.label}
                                                        description={shape.description}
                                                        image={shape.image}
                                                        data-ai-hint={shape.hint}
                                                        isSelected={field.value === shape.value}
                                                        onSelect={() => field.onChange(shape.value)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="complexion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complexion</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                            >
                                            {COMPLEXIONS.map((option) => (
                                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <div className="p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full cursor-pointer">
                                                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                                    <Label htmlFor={option.value} className="font-normal cursor-pointer text-center">
                                                        <p className="font-bold">{option.label}</p>
                                                        <p className="text-muted-foreground">{option.subLabel}</p>
                                                    </Label>
                                                    </div>
                                                </FormControl>
                                                </FormItem>
                                            ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="bodyShape"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body Shape</FormLabel>
                                        <FormControl>
                                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {BODY_SHAPES.map((shape) => (
                                                    <MultiChoiceOption
                                                        key={shape.value}
                                                        label={shape.label}
                                                        description={shape.description}
                                                        image={shape.image}
                                                        data-ai-hint={shape.hint}
                                                        isSelected={field.value === shape.value}
                                                        onSelect={() => field.onChange(shape.value)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Uniformity</FormLabel>
                                    <FormDescription>
                                        Master texture, material, and consistency.
                                    </FormDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>This feature is coming soon!</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <FormControl>
                                        <Switch disabled />
                                    </FormControl>
                                </div>
                            </FormItem>
                        </CardContent>
                    </Card>
                )}


              <div className="flex justify-between pt-4">
                  {step > 1 ? (<Button type="button" variant="outline" onClick={prevStep}>Back</Button>) : <div/>}
                  {step < 2 ? (
                      <Button type="button" onClick={nextStep}>Next</Button>
                  ) : (
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
