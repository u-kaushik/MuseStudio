
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/hooks/use-clients';

const formSchema = z.object({
  name: z.string().min(1, 'Campaign name is required.'),
  clientId: z.string().min(1, 'Client is required.'),
  season: z.string().min(1, 'Season is required.'),
  year: z.string().min(1, 'Year is required.'),
});

type AddCampaignFormValues = z.infer<typeof formSchema>;

interface AddCampaignFormProps {
  clients: Client[];
  onSubmit: (data: AddCampaignFormValues) => void;
  onCancel: () => void;
}

const seasons = ['SS', 'FW'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => (currentYear + i).toString());

export function AddCampaignForm({ clients, onSubmit, onCancel }: AddCampaignFormProps) {
  const form = useForm<AddCampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      clientId: '',
      season: '',
      year: currentYear.toString(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer 2025 Collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.filter(c => c.id !== 'fashion-brand-details').map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Season</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {seasons.map((season) => (
                        <SelectItem key={season} value={season}>
                        {season}
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
            name="year"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year}>
                        {year}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">Save Campaign</Button>
        </div>
      </form>
    </Form>
  );
}
