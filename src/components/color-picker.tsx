'use client';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';

interface ColorPickerProps {
  background: string;
  onChange: (background: string) => void;
  className?: string;
}

export function ColorPicker({ background, onChange, className }: ColorPickerProps) {
  const solids = [
    '#E2E2E2',
    '#ff7575',
    '#6366F1',
    '#8BC34A',
    '#FBBF24',
    '#9333EA',
    '#F472B6',
    '#14B8A6',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              />
            ) : (
              <div className="h-4 w-4 rounded !bg-center !bg-cover transition-all" />
            )}
            <div className="flex-1 truncate">{background}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mt-0 flex flex-wrap gap-1">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
              onClick={() => onChange(s)}
            />
          ))}
        </div>

        <Input
          id="custom"
          value={background}
          className="col-span-2 mt-4 h-8"
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
