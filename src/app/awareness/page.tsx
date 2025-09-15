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
    image: PlaceHolderImages.find(img => img.id === 'awareness-diet'),
  },
  {
    title: 'The Power of Daily Exercise',
    description: 'Even 30 minutes of moderate activity per day can significantly improve your cardiovascular health, boost your mood, and increase your energy levels.',
    image: PlaceHolderImages.find(img => img.id === 'awareness-exercise'),
  },
  {
    title: 'Nurturing Your Mental Health',
    description: 'Explore techniques for managing stress, practicing mindfulness, and knowing when to seek professional help. Your mental well-being is a priority.',
    image: PlaceHolderImages.find(img => img.id === 'awareness-mental-health'),
  },
  {
    title: 'The Importance of Quality Sleep',
    description: 'Understand the sleep cycle and discover tips for improving your sleep hygiene. Quality sleep is crucial for physical recovery and cognitive function.',
    image: PlaceHolderImages.find(img => img.id === 'awareness-sleep'),
  },
];

export default function AwarenessPage() {
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
        {awarenessTopics.map((topic) => (
          <Card key={topic.title} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-rotate-1 card-glow">
            {topic.image && (
              <div className="aspect-w-16 aspect-h-9">
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
            <CardContent className="flex-grow">
              <CardDescription>{topic.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
