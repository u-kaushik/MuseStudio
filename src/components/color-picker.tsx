'use client';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SketchPicker, type ColorResult } from 'react-color';

interface ColorPickerProps {
  background: string;
  onChange: (background: string) => void;
  className?: string;
}

export function ColorPicker({ background, onChange, className }: ColorPickerProps) {
  const handleColorChange = (color: ColorResult) => {
    onChange(color.hex);
  };

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
            <div
              className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
              style={{ background }}
            />
            <div className="flex-1 truncate">{background}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0">
        <SketchPicker
          color={background}
          onChangeComplete={handleColorChange}
        />
      </PopoverContent>
    </Popover>
  );
}
