
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface MultiChoiceOptionProps {
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function MultiChoiceOption({ label, description, isSelected, onSelect }: MultiChoiceOptionProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg p-4 cursor-pointer group border-2 bg-card',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-background rounded-full text-primary">
          <CheckCircle className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-bold text-lg mb-1">{label}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
