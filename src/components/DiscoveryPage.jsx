import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Users, Search, Target, MessageCircle, FileText, CheckCircle, Circle } from 'lucide-react';

const DiscoveryPage = () => {
  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [activeFramework, setActiveFramework] = useState('jobs-to-be-done');

  const toggleActivity = (activityId) => {
    const newCompleted = new Set(completedActivities);
    if (newCompleted.has(activityId)) {
      newCompleted.delete(activityId);
    } else {
      newCompleted.add(activityId);
    }
    setCompletedActivities(newCompleted);
  };

  const discoveryFrameworks = [
    {
      id: 'jobs-to-be-done',
      name: 'Jobs-to-be-Done',
      description: 'Understand what customers are trying to accomplish',
      steps: [
        'Identify the functional job',
        'Understand emotional and social jobs',
        'Map the job executor journey',
        'Identify pain points and desired outcomes',
        'Validate job importance and satisfaction'
      ],
      example: 'When I need to commute to work (situation), I want to hire a transportation solution (job) so that I can arrive on time and comfortably (outcome).'
    },
    {
      id: 'problem-validation',
      name: 'Problem Validation',
      description: 'Ensure you\'re solving a real, valuable problem',
      steps: [
        'Define the problem hypothesis',
        'Identify target user segments',
        'Conduct user interviews',
        'Analyze behavioral data',
        'Validate problem significance'
      ],
      example: 'Small business owners struggle to manage inventory efficiently, leading to stockouts or overstock situations that hurt profitability.'
    },
    {
      id: 'user-journey-mapping',
      name: 'User Journey Mapping',
      description: 'Visualize the complete user experience',
      steps: [
        'Define user personas',
        'Map touchpoints and interactions',
        'Identify emotions and pain points',
        'Highlight opportunities',
        'Prioritize improvement areas'
      ],
      example: 'Map how users discover, evaluate, purchase, and use your product, noting frustrations and delights at each stage.'
    }
  ];

  const discoveryActivities = [
    {
      id: 'user-interviews',
      title: 'User Interviews',
      description: 'One-on-one conversations to understand user needs, behaviors, and motivations',
      icon: <MessageCircle className="w-5 h-5" />,
      tips: [
        'Ask open-ended questions',
        'Focus on past behavior, not future intentions',
        'Listen more than you talk',
        'Probe for specific examples',
        'Avoid leading questions'
      ]
    },
    {
      id: 'surveys',
      title: 'User Surveys',
      description: 'Collect quantitative data from larger user groups',
      icon: <FileText className="w-5 h-5" />,
      tips: [
        'Keep surveys short and focused',
        'Use a mix of question types',
        'Test your survey before launching',
        'Ensure representative sampling',
        'Follow up with qualitative research'
      ]
    },
    {
      id: 'competitive-analysis',
      title: 'Competitive Analysis',
      description: 'Understand the competitive landscape and identify differentiation opportunities',
      icon: <Search className="w-5 h-5" />,
      tips: [
        'Include direct and indirect competitors',
        'Focus on user experience, not just features',
        'Analyze pricing and positioning',
        'Look for gaps in the market',
        'Update analysis regularly'
      ]
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description: 'Extract insights from user behavior and product usage data',
      icon: <Target className="w-5 h-5" />,
      tips: [
        'Start with clear questions',
        'Look for patterns and trends',
        'Segment users for deeper insights',
        'Combine quantitative with qualitative data',
        'Validate findings with users'
      ]
    }
  ];

  const progressPercentage = (completedActivities.size / discoveryActivities.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100">
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
            <div className="text-sm text-slate-600 mb-1">Progress</div>
            <Progress value={progressPercentage} className="w-32" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Product Discovery</h1>
          <p className="text-xl text-slate-600 mb-8">
            Master the art of identifying user needs, market opportunities, and problem validation
          </p>

          {/* Discovery Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                Why Discovery Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Product discovery is the process of understanding what problems to solve before building solutions. 
                It's about reducing risk by validating assumptions and ensuring product-market fit.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">70%</div>
                  <div className="text-sm text-slate-600">of products fail due to lack of market need</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">5x</div>
                  <div className="text-sm text-slate-600">more expensive to fix problems post-launch</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">90%</div>
                  <div className="text-sm text-slate-600">of startups pivot from original idea</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discovery Frameworks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Discovery Frameworks</CardTitle>
              <CardDescription>
                Proven methodologies to guide your discovery process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeFramework} onValueChange={setActiveFramework}>
                <TabsList className="grid w-full grid-cols-3">
                  {discoveryFrameworks.map((framework) => (
                    <TabsTrigger key={framework.id} value={framework.id} className="text-xs">
                      {framework.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {discoveryFrameworks.map((framework) => (
                  <TabsContent key={framework.id} value={framework.id} className="mt-6">
                    <div className="space-y-4">
                      <p className="text-slate-600">{framework.description}</p>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Process Steps:</h4>
                        <ol className="space-y-2">
                          {framework.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-slate-600">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Example:</h4>
                        <p className="text-slate-600 italic">{framework.example}</p>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Discovery Activities */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {discoveryActivities.map((activity) => (
              <Card key={activity.id} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        {activity.icon}
                      </div>
                      {activity.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActivity(activity.id)}
                      className="ml-2"
                    >
                      {completedActivities.has(activity.id) ? 
                        <CheckCircle className="w-5 h-5 text-emerald-500" /> : 
                        <Circle className="w-5 h-5 text-slate-400" />
                      }
                    </Button>
                  </div>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900">Best Practices:</h4>
                    <ul className="space-y-1">
                      {activity.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/pm-basics">
              <Button variant="outline">
                Previous: PM Fundamentals
              </Button>
            </Link>
            <Link to="/product-sense">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Next: Product Sense
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;