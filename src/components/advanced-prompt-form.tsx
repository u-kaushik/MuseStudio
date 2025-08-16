
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { WandSparkles, Info, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateBasicPrompt, type GenerateBasicPromptInput } from '@/ai/flows/generate-prompt';
import { ColorPicker } from './color-picker';
import { GeneratingAnimation } from './generating-animation';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { MultiChoiceOption } from './multi-choice-option';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { brandPalettes } from '@/app/dashboard/page';
import { Slider } from './ui/slider';


const formSchema = z.object({
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  faceShape: z.string().min(1, "Face shape is required"),
  complexion: z.string().min(1, 'Complexion is required.'),
  bodyShape: z.string().min(1, "Body shape is required"),
  gender: z.string().default('female'),
  clothingType: z.string().optional(),
  style: z.string().min(1, 'Style is required.'),
  mood: z.string().min(1, 'Mood is required.'),
  lighting: z.string().min(1, 'Lighting is required.'),
  intensity: z.number().min(0).max(100),
  brandPalette: z.string().optional(),
  brandGuidelinesFile: z.any().optional(),
  brandGuidelinesText: z.string().optional(),
  dominantColor: z.string().min(1, 'Dominant color is required.'),
});

const COMMERCIAL_OBJECTIVES = [
    { value: 'brand-awareness', label: 'Brand Awareness', description: 'Engage and attract a wide audience.' },
    { value: 'product-listing', label: 'Product Listing (PLP)', description: 'Showcase products in a grid.' },
    { value: 'product-detail', label: 'Product Detail (PDP)', description: 'Focus on a single product\'s features.' },
];

const FACE_SHAPES = [
    { value: 'diamond', label: 'Diamond', description: 'Narrow forehead and jawline with wider cheekbones.' },
    { value: 'oval', label: 'Oval', description: 'Balanced proportions, slightly wider at the cheekbones.' },
    { value: 'square', label: 'Square', description: 'Strong jawline, broad forehead, and square chin.' },
    { value: 'heart', label: 'Heart', description: 'Wider forehead that tapers down to a narrow chin.' },
]

const BODY_SHAPES = [
    { value: 'hourglass', label: 'Hourglass', description: 'Balanced bust and hips with a defined waist.' },
    { value: 'rectangle', label: 'Rectangle', description: 'Straight silhouette with similar bust, waist, and hip measurements.' },
    { value: 'pear', label: 'Pear', description: 'Wider hips and thighs with a smaller bust and waist.' },
    { value: 'inverted-triangle', label: 'Inverted Triangle', description: 'Broader shoulders and bust that narrow down to the hips.' },
]

const COMPLEXIONS = [
    { value: 'light-caucasian', label: 'Light', subLabel: 'Caucasian' },
    { value: 'light-east-asian', label: 'Light', subLabel: 'East Asian' },
    { value: 'medium-hispanic', label: 'Medium', subLabel: 'Hispanic/Latino' },
    { value: 'medium-middle-eastern', label: 'Medium', subLabel: 'Middle Eastern' },
    { value: 'dark-african-descent', label: 'Dark', subLabel: 'African Descent' },
    { value: 'dark-south-asian', label: 'Dark', subLabel: 'South Asian' },
];

const STYLE_CATEGORIES = [
    { value: 'basics', label: 'Basics' },
    { value: 'formal', label: 'Formal' },
    { value: 'athleisure', label: 'Athleisure' },
    { value: 'outerwear', label: 'Outerwear' },
]

const MOODS = [
    { value: 'bright-airy', label: 'Bright & Airy', description: 'Light, open, and cheerful.' },
    { value: 'neutral-studio', label: 'Neutral Studio', description: 'Clean, professional, and focused.' },
    { value: 'moody-contrast', label: 'Moody Contrast', description: 'Dramatic, emotional, and intense.' },
];

const LIGHTING_LABELS: {[key: number]: string} = {
  0: 'Soft',
  50: 'Neutral',
  100: 'Hard'
};


const FormLabelBlack = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-black", className)}
      {...props}
    />
  )
})
FormLabelBlack.displayName = "FormLabelBlack"


export function AdvancedPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [lightingValue, setLightingValue] = useState(50);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commercialObjective: '',
      faceShape: '',
      complexion: '',
      bodyShape: '',
      style: '',
      mood: '',
      intensity: 50,
      brandPalette: 'none',
      brandGuidelinesFile: null,
      brandGuidelinesText: '',
      dominantColor: '#CDB385',
      lighting: 'Neutral',
    },
    mode: 'onTouched'
  });
  
  const watchBrandPalette = form.watch('brandPalette');
  const watchFaceShape = form.watch('faceShape');
  const watchComplexion = form.watch('complexion');
  const watchBodyShape = form.watch('bodyShape');
  const selectedPalette = brandPalettes.find(p => p.name === watchBrandPalette);

  useEffect(() => {
    if (selectedPalette) {
      form.setValue('dominantColor', selectedPalette.colors[0]);
    }
  }, [watchBrandPalette, selectedPalette, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
       const mappedValues = {
        ...values,
        ethnicity: values.complexion,
        brandPalette: typeof values.brandPalette === 'string' ? [values.brandPalette] : [],
        lighting: values.lighting,
      }
      if (typeof values.brandPalette === 'string' && values.brandPalette.length > 0 && values.brandPalette !== 'none') {
        const paletteName = values.brandPalette;
        const selectedPalette = brandPalettes.find(p => p.name === paletteName);
        if (selectedPalette) {
            mappedValues.brandPalette = selectedPalette.colors;
        } else {
            mappedValues.brandPalette = [];
        }
      } else if (values.dominantColor) {
        mappedValues.brandPalette = [values.dominantColor];
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
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[];
    switch (step) {
        case 1:
            fieldsToValidate = ['commercialObjective'];
            break;
        case 2:
            fieldsToValidate = ['faceShape', 'complexion', 'bodyShape'];
            break;
        case 3:
            fieldsToValidate = ['style', 'dominantColor'];
            break;
        default:
            fieldsToValidate = [];
            break;
    }

    if (fieldsToValidate.length > 0) {
        const isValid = await form.trigger(fieldsToValidate);
        if (!isValid) return;
    }

    if (step < 4) {
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
          <CardTitle className="font-headline text-4xl">Advanced Mode</CardTitle>
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
                                                   <div key={option.value}>
                                                        <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                                                        <Label
                                                            htmlFor={option.value}
                                                            className={cn(
                                                                'relative flex flex-col rounded-lg border-2 p-4 cursor-pointer',
                                                                'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent'
                                                            )}
                                                            >
                                                            {field.value === option.value && (
                                                                <div className="absolute top-2 right-2 bg-background rounded-full text-primary">
                                                                    <CheckCircle className="h-6 w-6" />
                                                                </div>
                                                            )}
                                                            <span className="font-bold">{option.label}</span>
                                                            <span className="text-muted-foreground">{option.description}</span>
                                                        </Label>
                                                    </div>
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
                                        <FormLabelBlack className="text-base font-semibold">Face Shape</FormLabelBlack>
                                        <FormControl>
                                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {FACE_SHAPES.map((shape) => (
                                                    <MultiChoiceOption
                                                        key={shape.value}
                                                        label={shape.label}
                                                        description={shape.description}
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
                            {watchFaceShape && (
                                <FormField
                                    control={form.control}
                                    name="complexion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabelBlack className="text-base font-semibold">Complexion</FormLabelBlack>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                                >
                                                    {COMPLEXIONS.map((option) => (
                                                        <div key={option.value}>
                                                            <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                                                            <Label
                                                                htmlFor={option.value}
                                                                className={cn(
                                                                    'relative flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer',
                                                                    'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent'
                                                                )}
                                                            >
                                                                {field.value === option.value && (
                                                                    <div className="absolute top-2 right-2 bg-background rounded-full text-primary">
                                                                        <CheckCircle className="h-6 w-6" />
                                                                    </div>
                                                                )}
                                                                <span className="font-bold">{option.label}</span>
                                                                <span className="text-muted-foreground">{option.subLabel}</span>
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {watchComplexion && (
                                <FormField
                                    control={form.control}
                                    name="bodyShape"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabelBlack className="text-base font-semibold">Body Shape</FormLabelBlack>
                                            <FormControl>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {BODY_SHAPES.map((shape) => (
                                                        <MultiChoiceOption
                                                            key={shape.value}
                                                            label={shape.label}
                                                            description={shape.description}
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
                            )}
                            {watchBodyShape && (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Uniformity</Label>
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
                            )}
                        </CardContent>
                    </Card>
                )}

                {step === 3 && (
                     <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-headline">Step 3: Style</CardTitle>
                            <CardDescription>Define the artistic direction of your visuals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <FormField
                                control={form.control}
                                name="style"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabelBlack className="text-base font-semibold">Style Category</FormLabelBlack>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                            >
                                                {STYLE_CATEGORIES.map(option => (
                                                    <FormItem key={option.value} className="flex-grow">
                                                        <FormControl>
                                                             <div 
                                                                className="relative"
                                                            >
                                                                <RadioGroupItem value={option.value} id={option.value} className="sr-only peer" />
                                                                <Label 
                                                                    htmlFor={option.value} 
                                                                    className={cn(
                                                                        'rounded-lg p-4 cursor-pointer group border-2 bg-card text-center block',
                                                                        'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent'
                                                                    )}
                                                                >
                                                                    {field.value === option.value && (
                                                                        <div className="absolute top-2 right-2 bg-background rounded-full text-primary">
                                                                            <CheckCircle className="h-6 w-6" />
                                                                        </div>
                                                                    )}
                                                                    <p className="font-bold">{option.label}</p>
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
                                name="brandPalette"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabelBlack className="text-base font-semibold">Brand Palette</FormLabelBlack>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand palette" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {brandPalettes.map((palette) => (
                                                <SelectItem key={palette.name} value={palette.name}>
                                                    <div className="flex items-center gap-2">
                                                        {palette.colors.map(color => <div key={color} className="h-4 w-4 rounded-full border" style={{backgroundColor: color}} />)}
                                                        <span>{palette.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a saved brand palette. This will influence the dominant color.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dominantColor"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabelBlack className="text-base font-semibold">Dominant Clothing/Prop Color</FormLabelBlack>
                                    <FormControl>
                                        {selectedPalette ? (
                                             <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a dominant color" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectedPalette.colors.map((color) => (
                                                        <SelectItem key={color} value={color}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-4 w-4 rounded-full border" style={{backgroundColor: color}} />
                                                                <span>{color}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <ColorPicker
                                                background={field.value!}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}

                {step === 4 && (
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-headline">Step 4: Mood & Lighting</CardTitle>
                            <CardDescription>Define the atmosphere and lighting of your visuals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <FormField
                                control={form.control}
                                name="mood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabelBlack className="text-base font-semibold">Mood</FormLabelBlack>
                                        <FormControl>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {MOODS.map((mood) => (
                                                    <MultiChoiceOption
                                                        key={mood.value}
                                                        label={mood.label}
                                                        description={mood.description}
                                                        isSelected={field.value === mood.value}
                                                        onSelect={() => field.onChange(mood.value)}
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
                                name="lighting"
                                render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-2">
                                         <FormLabelBlack className="text-base font-semibold">Light Tone</FormLabelBlack>
                                         <span className="text-sm text-muted-foreground">{lightingValue in LIGHTING_LABELS ? LIGHTING_LABELS[lightingValue] : 'Neutral'}</span>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            defaultValue={[lightingValue]}
                                            max={100}
                                            step={50}
                                            onValueChange={(value) => {
                                                const singleValue = value[0];
                                                setLightingValue(singleValue);
                                                field.onChange(LIGHTING_LABELS[singleValue] || 'Neutral');
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className='mt-2'>
                                        <p><span className='font-bold'>Soft:</span> Diffused, even light with subtle shadows, creating a gentle and flattering look.</p>
                                        <p><span className='font-bold'>Neutral:</span> Balanced lighting that mimics natural daylight, providing a clear and realistic feel.</p>
                                        <p><span className='font-bold'>Hard:</span> Creates sharp, well-defined shadows and highlights, adding drama and contrast.</p>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}


              <div className="flex justify-between pt-4">
                  {step > 1 ? (<Button type="button" variant="outline" onClick={prevStep}>Back</Button>) : <div/>}
                  {step < 4 ? (
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

    