import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, BarChart3, TrendingUp, Users, DollarSign, Heart, Zap } from 'lucide-react';

const MetricsPage = () => {
  const [selectedMetricCategory, setSelectedMetricCategory] = useState('acquisition');
  const [metricsChecklist, setMetricsChecklist] = useState(new Set());

  const toggleMetricChecklist = (metricId) => {
    const newChecklist = new Set(metricsChecklist);
    if (newChecklist.has(metricId)) {
      newChecklist.delete(metricId);
    } else {
      newChecklist.add(metricId);
    }
    setMetricsChecklist(newChecklist);
  };

  const metricsFramework = [
    {
      id: 'acquisition',
      name: 'Acquisition',
      description: 'How users discover and first engage with your product',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-500',
      metrics: [
        {
          id: 'cac',
          name: 'Customer Acquisition Cost (CAC)',
          description: 'The cost to acquire one paying customer',
          formula: 'Total Marketing Spend ÷ Number of New Customers',
          importance: 'Critical for understanding marketing efficiency and unit economics',
          benchmark: 'Varies by industry, should be 3x less than LTV',
          example: '$500 CAC means you spend $500 to acquire each customer'
        },
        {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          description: 'Percentage of visitors who complete desired action',
          formula: '(Conversions ÷ Total Visitors) × 100',
          importance: 'Measures effectiveness of user experience and value proposition',
          benchmark: '2-5% for e-commerce, 10-15% for SaaS trials',
          example: '3% conversion rate means 3 out of 100 visitors convert'
        },
        {
          id: 'traffic-sources',
          name: 'Traffic Source Performance',
          description: 'Quality and volume of users from different channels',
          formula: 'Segment users by acquisition channel',
          importance: 'Identifies most effective marketing channels',
          benchmark: 'Diversified mix, no single channel >50% of traffic',
          example: 'Organic search: 40%, Paid ads: 30%, Social: 20%, Referral: 10%'
        }
      ]
    },
    {
      id: 'engagement',
      name: 'Engagement',
      description: 'How actively users interact with your product',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-rose-500',
      metrics: [
        {
          id: 'dau-mau',
          name: 'DAU/MAU Ratio',
          description: 'Daily active users divided by monthly active users',
          formula: 'DAU ÷ MAU',
          importance: 'Indicates stickiness and habit formation',
          benchmark: '>20% is good, >50% is excellent',
          example: '30% DAU/MAU means users visit 9 days per month on average'
        },
        {
          id: 'session-duration',
          name: 'Average Session Duration',
          description: 'How long users spend in your product per session',
          formula: 'Total Session Time ÷ Number of Sessions',
          importance: 'Shows depth of engagement and value extraction',
          benchmark: 'Varies by product type, longer isn\'t always better',
          example: '5 minutes average for productivity app, 30 minutes for social'
        },
        {
          id: 'feature-adoption',
          name: 'Feature Adoption Rate',
          description: 'Percentage of users who try new features',
          formula: '(Users Using Feature ÷ Total Active Users) × 100',
          importance: 'Measures product development success',
          benchmark: '>30% adoption within 30 days is strong',
          example: '25% of users adopted the new dashboard feature'
        }
      ]
    },
    {
      id: 'retention',
      name: 'Retention',
      description: 'How well you keep users coming back over time',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-emerald-500',
      metrics: [
        {
          id: 'cohort-retention',
          name: 'Cohort Retention',
          description: 'Percentage of users who return after initial period',
          formula: 'Track user cohorts over time (Day 1, 7, 30, 90)',
          importance: 'Most important metric for long-term success',
          benchmark: 'Day 1: >40%, Day 7: >20%, Day 30: >10%',
          example: '60% Day 1, 35% Day 7, 20% Day 30 retention'
        },
        {
          id: 'churn-rate',
          name: 'Churn Rate',
          description: 'Percentage of customers who stop using product',
          formula: '(Customers Lost ÷ Total Customers) × 100',
          importance: 'Inverse of retention, critical for growth',
          benchmark: '<5% monthly churn for SaaS, <2% for consumer apps',
          example: '3% monthly churn means 97% of customers stay each month'
        },
        {
          id: 'nps',
          name: 'Net Promoter Score (NPS)',
          description: 'Likelihood of users to recommend your product',
          formula: '% Promoters (9-10) - % Detractors (0-6)',
          importance: 'Predicts organic growth and customer satisfaction',
          benchmark: '>50 is excellent, >70 is world-class',
          example: 'NPS of 45: 60% promoters, 15% detractors'
        }
      ]
    },
    {
      id: 'revenue',
      name: 'Revenue',
      description: 'Financial performance and business sustainability',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-amber-500',
      metrics: [
        {
          id: 'ltv',
          name: 'Lifetime Value (LTV)',
          description: 'Total revenue expected from a customer',
          formula: 'Average Revenue Per User × Customer Lifespan',
          importance: 'Determines how much you can spend on acquisition',
          benchmark: 'LTV should be 3x higher than CAC',
          example: '$1,500 LTV with $500 CAC gives 3:1 ratio'
        },
        {
          id: 'arpu',
          name: 'Average Revenue Per User (ARPU)',
          description: 'Revenue generated per user in a given period',
          formula: 'Total Revenue ÷ Number of Users',
          importance: 'Shows monetization effectiveness',
          benchmark: 'Varies widely by business model',
          example: '$25 monthly ARPU for SaaS product'
        },
        {
          id: 'mrr-growth',
          name: 'Monthly Recurring Revenue (MRR) Growth',
          description: 'Rate of recurring revenue growth',
          formula: '(Current MRR - Previous MRR) ÷ Previous MRR × 100',
          importance: 'Key metric for subscription businesses',
          benchmark: '>10% monthly growth for early stage',
          example: '15% MRR growth from $100k to $115k'
        }
      ]
    }
  ];

  const northStarExamples = [
    {
      company: 'Airbnb',
      metric: 'Nights Booked',
      reasoning: 'Captures core value of connecting hosts and guests, drives both sides of marketplace'
    },
    {
      company: 'WhatsApp',
      metric: 'Messages Sent',
      reasoning: 'Direct measure of core product usage and network effects'
    },
    {
      company: 'Spotify',
      metric: 'Time Listening',
      reasoning: 'Shows engagement depth and content satisfaction'
    },
    {
      company: 'LinkedIn',
      metric: 'Weekly Active Users',
      reasoning: 'Professional network value increases with consistent engagement'
    },
    {
      company: 'Duolingo',
      metric: 'Daily Active Users',
      reasoning: 'Language learning requires consistent daily practice for effectiveness'
    }
  ];

  const metricsPitfalls = [
    {
      pitfall: 'Vanity Metrics',
      description: 'Focusing on impressive-sounding but meaningless numbers',
      examples: ['Total downloads', 'Page views', 'Social media followers'],
      solution: 'Focus on metrics that correlate with business value and user satisfaction'
    },
    {
      pitfall: 'Too Many Metrics',
      description: 'Tracking everything without clear priorities',
      examples: ['50+ KPIs in dashboard', 'Different teams tracking different metrics'],
      solution: 'Choose 3-5 key metrics that drive decisions and align organization'
    },
    {
      pitfall: 'Correlation vs Causation',
      description: 'Assuming correlation implies causation',
      examples: ['Feature launch coincides with growth spike', 'Seasonal patterns misinterpreted'],
      solution: 'Use controlled experiments and consider external factors'
    },
    {
      pitfall: 'Gaming the Metrics',
      description: 'Optimizing for metrics at expense of real value',
      examples: ['Artificially inflating engagement', 'Focus on short-term metrics'],
      solution: 'Choose metrics that align with long-term user and business value'
    }
  ];

  const checklistItems = [
    { id: 'north-star', text: 'Define your North Star metric', category: 'Foundation' },
    { id: 'baseline', text: 'Establish baseline measurements', category: 'Foundation' },
    { id: 'tracking', text: 'Set up proper tracking infrastructure', category: 'Implementation' },
    { id: 'dashboard', text: 'Create executive dashboard', category: 'Implementation' },
    { id: 'goals', text: 'Set realistic but ambitious goals', category: 'Strategy' },
    { id: 'review', text: 'Schedule regular metric reviews', category: 'Process' },
    { id: 'action', text: 'Define action triggers for metric changes', category: 'Process' },
    { id: 'experiments', text: 'Plan experiments to improve metrics', category: 'Optimization' }
  ];

  const progressPercentage = (metricsChecklist.size / checklistItems.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-right">
            <div className="text-sm text-slate-600 mb-1">Checklist Progress</div>
            <Progress value={progressPercentage} className="w-32" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Metrics & Measurement</h1>
          <p className="text-xl text-slate-600 mb-8">
            Learn to define, track, and interpret the right metrics for product success
          </p>

          {/* Metrics Framework */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Product Metrics Framework
              </CardTitle>
              <CardDescription>
                Organize your metrics into key categories that align with the customer lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedMetricCategory} onValueChange={setSelectedMetricCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  {metricsFramework.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {metricsFramework.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 ${category.color} rounded-lg text-white`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{category.name}</h3>
                          <p className="text-sm text-slate-600">{category.description}</p>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        {category.metrics.map((metric) => (
                          <div key={metric.id} className="p-6 border rounded-lg bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-slate-900">{metric.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Key Metric
                              </Badge>
                            </div>
                            
                            <p className="text-slate-600 mb-4">{metric.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-slate-700">Formula: </span>
                                <span className="text-slate-600">{metric.formula}</span>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Benchmark: </span>
                                <span className="text-slate-600">{metric.benchmark}</span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="font-medium text-slate-700">Why it matters: </span>
                                <span className="text-slate-600">{metric.importance}</span>
                              </div>
                              <div className="md:col-span-2 p-3 bg-slate-50 rounded">
                                <span className="font-medium text-slate-700">Example: </span>
                                <span className="text-slate-600 italic">{metric.example}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* North Star Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  North Star Metrics
                </CardTitle>
                <CardDescription>
                  Examples of how successful companies choose their most important metric
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {northStarExamples.map((example, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{example.company}</span>
                        <Badge variant="outline" className="text-xs">{example.metric}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{example.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Pitfalls</CardTitle>
                <CardDescription>
                  Avoid these common mistakes when working with metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricsPitfalls.map((pitfall, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-rose-700 mb-2">{pitfall.pitfall}</h4>
                      <p className="text-sm text-slate-600 mb-2">{pitfall.description}</p>
                      <div className="text-xs text-slate-500 mb-2">
                        Examples: {pitfall.examples.join(', ')}
                      </div>
                      <div className="text-xs text-emerald-700 font-medium">
                        Solution: {pitfall.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Checklist */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Metrics Implementation Checklist</CardTitle>
              <CardDescription>
                Essential steps to build a robust metrics program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      metricsChecklist.has(item.id)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => toggleMetricChecklist(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">{item.text}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/product-sense">
              <Button variant="outline">
                Previous: Product Sense
              </Button>
            </Link>
            <Link to="/ai-era">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Next: PM in AI Era
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;