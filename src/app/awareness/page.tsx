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
  {
    title: 'Hydration for Health',
    description: 'Discover why water is essential for your body and get tips on how to stay properly hydrated throughout the day.',
    imageId: 'awareness-hydration',
  },
  {
    title: 'Decoding Food Labels',
    description: 'Learn how to read and understand food labels to make healthier choices at the grocery store.',
    imageId: 'awareness-labels',
  }
];

const videoTopics = [
    {
        title: "Understanding Vaccines",
        description: "An animated explainer on how vaccines work to protect you and your community.",
        videoId: "o_XVt5rdpFY",
    },
    {
        title: "5-Minute Mindfulness Meditation",
        description: "A guided meditation session to help you reduce stress and find your center.",
        videoId: "inpok4MKVLM",
    },
    {
        title: "Healthy Cooking for Beginners",
        description: "Learn to cook a simple, nutritious, and delicious meal in under 15 minutes.",
        videoId: "fJb_O_5Xv8o",
    },
    {
        title: "The Benefits of a Morning Walk",
        description: "Explore the physical and mental health benefits of starting your day with a walk.",
        videoId: "y_p_0_ML-sQ",
    }
]

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

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topicsWithImages.map((topic) => (
           <div key={topic.title} className="flip-card rounded-lg overflow-hidden h-[300px]">
            <div className="flip-card-inner relative w-full h-full text-center">
              <div className="flip-card-front w-full h-full">
                 <Card className="flex flex-col h-full shadow-lg">
                    {topic.image && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={topic.image.imageUrl}
                          alt={topic.image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={topic.image.imageHint}
                        />
                      </div>
                    )}
                    <CardHeader className="flex-grow">
                      <CardTitle className="font-headline">{topic.title}</CardTitle>
                    </CardHeader>
                  </Card>
              </div>
              <div className="flip-card-back w-full h-full absolute top-0 left-0">
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

      <div className="mt-24">
         <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
                Health in Motion
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Watch and learn with these short, informative videos.
            </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videoTopics.map((video) => (
                <Card key={video.title} className="overflow-hidden shadow-lg card-glow">
                    <div className="aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{video.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
