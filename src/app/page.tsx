import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, HeartPulse, Sparkles, UserPlus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <UserPlus className="h-8 w-8 text-primary" />,
    title: 'Easy Registration',
    description: 'Quickly sign up to start tracking your health journey with a personalized dashboard.',
    image: PlaceHolderImages.find(img => img.id === 'feature-data-input'),
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Data Visualization',
    description: 'Visualize your health data with intuitive charts and tables to monitor your progress over time.',
    image: PlaceHolderImages.find(img => img.id === 'feature-visualization'),
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Personalized AI Tips',
    description: 'Receive AI-powered health tips tailored to your specific data, helping you make informed decisions.',
    image: PlaceHolderImages.find(img => img.id === 'feature-ai-tips'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              HealthWise Community
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Track, Monitor, and Improve Community Health.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/awareness">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-10"
                data-ai-hint={heroImage.imageHint}
                priority
            />
        )}
      </section>

      <section id="features" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
              A New Way to View Your Health
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform provides the tools you need to take control of your well-being.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {feature.image && (
                  <div className="aspect-w-3 aspect-h-2">
                     <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                      data-ai-hint={feature.image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
