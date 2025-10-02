import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Brain, Sparkles, Zap, Target, Users, BarChart3, Cog, CheckCircle, Circle } from 'lucide-react';

const AIEraPage = () => {
  const [completedSections, setCompletedSections] = useState(new Set());
  const [selectedUseCase, setSelectedUseCase] = useState('personalization');

  const toggleSection = (sectionId) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
  };

  const aiTransformations = [
    {
      id: 'decision-making',
      title: 'Data-Driven Decision Making',
      description: 'AI amplifies your ability to make informed product decisions',
      before: 'Manual analysis of user feedback and behavior data',
      after: 'AI-powered insights and predictive analytics',
      impact: '10x faster insights, more accurate predictions',
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 'user-research',
      title: 'User Research & Insights',
      description: 'Automate and enhance user research processes',
      before: 'Time-consuming manual interviews and surveys',
      after: 'AI-assisted analysis of user sessions, sentiment analysis',
      impact: 'Scale research 5x, uncover hidden patterns',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'personalization',
      title: 'Product Personalization',
      description: 'Create individualized experiences for each user',
      before: 'One-size-fits-all product experiences',
      after: 'AI-driven personalized interfaces and content',
      impact: '40% increase in engagement, 25% higher retention',
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'automation',
      title: 'Process Automation',
      description: 'Automate repetitive PM tasks and workflows',
      before: 'Manual feature flagging, A/B test analysis',
      after: 'Automated experiment management and optimization',
      impact: '60% time savings on operational tasks',
      icon: <Cog className="w-5 h-5" />
    }
  ];

  const aiUseCases = [
    {
      id: 'personalization',
      title: 'AI-Powered Personalization',
      description: 'Tailor user experiences using machine learning',
      techniques: [
        'Collaborative filtering for recommendations',
        'Content-based filtering for discovery',
        'Dynamic UI adaptation based on behavior',
        'Personalized onboarding flows'
      ],
      examples: [
        'Netflix: Personalized movie recommendations',
        'Spotify: Discover Weekly playlists',
        'Amazon: Product recommendations',
        'LinkedIn: Personalized feed content'
      ],
      implementation: [
        'Collect user interaction data',
        'Build ML models for preferences',
        'A/B test personalized experiences',
        'Monitor engagement improvements'
      ],
      metrics: ['Click-through rates', 'Time spent', 'Conversion rates', 'User satisfaction']
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics',
      description: 'Forecast user behavior and business outcomes',
      techniques: [
        'Churn prediction models',
        'Lifetime value forecasting',
        'Feature adoption prediction',
        'Revenue forecasting'
      ],
      examples: [
        'Slack: Predicting team expansion needs',
        'Dropbox: Churn risk identification',
        'HubSpot: Lead scoring optimization',
        'Zoom: Usage pattern analysis'
      ],
      implementation: [
        'Define prediction targets',
        'Collect historical data',
        'Train predictive models',
        'Integrate predictions into workflows'
      ],
      metrics: ['Prediction accuracy', 'False positive rate', 'Business impact', 'Model performance']
    },
    {
      id: 'automated-insights',
      title: 'Automated Insights',
      description: 'Generate insights from data automatically',
      techniques: [
        'Anomaly detection in metrics',
        'Automated cohort analysis',
        'Natural language insights generation',
        'Real-time alert systems'
      ],
      examples: [
        'Google Analytics: Automated insights',
        'Mixpanel: Smart notifications',
        'Amplitude: Behavioral insights',
        'Tableau: Explain Data feature'
      ],
      implementation: [
        'Set up data pipelines',
        'Define insight triggers',
        'Build automated reporting',
        'Create actionable alerts'
      ],
      metrics: ['Insight accuracy', 'Time to detection', 'Action taken rate', 'Business impact']
    },
    {
      id: 'conversational-interfaces',
      title: 'Conversational AI',
      description: 'Build intelligent chatbots and voice interfaces',
      techniques: [
        'Natural language processing',
        'Intent recognition',
        'Context-aware responses',
        'Multi-turn conversations'
      ],
      examples: [
        'Intercom: Customer support chatbots',
        'Duolingo: AI conversation practice',
        'Replika: Emotional AI companion',
        'Alexa: Voice-first experiences'
      ],
      implementation: [
        'Design conversation flows',
        'Train language models',
        'Implement fallback mechanisms',
        'Monitor conversation quality'
      ],
      metrics: ['Resolution rate', 'User satisfaction', 'Conversation completion', 'Escalation rate']
    }
  ];

  const aiTools = [
    {
      category: 'Analytics & Insights',
      tools: [
        { name: 'Amplitude AI Insights', use: 'Automated behavioral insights' },
        { name: 'Mixpanel Signal', use: 'Anomaly detection in metrics' },
        { name: 'Google Analytics Intelligence', use: 'Natural language queries' },
        { name: 'Tableau Explain Data', use: 'Automated data explanations' }
      ]
    },
    {
      category: 'User Research',
      tools: [
        { name: 'Maze AI Insights', use: 'Automated usability testing analysis' },
        { name: 'UserVoice Sentiment Analysis', use: 'Feedback sentiment tracking' },
        { name: 'Hotjar AI', use: 'Automated heatmap insights' },
        { name: 'Typeform AI', use: 'Smart survey optimization' }
      ]
    },
    {
      category: 'Personalization',
      tools: [
        { name: 'Dynamic Yield', use: 'Website personalization' },
        { name: 'Optimizely', use: 'AI-powered experimentation' },
        { name: 'Segment Personas', use: 'Customer segmentation' },
        { name: 'Braze Intelligence Suite', use: 'Predictive messaging' }
      ]
    },
    {
      category: 'Development & Testing',
      tools: [
        { name: 'GitHub Copilot', use: 'AI-assisted coding' },
        { name: 'Testim', use: 'AI-powered test automation' },
        { name: 'Mabl', use: 'Intelligent test maintenance' },
        { name: 'Sauce Labs', use: 'AI-enhanced testing' }
      ]
    }
  ];

  const aiEthics = [
    {
      principle: 'Transparency',
      description: 'Users should understand how AI affects their experience',
      examples: ['Explain recommendation algorithms', 'Provide AI decision rationale', 'Clear AI usage disclosure']
    },
    {
      principle: 'Fairness',
      description: 'AI systems should not discriminate or create bias',
      examples: ['Test for algorithmic bias', 'Ensure diverse training data', 'Monitor fairness metrics']
    },
    {
      principle: 'Privacy',
      description: 'Protect user data and respect privacy preferences',
      examples: ['Data minimization', 'User consent for AI features', 'Secure data handling']
    },
    {
      principle: 'Human Control',
      description: 'Users should maintain control over AI-driven features',
      examples: ['Opt-out mechanisms', 'Manual overrides', 'User preference controls']
    }
  ];

  const progressPercentage = (completedSections.size / aiTransformations.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100">
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
            <div className="text-sm text-slate-600 mb-1">Sections Completed</div>
            <Progress value={progressPercentage} className="w-32" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">PM in the AI Era</h1>
          <p className="text-xl text-slate-600 mb-8">
            Navigate product management in the age of artificial intelligence
          </p>

          {/* AI Impact Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                How AI Transforms Product Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {aiTransformations.map((transformation) => (
                  <div 
                    key={transformation.id}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      completedSections.has(transformation.id) 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => toggleSection(transformation.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                          {transformation.icon}
                        </div>
                        <h3 className="font-semibold text-slate-900">{transformation.title}</h3>
                      </div>
                      {completedSections.has(transformation.id) ? 
                        <CheckCircle className="w-5 h-5 text-purple-500" /> : 
                        <Circle className="w-5 h-5 text-slate-400" />
                      }
                    </div>
                    
                    <p className="text-slate-600 mb-4">{transformation.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Before: </span>
                        <span className="text-slate-600">{transformation.before}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">After: </span>
                        <span className="text-slate-600">{transformation.after}</span>
                      </div>
                      <div className="p-2 bg-purple-100 rounded text-purple-800">
                        <span className="font-medium">Impact: </span>
                        {transformation.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Use Cases */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Use Cases for Product Teams</CardTitle>
              <CardDescription>
                Practical applications of AI in product development and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedUseCase} onValueChange={setSelectedUseCase}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {aiUseCases.map((useCase) => (
                    <TabsTrigger key={useCase.id} value={useCase.id} className="text-xs">
                      {useCase.title.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {aiUseCases.map((useCase) => (
                  <TabsContent key={useCase.id} value={useCase.id} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                        <p className="text-slate-600">{useCase.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Key Techniques</h4>
                          <ul className="space-y-2">
                            {useCase.techniques.map((technique, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start">
                                <Zap className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                                {technique}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Real Examples</h4>
                          <ul className="space-y-2">
                            {useCase.examples.map((example, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Implementation Steps</h4>
                        <div className="flex flex-wrap gap-2">
                          {useCase.implementation.map((step, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {index + 1}. {step}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">Success Metrics</h4>
                        <div className="flex flex-wrap gap-2">
                          {useCase.metrics.map((metric, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Tools & Ethics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Tools for PMs</CardTitle>
                <CardDescription>
                  Popular tools that leverage AI for product management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiTools.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-slate-900 mb-3">{category.category}</h4>
                      <div className="space-y-2">
                        {category.tools.map((tool, toolIndex) => (
                          <div key={toolIndex} className="p-3 border rounded bg-slate-50">
                            <div className="font-medium text-slate-800 text-sm">{tool.name}</div>
                            <div className="text-xs text-slate-600">{tool.use}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Ethics for PMs</CardTitle>
                <CardDescription>
                  Principles for responsible AI product development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiEthics.map((principle, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">{principle.principle}</h4>
                      <p className="text-sm text-slate-600 mb-3">{principle.description}</p>
                      <div className="space-y-1">
                        {principle.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-xs text-slate-500 flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/metrics">
              <Button variant="outline">
                Previous: Metrics & Measurement
              </Button>
            </Link>
            <Link to="/tools">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Next: Interactive Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEraPage;