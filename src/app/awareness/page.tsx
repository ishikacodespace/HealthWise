import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const awarenessTopics = [
  {
    title: 'Balanced Diet Essentials',
    description: 'Learn how to build a balanced plate with the right mix of nutrients to fuel your body and mind. Discover the importance of whole foods and mindful eating.',
    imageId: 'awareness-diet',
  },
  {
    title: 'The Power of Daily Exercise',
    description: 'Even 30 minutes of moderate activity per day can significantly improve your cardiovascular health, boost your mood, and increase your energy levels.',
    imageId: 'awareness-exercise',
  },
  {
    title: 'Nurturing Your Mental Health',
    description: 'Explore techniques for managing stress, practicing mindfulness, and knowing when to seek professional help. Your mental well-being is a priority.',
    imageId: 'awareness-mental-health',
  },
  {
    title: 'The Importance of Quality Sleep',
    description: 'Understand the sleep cycle and discover tips for improving your sleep hygiene. Quality sleep is crucial for physical recovery and cognitive function.',
    imageId: 'awareness-sleep',
  },
];

export default function AwarenessPage() {
  const topicsWithImages = awarenessTopics.map(topic => {
    const image = PlaceHolderImages.find(img => img.id === topic.imageId);
    return { ...topic, image };
  });

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Community Health Feed
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore tips, articles, and helpful content to improve your well-being.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topicsWithImages.map((topic) => (
           <div key={topic.title} className="flip-card rounded-lg overflow-hidden">
            <div className="flip-card-inner relative w-full h-full text-center">
              <div className="flip-card-front w-full h-full">
                 <Card className="flex flex-col h-full shadow-lg">
                    {topic.image && (
                      <div className="relative aspect-w-16 aspect-h-9 w-full">
                        <Image
                          src={topic.image.imageUrl}
                          alt={topic.image.description}
                          width={600}
                          height={400}
                          className="object-cover w-full h-full"
                          data-ai-hint={topic.image.imageHint}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline">{topic.title}</CardTitle>
                    </CardHeader>
                  </Card>
              </div>
              <div className="flip-card-back w-full h-full">
                <Card className="flex flex-col h-full bg-secondary shadow-lg">
                  <CardContent className="flex-grow flex items-center justify-center p-6">
                    <CardDescription className="text-secondary-foreground">{topic.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
