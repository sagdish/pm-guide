import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import AuthModal from './AuthModal';
import { ArrowRight, Target, Users, TrendingUp, Brain, Lightbulb, BarChart3, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { progress, isModuleCompleted } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const learningPaths = [
    {
      title: "PM Fundamentals",
      description: "Understanding the core role, responsibilities, and mindset of a Product Manager",
      icon: <Target className="w-6 h-6" />,
      path: "/pm-basics",
      color: "bg-slate-800 hover:bg-slate-700",
      badge: "Essential"
    },
    {
      title: "Product Discovery",
      description: "Master the art of identifying user needs, market opportunities, and problem validation",
      icon: <Lightbulb className="w-6 h-6" />,
      path: "/discovery",
      color: "bg-emerald-800 hover:bg-emerald-700",
      badge: "Core Skill"
    },
    {
      title: "Product Sense",
      description: "Develop intuition for good product decisions and user experience",
      icon: <Brain className="w-6 h-6" />,
      path: "/product-sense",
      color: "bg-amber-800 hover:bg-amber-700",
      badge: "Advanced"
    },
    {
      title: "Metrics & Measurement",
      description: "Learn to define, track, and interpret the right metrics for product success",
      icon: <BarChart3 className="w-6 h-6" />,
      path: "/metrics",
      color: "bg-blue-800 hover:bg-blue-700",
      badge: "Data-Driven"
    },
    {
      title: "PM in AI Era",
      description: "Navigate product management in the age of artificial intelligence",
      icon: <TrendingUp className="w-6 h-6" />,
      path: "/ai-era",
      color: "bg-purple-800 hover:bg-purple-700",
      badge: "Future-Ready"
    },
    {
      title: "Interactive Tools",
      description: "Practice with frameworks, templates, and hands-on exercises",
      icon: <Users className="w-6 h-6" />,
      path: "/tools",
      color: "bg-rose-800 hover:bg-rose-700",
      badge: "Practical"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {isAuthenticated ? `Welcome back, ${user?.name}!` : 'The Ultimate Guide to'}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
              {isAuthenticated ? 'Continue Your Learning Journey' : 'Product Management'}
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {isAuthenticated 
              ? `You've completed ${Math.round(progress.total_progress || 0)}% of the guide. Keep going!`
              : 'Master the art and science of building products that customers love. From fundamentals to AI-era strategies, become the PM your team needs.'
            }
          </p>
          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Interactive Learning
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Real-world Examples
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                AI-Enhanced
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                Framework-Based
              </Badge>
            </div>
          )}
          {!isAuthenticated && (
            <div className="mb-8">
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
              >
                Start Learning for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {learningPaths.map((path, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${path.color} text-white transition-all duration-300 group-hover:scale-110`}>
                    {path.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {path.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                  {path.title}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm leading-relaxed">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={path.path}>
                  <Button 
                    className="w-full group/btn bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300"
                    size="sm"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">50+</div>
              <div className="text-sm text-slate-600">Interactive Lessons</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">15+</div>
              <div className="text-sm text-slate-600">Practical Frameworks</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">30+</div>
              <div className="text-sm text-slate-600">Real Case Studies</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-600">Hands-on Learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;