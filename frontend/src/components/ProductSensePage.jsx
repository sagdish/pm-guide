import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Brain, Lightbulb, Users, Star, CheckCircle } from 'lucide-react';

const ProductSensePage = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const productSenseScenarios = [
    {
      id: 'feature-prioritization',
      title: 'Feature Prioritization Challenge',
      scenario: 'You\'re the PM for a social media app. You have limited engineering resources and must choose ONE feature to build next:',
      options: [
        {
          id: 'a',
          text: 'Advanced video editing tools with filters and effects',
          reasoning: 'High development effort, appeals to content creators but may not drive broad user engagement'
        },
        {
          id: 'b', 
          text: 'Improved notification system to reduce spam and increase relevance',
          reasoning: 'Medium effort, high impact on user experience and retention across all user segments'
        },
        {
          id: 'c',
          text: 'Dark mode for the mobile app',
          reasoning: 'Low effort, high user satisfaction but limited business impact'
        },
        {
          id: 'd',
          text: 'AI-powered content recommendation engine',
          reasoning: 'High effort, potentially high impact on engagement but requires significant data and ML infrastructure'
        }
      ],
      bestAnswer: 'b',
      explanation: 'Notifications directly impact user engagement and retention. Fixing notification relevance addresses a pain point that affects all users and can significantly improve key metrics with reasonable development effort.'
    },
    {
      id: 'user-problem',
      title: 'User Problem Identification',
      scenario: 'Users are reporting that they find your e-commerce app "confusing". What\'s your first step?',
      options: [
        {
          id: 'a',
          text: 'Immediately redesign the main navigation',
          reasoning: 'Jumping to solutions without understanding the root cause'
        },
        {
          id: 'b',
          text: 'Conduct user interviews to understand specific pain points',
          reasoning: 'Best approach - gather qualitative data to understand what "confusing" means to users'
        },
        {
          id: 'c',
          text: 'Add more help text and tooltips throughout the app',
          reasoning: 'May address symptoms but not root causes, could clutter the interface'
        },
        {
          id: 'd',
          text: 'Analyze user behavior data to see where people drop off',
          reasoning: 'Good approach but should be combined with qualitative research'
        }
      ],
      bestAnswer: 'b',
      explanation: '"Confusing" is subjective feedback. User interviews will help you understand specific pain points, workflows, and mental models. Combine this with behavioral data for a complete picture.'
    },
    {
      id: 'metrics-focus',
      title: 'Metrics Selection',
      scenario: 'Your productivity app launched 3 months ago. Which metric should you focus on most?',
      options: [
        {
          id: 'a',
          text: 'Total number of downloads',
          reasoning: 'Vanity metric - doesn\'t indicate actual product success or user value'
        },
        {
          id: 'b',
          text: 'Daily active users (DAU)',
          reasoning: 'Good engagement metric but may not reflect long-term value creation'
        },
        {
          id: 'c',
          text: '7-day retention rate',
          reasoning: 'Excellent choice - indicates users are finding value and forming habits'
        },
        {
          id: 'd',
          text: 'Average session duration',
          reasoning: 'Can be misleading - longer sessions aren\'t always better for productivity apps'
        }
      ],
      bestAnswer: 'c',
      explanation: 'For a new product, retention is the most important metric. It indicates users are finding enough value to return, which is crucial for long-term success and sustainable growth.'
    }
  ];

  const productSensePrinciples = [
    {
      title: 'User Empathy',
      description: 'Deep understanding of user needs, motivations, and context',
      icon: <Users className="w-5 h-5" />,
      examples: [
        'Always validate assumptions with real users',
        'Consider the full user journey, not just your product',
        'Understand the job users are hiring your product to do',
        'Pay attention to what users do, not just what they say'
      ]
    },
    {
      title: 'Business Acumen', 
      description: 'Understanding how product decisions impact business outcomes',
      icon: <Star className="w-5 h-5" />,
      examples: [
        'Connect features to business metrics',
        'Understand unit economics and pricing impact',
        'Consider technical constraints and trade-offs',
        'Balance short-term wins with long-term strategy'
      ]
    },
    {
      title: 'Analytical Thinking',
      description: 'Using data and logic to make informed decisions',
      icon: <Brain className="w-5 h-5" />,
      examples: [
        'Start with hypotheses, test with data',
        'Look for patterns in user behavior',
        'Question correlation vs causation',
        'Use both quantitative and qualitative insights'
      ]
    },
    {
      title: 'Design Intuition',
      description: 'Sense for good user experience and interface design',
      icon: <Lightbulb className="w-5 h-5" />,
      examples: [
        'Prioritize simplicity and clarity',
        'Understand information hierarchy',
        'Consider accessibility and edge cases',
        'Know when to follow vs break conventions'
      ]
    }
  ];

  const handleAnswerSelect = (scenarioId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [scenarioId]: answerId
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    productSenseScenarios.forEach(scenario => {
      if (selectedAnswers[scenario.id] === scenario.bestAnswer) {
        correct++;
      }
    });
    return Math.round((correct / productSenseScenarios.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 60) return { text: 'Good', color: 'bg-amber-100 text-amber-800' };
    return { text: 'Needs Improvement', color: 'bg-rose-100 text-rose-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100">
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
            <div className="text-sm text-slate-600 mb-1">Scenarios Completed</div>
            <Progress value={(Object.keys(selectedAnswers).length / productSenseScenarios.length) * 100} className="w-32" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Product Sense</h1>
          <p className="text-xl text-slate-600 mb-8">
            Develop intuition for good product decisions and user experience
          </p>

          {/* Product Sense Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-amber-600" />
                What is Product Sense?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Product sense is the ability to consistently make good product decisions. It's a combination of 
                user empathy, business understanding, and design intuition that allows PMs to navigate ambiguous 
                situations and prioritize effectively.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productSensePrinciples.map((principle, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        {principle.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900">{principle.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{principle.description}</p>
                    <ul className="space-y-1">
                      {principle.examples.map((example, idx) => (
                        <li key={idx} className="text-xs text-slate-500 flex items-start">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Scenarios */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Your Product Sense</CardTitle>
              <CardDescription>
                Work through these realistic scenarios to practice product decision-making
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div className="space-y-8">
                  {productSenseScenarios.map((scenario, index) => (
                    <div key={scenario.id} className="border rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">Scenario {index + 1}</Badge>
                        <h3 className="font-semibold text-slate-900">{scenario.title}</h3>
                      </div>
                      
                      <p className="text-slate-600 mb-6">{scenario.scenario}</p>
                      
                      <div className="space-y-3">
                        {scenario.options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedAnswers[scenario.id] === option.id
                                ? 'border-amber-400 bg-amber-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => handleAnswerSelect(scenario.id, option.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                selectedAnswers[scenario.id] === option.id
                                  ? 'border-amber-400 bg-amber-400'
                                  : 'border-slate-300'
                              }`}>
                                {selectedAnswers[scenario.id] === option.id && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="text-slate-700">{option.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {Object.keys(selectedAnswers).length === productSenseScenarios.length && (
                    <div className="text-center">
                      <Button 
                        onClick={() => setShowResults(true)}
                        className="bg-amber-600 hover:bg-amber-700"
                        size="lg"
                      >
                        See Results
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(calculateScore())}`}>
                      {calculateScore()}%
                    </div>
                    <Badge className={getScoreBadge(calculateScore()).color}>
                      {getScoreBadge(calculateScore()).text}
                    </Badge>
                    <p className="text-slate-600 mt-2">Product Sense Score</p>
                  </div>

                  {/* Detailed Results */}
                  <div className="space-y-4">
                    {productSenseScenarios.map((scenario, index) => {
                      const userAnswer = selectedAnswers[scenario.id];
                      const isCorrect = userAnswer === scenario.bestAnswer;
                      
                      return (
                        <div key={scenario.id} className="border rounded-lg p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">Scenario {index + 1}</Badge>
                            <Badge className={isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-slate-900 mb-2">{scenario.title}</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-slate-700">Your answer: </span>
                              <span className="text-sm text-slate-600">
                                {scenario.options.find(opt => opt.id === userAnswer)?.text}
                              </span>
                            </div>
                            
                            <div>
                              <span className="text-sm font-medium text-slate-700">Best answer: </span>
                              <span className="text-sm text-slate-600">
                                {scenario.options.find(opt => opt.id === scenario.bestAnswer)?.text}
                              </span>
                            </div>
                            
                            <div className="p-3 bg-slate-50 rounded">
                              <span className="text-sm font-medium text-slate-700">Explanation: </span>
                              <span className="text-sm text-slate-600">{scenario.explanation}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers({});
                      }}
                      variant="outline"
                    >
                      Retake Assessment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/discovery">
              <Button variant="outline">
                Previous: Product Discovery
              </Button>
            </Link>
            <Link to="/metrics">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Next: Metrics & Measurement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSensePage;