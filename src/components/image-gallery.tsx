'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from './ui/button';
import { Download, Share2 } from 'lucide-react';

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <Carousel className="w-full max-w-2xl mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                  <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" className="rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
        <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline"><Download className="mr-2" /> Download</Button>
            <Button variant="outline"><Share2 className="mr-2" /> Share</Button>
        </div>
    </Carousel>
  );
}
