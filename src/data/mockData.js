// Mock data for the Product Management Guide

export const mockData = {
  // PM Basics mock data
  pmRoles: [
    {
      id: 'strategy',
      title: 'Strategic Thinker',
      description: 'Define product vision, roadmap, and long-term goals',
      details: 'PMs must think beyond immediate features to understand market trends, competitive landscape, and long-term customer needs.'
    },
    {
      id: 'user-advocate',
      title: 'User Advocate', 
      description: 'Champion user needs and ensure customer-centricity',
      details: 'Represent the voice of the customer in all product decisions through research, feedback analysis, and user journey mapping.'
    }
  ],

  // Discovery mock data
  discoveryMethods: [
    {
      id: 'user-interviews',
      name: 'User Interviews',
      description: 'In-depth conversations with target users',
      effectiveness: 95,
      timeInvestment: 'High',
      insights: ['User motivations', 'Pain points', 'Workflows', 'Emotional responses']
    },
    {
      id: 'surveys',
      name: 'User Surveys',
      description: 'Quantitative data collection from larger groups',
      effectiveness: 75,
      timeInvestment: 'Medium',
      insights: ['Usage patterns', 'Feature preferences', 'Demographics', 'Satisfaction scores']
    }
  ],

  // Product Sense mock data
  productSenseExamples: [
    {
      id: 'feature-prioritization',
      scenario: 'You have 3 features to build but only resources for 1',
      options: [
        'Advanced analytics dashboard',
        'Mobile app optimization',
        'User onboarding improvements'
      ],
      correctAnswer: 2,
      reasoning: 'User onboarding improvements typically have the highest impact on user retention and product adoption.'
    }
  ],

  // Metrics mock data
  keyMetrics: [
    {
      category: 'Acquisition',
      metrics: [
        { name: 'Customer Acquisition Cost (CAC)', description: 'Cost to acquire one customer', formula: 'Marketing Spend / New Customers' },
        { name: 'Conversion Rate', description: 'Percentage of visitors who become customers', formula: 'Customers / Total Visitors × 100' }
      ]
    },
    {
      category: 'Engagement',
      metrics: [
        { name: 'Daily Active Users (DAU)', description: 'Unique users active each day', formula: 'Count of unique users per day' },
        { name: 'Session Duration', description: 'Average time users spend in the app', formula: 'Total Session Time / Number of Sessions' }
      ]
    },
    {
      category: 'Retention',
      metrics: [
        { name: 'Churn Rate', description: 'Percentage of customers who stop using the product', formula: 'Lost Customers / Total Customers × 100' },
        { name: 'Net Promoter Score (NPS)', description: 'Likelihood of users to recommend the product', formula: '% Promoters - % Detractors' }
      ]
    }
  ],

  // AI Era mock data
  aiUseCases: [
    {
      id: 'personalization',
      title: 'AI-Powered Personalization',
      description: 'Use machine learning to customize user experiences',
      examples: ['Netflix recommendations', 'Spotify playlists', 'Amazon product suggestions'],
      implementation: 'Collect user behavior data, train ML models, A/B test personalized experiences'
    },
    {
      id: 'automation',
      title: 'Process Automation',
      description: 'Automate repetitive tasks and workflows',
      examples: ['Customer support chatbots', 'Content moderation', 'Bug triaging'],
      implementation: 'Identify repetitive tasks, evaluate automation ROI, implement and monitor performance'
    }
  ],

  // Interactive Tools mock data
  frameworks: [
    {
      id: 'rice-prioritization',
      name: 'RICE Prioritization',
      description: 'Score features based on Reach, Impact, Confidence, and Effort',
      template: {
        reach: 'How many users will this impact?',
        impact: 'How much will it impact each user?',
        confidence: 'How confident are you in your estimates?',
        effort: 'How much work will this require?'
      }
    },
    {
      id: 'user-story-mapping',
      name: 'User Story Mapping',
      description: 'Visualize user journey and prioritize features',
      template: {
        activities: 'High-level user activities',
        tasks: 'Specific tasks within each activity',
        stories: 'Detailed user stories for each task'
      }
    }
  ],

  // Sample case studies
  caseStudies: [
    {
      id: 'netflix-recommendations',
      title: 'Netflix: Personalization Algorithm',
      challenge: 'Help users discover relevant content in a vast catalog',
      solution: 'AI-powered recommendation system based on viewing history and preferences',
      results: '80% of watched content comes from recommendations',
      lessons: ['Data quality is crucial', 'Start simple and iterate', 'User feedback improves accuracy']
    },
    {
      id: 'airbnb-trust',
      title: 'Airbnb: Building Trust',
      challenge: 'Enable strangers to trust each other enough to share homes',
      solution: 'Multi-layered trust system with reviews, verification, insurance',
      results: '4M+ hosts worldwide, $75B+ valuation',
      lessons: ['Trust is fundamental to marketplace success', 'Multiple trust signals needed', 'Community builds trust']
    }
  ]
};

// Utility functions for mock data
export const getMockMetrics = () => {
  return {
    userGrowth: [
      { month: 'Jan', users: 1000 },
      { month: 'Feb', users: 1200 },
      { month: 'Mar', users: 1800 },
      { month: 'Apr', users: 2400 },
      { month: 'May', users: 3200 },
      { month: 'Jun', users: 4100 }
    ],
    conversionFunnel: [
      { stage: 'Awareness', users: 10000, conversion: 100 },
      { stage: 'Interest', users: 5000, conversion: 50 },
      { stage: 'Consideration', users: 2000, conversion: 20 },
      { stage: 'Purchase', users: 400, conversion: 4 },
      { stage: 'Retention', users: 320, conversion: 3.2 }
    ]
  };
};

export const getRandomInsight = () => {
  const insights = [
    "70% of users drop off during onboarding - focus on simplification",
    "Mobile users have 40% higher engagement than desktop users",
    "Users who complete the tutorial have 3x better retention",
    "Feature A is used by 80% of power users but only 20% of casual users",
    "Customer support tickets decreased 30% after FAQ improvements"
  ];
  return insights[Math.floor(Math.random() * insights.length)];
};