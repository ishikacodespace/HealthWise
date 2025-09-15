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
  Droplets,
  Zap,
  Award,
  TrendingUp,
  Quote,
  BadgeCent
} from 'lucide-react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart,
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
import {
    getBpStatus,
    getTempStatus,
    getBmiStatus,
    calculateBmi,
    getHealthScore,
    wellnessQuotes,
    type BpStatus,
    type TempStatus,
    type BmiStatus,
} from '@/lib/health-utils';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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

const getStatusColor = (status: BpStatus | TempStatus | BmiStatus) => {
    switch (status) {
        case 'Normal': return 'text-green-500';
        case 'Elevated':
        case 'Low':
        case 'Overweight':
        case 'Underweight':
            return 'text-yellow-500';
        case 'High':
        case 'Hypertensive Crisis':
        case 'Obese':
            return 'text-red-500';
        default: return 'text-muted-foreground';
    }
}

export default function DashboardPage() {
  const [healthData, setHealthData] = React.useState<HealthEntry[]>([]);
  const [personalizedTips, setPersonalizedTips] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [quote, setQuote] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    // Pick a random quote on component mount
    setQuote(wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)]);
    // Load data from localStorage
    const savedData = localStorage.getItem('healthData');
    if (savedData) {
      setHealthData(JSON.parse(savedData));
    }
  }, []);

  const form = useForm<z.infer<typeof HealthDataSchema>>({
    resolver: zodResolver(HealthDataSchema),
    defaultValues: {
      bloodPressure: '120/80',
      heartRate: '70',
      bodyTemperature: '98.6',
      bloodSugar: '90',
      height: '175',
      weight: '70',
      bmi: String(calculateBmi(175, 70)),
    },
  });

  const watchHeight = form.watch('height');
  const watchWeight = form.watch('weight');

  React.useEffect(() => {
    const height = parseFloat(watchHeight);
    const weight = parseFloat(watchWeight);
    if (height > 0 && weight > 0) {
      const bmi = calculateBmi(height, weight);
      form.setValue('bmi', String(bmi));
    }
  }, [watchHeight, watchWeight, form]);

  async function onSubmit(values: z.infer<typeof HealthDataSchema>) {
    setIsLoading(true);
    setPersonalizedTips([]);

    const bmi = calculateBmi(Number(values.height), Number(values.weight));

    const newEntry: HealthEntry = {
      id: Date.now(),
      bloodPressure: values.bloodPressure,
      heartRate: Number(values.heartRate),
      bodyTemperature: Number(values.bodyTemperature),
      bloodSugar: Number(values.bloodSugar),
      height: Number(values.height),
      weight: Number(values.weight),
      bmi: bmi,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    const updatedHealthData = [...healthData, newEntry];
    setHealthData(updatedHealthData);
    localStorage.setItem('healthData', JSON.stringify(updatedHealthData));


    if (updatedHealthData.length > 0 && updatedHealthData.length % 3 === 0) {
      toast({
        title: 'Way to go! 🎉',
        description: `You've logged your health ${updatedHealthData.length} times. Keep up the great work!`,
      });
    }

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

  const latestEntry = healthData.length > 0 ? healthData[healthData.length - 1] : null;
  const bpStatus = latestEntry ? getBpStatus(latestEntry.bloodPressure) : null;
  const tempStatus = latestEntry ? getTempStatus(latestEntry.bodyTemperature) : null;
  const bmiStatus = latestEntry ? getBmiStatus(latestEntry.bmi) : null;
  const healthScore = latestEntry && bpStatus && bmiStatus ? getHealthScore(bpStatus, bmiStatus, latestEntry.heartRate) : null;


  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Your Health Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter your latest health metrics to track your progress and get personalized insights.
        </p>
      </div>
      
       {quote && (
        <Card className="mb-8 bg-accent/20 border-accent/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Quote className="h-6 w-6 text-accent" />
              <p className="text-accent-foreground italic">"{quote}"</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className={cn("border-l-4", bpStatus === "Normal" ? "border-green-500": bpStatus === "Elevated" ? "border-yellow-500" : "border-red-500")}>
            <CardHeader>
                <CardTitle className='flex items-center justify-between text-lg'>
                    Blood Pressure
                    <Stethoscope className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{latestEntry?.bloodPressure || 'N/A'}</p>
                <p className={cn("text-sm font-medium", getStatusColor(bpStatus || 'Invalid'))}>{bpStatus}</p>
            </CardContent>
        </Card>
        <Card className={cn("border-l-4", tempStatus === "Normal" ? "border-green-500": "border-yellow-500")}>
            <CardHeader>
                <CardTitle className='flex items-center justify-between text-lg'>
                    Temperature
                     <Thermometer className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{latestEntry?.bodyTemperature ? `${latestEntry.bodyTemperature}°F` : 'N/A'}</p>
                <p className={cn("text-sm font-medium", getStatusColor(tempStatus || 'Normal'))}>{tempStatus}</p>
            </CardContent>
        </Card>
        <Card className={cn("border-l-4", bmiStatus === "Normal" ? "border-green-500": (bmiStatus === 'Overweight' || bmiStatus === 'Underweight') ? "border-yellow-500" : "border-red-500")}>
            <CardHeader>
                <CardTitle className='flex items-center justify-between text-lg'>
                    BMI
                    <Scaling className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{latestEntry?.bmi || 'N/A'}</p>
                <p className={cn("text-sm font-medium", getStatusColor(bmiStatus || 'Normal'))}>{bmiStatus}</p>
            </CardContent>
        </Card>
        <Card className={cn("border-l-4", latestEntry && latestEntry.heartRate > 60 && latestEntry.heartRate < 100 ? "border-green-500" : "border-yellow-500")}>
            <CardHeader>
                <CardTitle className='flex items-center justify-between text-lg'>
                    Heart Rate
                    <HeartPulse className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{latestEntry?.heartRate || 'N/A'} <span className='text-sm text-muted-foreground'>BPM</span></p>
                <p className="text-sm font-medium text-muted-foreground">Resting</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Zap />
                Log Your Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm"><Stethoscope className="mr-2 h-4 w-4" />Blood Pressure</FormLabel>
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
                        <FormLabel className="flex items-center text-sm"><HeartPulse className="mr-2 h-4 w-4" />Heart Rate (BPM)</FormLabel>
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
                        <FormLabel className="flex items-center text-sm"><Thermometer className="mr-2 h-4 w-4" />Body Temperature (°F)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 98.6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodSugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm"><Droplets className="mr-2 h-4 w-4" />Blood Sugar (mg/dL)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 90" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm"><Scaling className="mr-2 h-4 w-4" />Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 175" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm"><Scaling className="mr-2 h-4 w-4" />Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name="bmi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm"><BadgeCent className="mr-2 h-4 w-4" />Calculated BMI</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" disabled {...field} />
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
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Award />
                        Your Health Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {healthScore !== null ? (
                        <div>
                            <div className='flex items-baseline gap-2'>
                                <p className="text-4xl font-bold text-primary">{healthScore}</p>
                                <p className='text-xl text-muted-foreground'>/ 100</p>
                            </div>
                            <Progress value={healthScore} className="mt-2 h-2" />
                            <p className="text-sm text-muted-foreground mt-2">
                               {healthScore > 85 ? "Excellent! Keep up the great work." : healthScore > 70 ? "Good job! A few small changes can make a big difference." : "Let's work on improving your numbers. Small steps lead to big results."}
                            </p>
                        </div>
                    ) : (
                         <p className="text-muted-foreground text-center py-4">
                            Log your vitals to calculate your health score.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Lightbulb />
                        AI Personalized Health Tips
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

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><TrendingUp/>Health Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    {healthData.length > 0 ? (
                        <Tabs defaultValue="chart">
                             <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="chart"><AreaChart className="mr-2 h-4 w-4" />Chart</TabsTrigger>
                                <TabsTrigger value="table"><List className="mr-2 h-4 w-4" />Table</TabsTrigger>
                            </TabsList>
                             <TabsContent value="chart" className="pt-4">
                                <p className="text-sm text-muted-foreground mb-4">Heart Rate (blue) and BMI (orange) over time.</p>
                                <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                                    <RechartsAreaChart data={healthData} margin={{ left: -20, right: 12 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                        <YAxis yAxisId="left" hide />
                                        <YAxis yAxisId="right" orientation="right" hide />
                                        <Tooltip content={<ChartTooltipContent indicator='dot'/>} />
                                        <Area yAxisId="left" dataKey="heartRate" type="monotone" fill="var(--color-heartRate)" fillOpacity={0.4} stroke="var(--color-heartRate)" name="Heart Rate" />
                                        <Area yAxisId="right" dataKey="bmi" type="monotone" fill="var(--color-bmi)" fillOpacity={0.4} stroke="var(--color-bmi)" name="BMI"/>
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
                                            <TableHead>Sugar</TableHead>
                                            <TableHead>BMI</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {healthData.slice().reverse().map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell>{entry.date}</TableCell>
                                                <TableCell>{entry.bloodPressure}</TableCell>
                                                <TableCell>{entry.heartRate}</TableCell>
                                                <TableCell>{entry.bloodSugar}</TableCell>
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
