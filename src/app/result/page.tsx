
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PromptOutput } from '@/components/prompt-output';
import { GeneratingAnimation } from '@/components/generating-animation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Heart, Pen, Check, WandSparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { ImageGallery } from '@/components/image-gallery';
import { Skeleton } from '@/components/ui/skeleton';

function ResultContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const initialTitle = searchParams.get('title');

  const [title, setTitle] = useState(initialTitle || 'Untitled Prompt');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [date, setDate] = useState('');
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Set date only on client-side to avoid hydration mismatch
    setDate(new Date().toLocaleString());
  }, []);

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-lg text-muted-foreground">No prompt was generated.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    toast({ title: 'Success', description: 'Prompt saved successfully!' });
  };
  
  const handleFavorite = () => {
    toast({ title: 'Success', description: 'Prompt added to favorites!' });
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateImage({ prompt });
      setImages([{ src: result.imageDataUri, alt: title }]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <>
      <Progress value={100} className="w-full mb-6" />
        <CardHeader>
          <div className="flex items-start justify-between">
              <div className="flex-1">
                   {isEditingTitle ? (
                      <div className="flex items-center gap-2">
                          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-headline" />
                          <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(false)}><Check/></Button>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2">
                          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(true)}><Pen/></Button>
                      </div>
                   )}
                  <p className="text-sm text-muted-foreground mt-1">{date}</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleSave}><Bookmark className="mr-2"/> Save</Button>
                  <Button variant="outline" onClick={handleFavorite}><Heart className="mr-2"/> Favorite</Button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-headline mb-2">Your Generated Prompt</h3>
                  <PromptOutput prompt={prompt} />
                  <Button onClick={handleGenerateImage} disabled={isGenerating} className="mt-4">
                    <WandSparkles className="mr-2"/>
                    {isGenerating ? 'Generating...' : 'Generate Image'}
                  </Button>
                </div>
                <div>
                   <h3 className="text-lg font-headline mb-2">Generated Image</h3>
                   {isGenerating && (
                     <div className="flex flex-col space-y-3">
                       <Skeleton className="h-[400px] w-full rounded-xl" />
                       <div className="space-y-2">
                         <Skeleton className="h-4 w-[250px]" />
                         <Skeleton className="h-4 w-[200px]" />
                       </div>
                     </div>
                   )}
                   {!isGenerating && images.length === 0 && (
                      <div className="flex flex-col items-center justify-center bg-muted rounded-lg h-[400px]">
                        <p className="text-muted-foreground">Click "Generate Image" to see the result</p>
                      </div>
                   )}
                   {images.length > 0 && <ImageGallery images={images} />}
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2" /> Create Another Prompt
            </Link>
          </Button>
        </CardFooter>
    </>
  );
}

function ResultPageComponent() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
        router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-6xl">
          <Card>
            <Suspense fallback={<GeneratingAnimation />}>
              <ResultContent />
            </Suspense>
          </Card>
        </div>
    );
}

export default function ResultPage() {
    return (
        <AppLayout>
            <ResultPageComponent />
        </AppLayout>
    )
}
