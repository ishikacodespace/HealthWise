'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  HeartPulse,
  Thermometer,
  Scaling,
  Stethoscope,
  Lightbulb,
  Loader2,
  List,
  AreaChart,
} from 'lucide-react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getPersonalizedHealthTips,
  type PersonalizedHealthTipsInput,
} from '@/ai/flows/personalized-health-tips';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthDataSchema, type HealthEntry } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const chartConfig = {
  heartRate: {
    label: 'Heart Rate (BPM)',
    color: 'hsl(var(--chart-1))',
  },
  bmi: {
    label: 'BMI',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [healthData, setHealthData] = React.useState<HealthEntry[]>([]);
  const [personalizedTips, setPersonalizedTips] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof HealthDataSchema>>({
    resolver: zodResolver(HealthDataSchema),
    defaultValues: {
      bloodPressure: '120/80',
      heartRate: '70',
      bodyTemperature: '98.6',
      bmi: '22',
    },
  });

  async function onSubmit(values: z.infer<typeof HealthDataSchema>) {
    setIsLoading(true);
    setPersonalizedTips([]);

    const newEntry: HealthEntry = {
      id: Date.now(),
      bloodPressure: values.bloodPressure,
      heartRate: Number(values.heartRate),
      bodyTemperature: Number(values.bodyTemperature),
      bmi: Number(values.bmi),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    setHealthData((prev) => [...prev, newEntry]);

    const aiInput: PersonalizedHealthTipsInput = {
      bloodPressure: newEntry.bloodPressure,
      heartRate: newEntry.heartRate,
      bodyTemperature: newEntry.bodyTemperature,
      bmi: newEntry.bmi,
    };

    try {
      const result = await getPersonalizedHealthTips(aiInput);
      setPersonalizedTips(result.healthTips);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch personalized health tips.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Your Health Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter your latest health metrics to track your progress and get personalized insights.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <HeartPulse />
                Log Your Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Stethoscope className="mr-2 h-4 w-4" />Blood Pressure</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 120/80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><HeartPulse className="mr-2 h-4 w-4" />Heart Rate (BPM)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bodyTemperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Thermometer className="mr-2 h-4 w-4" />Body Temperature (°F)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 98.6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bmi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Scaling className="mr-2 h-4 w-4" />Body Mass Index (BMI)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 22.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Analyze & Log Data
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Lightbulb />
                        Your Personalized Health Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ) : personalizedTips.length > 0 ? (
                        <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                            {personalizedTips.map((tip, index) => (
                                <li key={index} className="transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            Submit your vitals to get personalized, AI-powered health tips.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Health Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    {healthData.length > 0 ? (
                        <Tabs defaultValue="chart">
                             <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="chart"><AreaChart className="mr-2 h-4 w-4" />Chart</TabsTrigger>
                                <TabsTrigger value="table"><List className="mr-2 h-4 w-4" />Table</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chart" className="pt-4">
                                <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                                    <RechartsAreaChart data={healthData} margin={{ left: 12, right: 12 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis yAxisId="left" hide />
                                        <YAxis yAxisId="right" orientation="right" hide />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Area yAxisId="left" dataKey="heartRate" type="monotone" fill="var(--color-heartRate)" fillOpacity={0.4} stroke="var(--color-heartRate)" />
                                        <Area yAxisId="right" dataKey="bmi" type="monotone" fill="var(--color-bmi)" fillOpacity={0.4} stroke="var(--color-bmi)" />
                                    </RechartsAreaChart>
                                </ChartContainer>
                            </TabsContent>
                             <TabsContent value="table">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>BP</TableHead>
                                            <TableHead>Heart Rate</TableHead>
                                            <TableHead>Temp (°F)</TableHead>
                                            <TableHead>BMI</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {healthData.slice().reverse().map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.bloodPressure}</TableCell>
                                                <TableCell>{entry.heartRate}</TableCell>
                                                <TableCell>{entry.bodyTemperature}</TableCell>
                                                <TableCell>{entry.bmi}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    ) : (
                         <p className="text-muted-foreground text-center py-8">
                            Your health data log is empty. Submit your vitals to start tracking.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
