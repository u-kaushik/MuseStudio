
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { brandPalettes } from '@/app/brand-board/page';

const commercialObjectives = [
  'Brand Awareness',
  'Product Listing (PLP)',
  'Product Detail (PDP)',
  'Other (free text)',
];

const formSchema = z.object({
  name: z.string().min(1, 'Client name is required.'),
  defaultBrandPalette: z.string().min(1, 'Brand palette is required.'),
  commercialObjective: z.string().min(1, 'Commercial objective is required.'),
  commercialObjectiveFreeText: z.string().optional(),
  defaultMorphology: z.string().optional(),
});

type AddClientFormValues = z.infer<typeof formSchema>;

interface AddClientFormProps {
  onSubmit: (data: Omit<AddClientFormValues, 'commercialObjectiveFreeText'> & { commercialObjective: string }) => void;
  onCancel: () => void;
}

export function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const form = useForm<AddClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      defaultBrandPalette: '',
      commercialObjective: '',
      commercialObjectiveFreeText: '',
      defaultMorphology: '',
    },
  });

  const watchCommercialObjective = form.watch('commercialObjective');

  const handleSubmit = (values: AddClientFormValues) => {
    const finalObjective =
      values.commercialObjective === 'Other (free text)'
        ? values.commercialObjectiveFreeText || ''
        : values.commercialObjective;

    onSubmit({
      name: values.name,
      defaultBrandPalette: values.defaultBrandPalette,
      commercialObjective: finalObjective,
      defaultMorphology: values.defaultMorphology,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Nova Fashion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultBrandPalette"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Brand Palette</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a palette" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brandPalettes.map((palette) => (
                    <SelectItem key={palette.name} value={palette.name}>
                      {palette.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commercialObjective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commercial Objective</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commercialObjectives.map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchCommercialObjective === 'Other (free text)' && (
          <FormField
            control={form.control}
            name="commercialObjectiveFreeText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Please specify the objective" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="defaultMorphology"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Morphology (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the default morphology..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">Save Client</Button>
        </div>
      </form>
    </Form>
  );
}
