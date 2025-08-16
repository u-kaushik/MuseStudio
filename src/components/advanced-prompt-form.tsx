
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { WandSparkles, Plus, X } from 'lucide-react';

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

const formSchema = z.object({
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  gender: z.string().default('female'),
  style: z.string().min(1, 'Style is required.'),
  mood: z.string().min(1, 'Mood is required.'),
  complexion: z.string().min(1, 'Complexion is required.'),
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

const STYLES = [
    { value: 'classic-elegance', label: 'Classic Elegance' },
    { value: 'modern-minimal', label: 'Modern Minimal' },
    { value: 'dramatic-glamour', label: 'Dramatic Glamour' },
];

const MOODS = [
    { value: 'mystery-curiosity', label: 'Mystery & Curiosity' },
    { value: 'energy-excitement', label: 'Energy & Excitement' },
    { value: 'trust-sophistication', label: 'Trust & Sophistication' },
];

const COMPLEXIONS = [
    { value: 'light-complexion', label: 'Light' },
    { value: 'medium-complexion', label: 'Medium' },
    { value: 'dark-complexion', label: 'Dark' },
];

const GENDERS = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'non-binary', label: 'Non-binary' },
];

const CLOTHING_TYPES = [
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'haute-couture', label: 'Haute Couture' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'athleisure', label: 'Athleisure' },
]

export function AdvancedPromptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commercialObjective: '',
      gender: 'female',
      style: '',
      mood: '',
      complexion: '',
      intensity: 50,
      clothingType: '',
      brandPalette: ['#D2B48C', '#FFFFFF', '#000000'],
      brandGuidelinesFile: null,
      brandGuidelinesText: '',
    },
    mode: 'onChange'
  });

  useEffect(() => {
    const objective = searchParams.get('commercialObjective');
    const paletteName = searchParams.get('brandPalette');

    if (objective) {
      const foundObjective = COMMERCIAL_OBJECTIVES.find(o => o.label === objective);
      if (foundObjective) {
        form.setValue('commercialObjective', foundObjective.value);
      }
    }
    if (paletteName) {
      const palette = brandPalettes.find(p => p.name === paletteName);
      if (palette) {
        form.setValue('brandPalette', palette.colors.slice(0, 5));
      }
    }
  }, [searchParams, form]);

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'brandPalette',
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

  const handlePaletteSelect = (paletteName: string) => {
    const selectedPalette = brandPalettes.find(p => p.name === paletteName);
    if (selectedPalette) {
      replace(selectedPalette.colors.slice(0, 5).map(color => color));
    }
  };
  
  if (isLoading) {
    return <GeneratingAnimation />;
  }
  
  const colorLabels = ['Primary Colour', 'Secondary Colour', 'Tertiary Colour', 'Accent Colour 1', 'Accent Colour 2'];

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
                <Accordion type="multiple" defaultValue={['objective', 'brand', 'model', 'creative']} className="w-full">
                    <AccordionItem value="objective">
                        <AccordionTrigger className="text-lg font-headline">Commercial Objective</AccordionTrigger>
                        <AccordionContent className="pt-4">
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
                                                            <div className="p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary w-full">
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
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="brand">
                        <AccordionTrigger className="text-lg font-headline">Brand Identity</AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6">
                             <FormItem>
                                <FormLabel>Choose a pre-saved palette (optional)</FormLabel>
                                <Select onValueChange={handlePaletteSelect}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a saved palette" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brandPalettes.map((palette) => (
                                        <SelectItem key={palette.name} value={palette.name}>
                                            <div className="flex items-center gap-2">
                                            {palette.colors.map(color => <div key={color} className="h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />)}
                                            <span>{palette.name}</span>
                                            </div>
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>

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
                                    <Button type="button" variant="outline" onClick={() => append('#000000')} className="mt-2">
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
                                        <FormLabel>Brand Vibe (optional text)</FormLabel>
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
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="model">
                        <AccordionTrigger className="text-lg font-headline">Model & Clothing</AccordionTrigger>
                        <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                           <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {GENDERS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a complexion" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {COMPLEXIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clothingType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clothing Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select clothing type"/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {CLOTHING_TYPES.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="creative">
                        <AccordionTrigger className="text-lg font-headline">Creative Direction</AccordionTrigger>
                        <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="style"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Style</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a style"/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {STYLES.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="mood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mood</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a mood"/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {MOODS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Controller
                                control={form.control}
                                name="intensity"
                                render={({ field }) => (
                                    <FormItem className="col-span-full">
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Intensity</FormLabel>
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
                                          The higher the intensity, the stronger the nature of the adjectives.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

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
