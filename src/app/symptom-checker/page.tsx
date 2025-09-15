'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Stethoscope, Lightbulb, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import {
  getSymptomAnalysis,
  type SymptomCheckerInput,
} from '@/ai/flows/symptom-checker';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SymptomCheckerSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters."}),
});

export default function SymptomCheckerPage() {
  const [analysis, setAnalysis] = React.useState<{ possibleCauses: string[], recommendedActions: string[] } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SymptomCheckerSchema>>({
    resolver: zodResolver(SymptomCheckerSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof SymptomCheckerSchema>) {
    setIsLoading(true);
    setAnalysis(null);

    const aiInput: SymptomCheckerInput = {
      symptoms: values.symptoms,
    };

    try {
      const result = await getSymptomAnalysis(aiInput);
      setAnalysis(result);
    } catch (error) {
      console.error('Error fetching symptom analysis:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch symptom analysis.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          AI Symptom Checker
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Describe your symptoms to get AI-powered insights. This is not a substitute for professional medical advice.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Stethoscope />
                Describe Your Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Please provide as much detail as possible, including when the symptoms started and their severity.</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., I have a sore throat, a mild fever, and a headache that started 2 days ago..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Analyze Symptoms
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Sparkles />
                        AI Analysis & Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                             <Skeleton className="h-6 w-1/3 mt-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            <Alert variant="destructive" className="bg-accent/20 border-accent text-accent-foreground">
                                <AlertTriangle className="h-4 w-4 text-accent" />
                                <AlertTitle className="text-accent-foreground">Disclaimer</AlertTitle>
                                <AlertDescription>
                                This AI-powered analysis is for informational purposes only and is not a medical diagnosis. Consult a healthcare professional for accurate advice.
                                </AlertDescription>
                            </Alert>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Possible Causes</h3>
                                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                                    {analysis.possibleCauses.map((cause, index) => (
                                        <li key={index}>{cause}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Recommended Actions</h3>
                                 <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                                    {analysis.recommendedActions.map((action, index) => (
                                        <li key={index}>{action}</li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Lightbulb className="mx-auto h-12 w-12" />
                            <p className="mt-4">
                                Your analysis will appear here after you submit your symptoms.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
