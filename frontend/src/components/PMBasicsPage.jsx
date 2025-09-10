import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useProgress } from '../contexts/ProgressContext';
import { ArrowLeft, CheckCircle, Circle, Users, Target, Lightbulb, BarChart3, MessageSquare, Cog } from 'lucide-react';

const PMBasicsPage = () => {
  const { updateSectionProgress, isSectionCompleted, progress } = useProgress();
  const [selectedRole, setSelectedRole] = useState(null);

  const toggleSection = async (sectionId) => {
    const isCompleted = isSectionCompleted(sectionId);
    try {
      await updateSectionProgress(sectionId, 'pm-basics', !isCompleted);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const pmRoles = [
    {
      id: 'strategy',
      title: 'Strategic Thinker',
      description: 'Define product vision, roadmap, and long-term goals',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      details: 'PMs must think beyond immediate features to understand market trends, competitive landscape, and long-term customer needs.'
    },
    {
      id: 'user-advocate',
      title: 'User Advocate',
      description: 'Champion user needs and ensure customer-centricity',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-emerald-500',
      details: 'Represent the voice of the customer in all product decisions through research, feedback analysis, and user journey mapping.'
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      description: 'Make decisions based on metrics and insights',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-amber-500',
      details: 'Use quantitative and qualitative data to validate hypotheses, measure success, and identify improvement opportunities.'
    },
    {
      id: 'communicator',
      title: 'Master Communicator',
      description: 'Bridge gaps between teams and stakeholders',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-rose-500',
      details: 'Facilitate clear communication across engineering, design, marketing, sales, and executive teams.'
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      description: 'Identify and solve complex product challenges',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-purple-500',
      details: 'Break down complex problems into manageable solutions while considering technical constraints and business objectives.'
    },
    {
      id: 'executor',
      title: 'Execution Expert',
      description: 'Drive product development from concept to launch',
      icon: <Cog className="w-6 h-6" />,
      color: 'bg-slate-500',
      details: 'Manage product lifecycle, coordinate cross-functional teams, and ensure timely delivery of high-quality features.'
    }
  ];

  const learningModules = [
    {
      id: 'definition',
      title: 'What is Product Management?',
      content: 'Product Management is the practice of strategically driving the development, market launch, and continual support and improvement of a company\'s products.',
      keyPoints: [
        'Intersection of business, technology, and user experience',
        'Focus on solving customer problems profitably',
        'Bridge between vision and execution',
        'Data-driven decision making'
      ]
    },
    {
      id: 'responsibilities',
      title: 'Core Responsibilities',
      content: 'PMs wear many hats, from strategy to execution, always keeping the customer at the center of everything.',
      keyPoints: [
        'Product strategy and roadmap planning',
        'User research and market analysis',
        'Feature prioritization and requirement gathering',
        'Cross-functional team coordination',
        'Metrics definition and performance tracking',
        'Stakeholder communication and alignment'
      ]
    },
    {
      id: 'skills',
      title: 'Essential Skills',
      content: 'Successful PMs combine analytical thinking with strong communication and a deep understanding of users.',
      keyPoints: [
        'Strategic thinking and vision setting',
        'User empathy and customer obsession',
        'Data analysis and interpretation',
        'Communication and presentation skills',
        'Technical understanding (not coding)',
        'Leadership without authority'
      ]
    }
  ];

  const progressPercentage = (completedSections.size / (learningModules.length + pmRoles.length)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">PM Fundamentals</h1>
          <p className="text-xl text-slate-600 mb-8">
            Understanding the core role, responsibilities, and mindset of a Product Manager
          </p>

          {/* Learning Modules */}
          <div className="space-y-6 mb-12">
            {learningModules.map((module) => (
              <Card key={module.id} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {completedSections.has(module.id) ? 
                        <CheckCircle className="w-5 h-5 text-emerald-500" /> : 
                        <Circle className="w-5 h-5 text-slate-400" />
                      }
                      {module.title}
                    </CardTitle>
                    <Badge variant="outline">
                      {completedSections.has(module.id) ? 'Completed' : 'Not Started'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{module.content}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900">Key Points:</h4>
                    <ul className="space-y-1">
                      {module.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PM Roles Interactive Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>The Many Hats of a Product Manager</CardTitle>
              <CardDescription>
                Click on each role to learn more about what PMs do in practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {pmRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedRole === role.id 
                        ? 'border-slate-400 bg-slate-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                  >
                    <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                      {role.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{role.title}</h3>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </div>
                ))}
              </div>
              
              {selectedRole && (
                <div className="p-6 bg-slate-50 rounded-lg border">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {pmRoles.find(r => r.id === selectedRole)?.title}
                  </h3>
                  <p className="text-slate-600">
                    {pmRoles.find(r => r.id === selectedRole)?.details}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="flex justify-center space-x-4">
            <Link to="/discovery">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                Next: Product Discovery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMBasicsPage;