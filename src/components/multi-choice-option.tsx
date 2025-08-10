
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface MultiChoiceOptionProps {
  label: string;
  description: string;
  image: string;
  'data-ai-hint'?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function MultiChoiceOption({ label, description, image, 'data-ai-hint': dataAiHint, isSelected, onSelect }: MultiChoiceOptionProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden cursor-pointer group border-2',
        isSelected ? 'border-primary' : 'border-transparent'
      )}
      onClick={onSelect}
    >
      <Image src={image} alt={label} width={600} height={400} className="object-cover w-full h-full" data-ai-hint={dataAiHint} />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="font-bold text-lg">{label}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
       {isSelected && (
        <div className="absolute top-2 right-2 bg-white rounded-full text-primary">
          <CheckCircle className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

