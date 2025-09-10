import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Calculator, FileText, Users, Target, Lightbulb, Download } from 'lucide-react';

const InteractiveToolsPage = () => {
  const [activeTab, setActiveTab] = useState('rice');
  const [riceData, setRiceData] = useState({
    reach: '',
    impact: '',
    confidence: '',
    effort: ''
  });
  const [userStories, setUserStories] = useState([
    { id: 1, story: '', category: 'Must Have' }
  ]);
  const [frameworkResults, setFrameworkResults] = useState({});

  const frameworks = [
    {
      id: 'rice',
      name: 'RICE Prioritization',
      description: 'Score features based on Reach, Impact, Confidence, and Effort',
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'user-stories',
      name: 'User Story Generator',
      description: 'Create well-formatted user stories for development',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'stakeholder-map',
      name: 'Stakeholder Mapping',
      description: 'Identify and prioritize key project stakeholders',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'okr-tracker',
      name: 'OKR Tracker',
      description: 'Define and track Objectives and Key Results',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-amber-500'
    }
  ];

  const calculateRiceScore = () => {
    const { reach, impact, confidence, effort } = riceData;
    if (!reach || !impact || !confidence || !effort) return 0;
    
    const score = (parseFloat(reach) * parseFloat(impact) * parseFloat(confidence)) / parseFloat(effort);
    return Math.round(score * 100) / 100;
  };

  const getRiceScoreColor = (score) => {
    if (score >= 50) return 'text-emerald-600';
    if (score >= 20) return 'text-amber-600';
    return 'text-rose-600';
  };

  const handleRiceChange = (field, value) => {
    setRiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addUserStory = () => {
    setUserStories(prev => [
      ...prev,
      { id: Date.now(), story: '', category: 'Must Have' }
    ]);
  };

  const updateUserStory = (id, field, value) => {
    setUserStories(prev => prev.map(story => 
      story.id === id ? { ...story, [field]: value } : story
    ));
  };

  const removeUserStory = (id) => {
    setUserStories(prev => prev.filter(story => story.id !== id));
  };

  const generateUserStoryFormat = (story) => {
    if (!story.trim()) return '';
    
    // Simple user story generator
    const parts = story.split(' ');
    if (parts.length < 3) return story;
    
    return `As a [user type], I want to [action] so that [benefit].`;
  };

  const templates = [
    {
      id: 'feature-spec',
      name: 'Feature Specification Template',
      description: 'Comprehensive template for documenting new features',
      sections: [
        'Problem Statement',
        'Success Metrics',
        'User Stories',
        'Acceptance Criteria',
        'Technical Requirements',
        'Risk Assessment'
      ]
    },
    {
      id: 'user-interview',
      name: 'User Interview Guide',
      description: 'Structured approach to conducting user interviews',
      sections: [
        'Interview Objectives',
        'Participant Background',
        'Warm-up Questions',
        'Core Questions',
        'Wrap-up & Next Steps'
      ]
    },
    {
      id: 'competitive-analysis',
      name: 'Competitive Analysis Framework',
      description: 'Systematic competitor evaluation template',
      sections: [
        'Competitor Overview',
        'Feature Comparison',
        'Pricing Analysis',
        'User Experience Review',
        'Strengths & Weaknesses',
        'Strategic Implications'
      ]
    },
    {
      id: 'product-launch',
      name: 'Product Launch Checklist',
      description: 'Complete checklist for product launches',
      sections: [
        'Pre-Launch Preparation',
        'Marketing & Communications',
        'Technical Readiness',
        'Support & Documentation',
        'Success Metrics',
        'Post-Launch Activities'
      ]
    }
  ];

  const caseStudyExercises = [
    {
      id: 'pricing-strategy',
      title: 'Pricing Strategy Challenge',
      scenario: 'You\'re launching a new SaaS product. Design a pricing strategy that maximizes revenue while ensuring product adoption.',
      constraints: [
        'Target market: Small to medium businesses',
        'Competitor prices: $10-50/month',
        'Product has freemium potential',
        'High customer acquisition cost'
      ],
      deliverables: [
        'Pricing tiers and features',
        'Rationale for pricing decisions',
        'Go-to-market pricing strategy',
        'Success metrics'
      ]
    },
    {
      id: 'feature-sunset',
      title: 'Feature Sunset Decision',
      scenario: 'A feature used by 15% of users consumes 40% of engineering resources. Decide whether to sunset, redesign, or maintain it.',
      constraints: [
        'High-value customers depend on it',
        'Technical debt is significant',
        'Alternative solutions exist',
        'Limited engineering bandwidth'
      ],
      deliverables: [
        'Recommendation with rationale',
        'Impact assessment',
        'Migration plan (if applicable)',
        'Communication strategy'
      ]
    },
    {
      id: 'market-expansion',
      title: 'Market Expansion Analysis',
      scenario: 'Your B2B product is successful in the US. Evaluate expansion into European markets.',
      constraints: [
        'GDPR compliance required',
        'Different payment preferences',
        'Localization needs',
        'Competitive landscape varies'
      ],
      deliverables: [
        'Market prioritization framework',
        'Go-to-market strategy',
        'Resource requirements',
        'Success criteria'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Interactive Tools</h1>
          <p className="text-xl text-slate-600 mb-8">
            Practice with frameworks, templates, and hands-on exercises
          </p>

          {/* Interactive Frameworks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-rose-600" />
                PM Framework Tools
              </CardTitle>
              <CardDescription>
                Interactive tools to practice key product management frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {frameworks.map((framework) => (
                    <TabsTrigger key={framework.id} value={framework.id} className="text-xs">
                      {framework.name.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* RICE Prioritization Tool */}
                <TabsContent value="rice" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">RICE Prioritization Calculator</h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Score features based on Reach × Impact × Confidence ÷ Effort
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reach (number of users affected per quarter)
                          </label>
                          <Input
                            type="number"
                            value={riceData.reach}
                            onChange={(e) => handleRiceChange('reach', e.target.value)}
                            placeholder="e.g., 1000"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Impact (1-3 scale: 1=minimal, 2=low, 3=medium, 4=high, 5=massive)
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={riceData.impact}
                            onChange={(e) => handleRiceChange('impact', e.target.value)}
                            placeholder="1-5"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confidence (percentage: how sure are you?)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={riceData.confidence}
                            onChange={(e) => handleRiceChange('confidence', e.target.value)}
                            placeholder="e.g., 80"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Effort (person-months of work)
                          </label>
                          <Input
                            type="number"
                            value={riceData.effort}
                            onChange={(e) => handleRiceChange('effort', e.target.value)}
                            placeholder="e.g., 2"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-4">RICE Score</h4>
                        <div className={`text-4xl font-bold mb-2 ${getRiceScoreColor(calculateRiceScore())}`}>
                          {calculateRiceScore()}
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Formula: ({riceData.reach || 0} × {riceData.impact || 0} × {riceData.confidence || 0}%) ÷ {riceData.effort || 1}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>High Priority:</span>
                            <span className="text-emerald-600">50+</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Medium Priority:</span>
                            <span className="text-amber-600">20-49</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Low Priority:</span>
                            <span className="text-rose-600">&lt;20</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* User Stories Tool */}
                <TabsContent value="user-stories" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">User Story Builder</h3>
                      <p className="text-slate-600 text-sm">
                        Create well-formatted user stories for your development team
                      </p>
                    </div>

                    <div className="space-y-4">
                      {userStories.map((story, index) => (
                        <div key={story.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">Story #{index + 1}</Badge>
                            {userStories.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeUserStory(story.id)}
                                className="text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                User Story Description
                              </label>
                              <Textarea
                                value={story.story}
                                onChange={(e) => updateUserStory(story.id, 'story', e.target.value)}
                                placeholder="Describe what the user wants to accomplish..."
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Priority
                              </label>
                              <select
                                value={story.category}
                                onChange={(e) => updateUserStory(story.id, 'category', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md text-sm"
                              >
                                <option value="Must Have">Must Have</option>
                                <option value="Should Have">Should Have</option>
                                <option value="Could Have">Could Have</option>
                                <option value="Won't Have">Won't Have</option>
                              </select>
                            </div>
                          </div>

                          {story.story && (
                            <div className="mt-4 p-3 bg-slate-50 rounded border-l-4 border-emerald-400">
                              <p className="text-sm font-medium text-slate-700 mb-1">Formatted User Story:</p>
                              <p className="text-sm text-slate-600 italic">
                                "As a [user type], I want to {story.story.toLowerCase()} so that [benefit]."
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <Button onClick={addUserStory} variant="outline" className="w-full">
                        Add Another User Story
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Other tabs would be implemented similarly */}
                <TabsContent value="stakeholder-map" className="mt-6">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Stakeholder Mapping Tool</h3>
                    <p className="text-slate-600">Interactive stakeholder analysis coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="okr-tracker" className="mt-6">
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">OKR Tracking Tool</h3>
                    <p className="text-slate-600">OKR definition and tracking tool coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>PM Templates & Frameworks</CardTitle>
              <CardDescription>
                Downloadable templates for common PM activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Use Template
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Case Study Exercises */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Case Study Exercises</CardTitle>
              <CardDescription>
                Practice PM decision-making with realistic scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {caseStudyExercises.map((exercise) => (
                  <div key={exercise.id} className="p-6 border rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">{exercise.title}</h3>
                    <p className="text-slate-600 mb-4">{exercise.scenario}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Constraints:</h4>
                        <ul className="space-y-1">
                          {exercise.constraints.map((constraint, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start">
                              <span className="w-2 h-2 bg-rose-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {constraint}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Deliverables:</h4>
                        <ul className="space-y-1">
                          {exercise.deliverables.map((deliverable, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        Start Exercise
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link to="/ai-era">
              <Button variant="outline">
                Previous: PM in AI Era
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-rose-600 hover:bg-rose-700">
                Complete Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveToolsPage;