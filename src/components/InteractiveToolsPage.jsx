import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { ArrowLeft, Calculator, FileText, Users, Target, Lightbulb, Download, Building2, AlertTriangle, Brain, Globe, BarChart3 } from 'lucide-react';

const InteractiveToolsPage = () => {
  const [activeTab, setActiveTab] = useState('rice');
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseData, setExerciseData] = useState({});
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

  // Template download functions
  const downloadFeatureSpecTemplate = () => {
    const template = `# FEATURE SPECIFICATION TEMPLATE

## 📋 Project Information
**Feature Name:** [Enter feature name]
**Product:** [Enter product name]
**PM Owner:** [Enter PM name]
**Engineering Lead:** [Enter engineering lead]
**Design Lead:** [Enter design lead]
**Date Created:** ${new Date().toLocaleDateString()}
**Last Updated:** ${new Date().toLocaleDateString()}

---

## 🎯 PROBLEM STATEMENT

### Problem Description
[Describe the specific problem this feature addresses]

### Target Users
- **Primary Users:** [Who is the main user group?]
- **Secondary Users:** [Any other affected user groups]

### Current State
[What's the current situation/pain point?]

### Desired Future State
[What do we want to achieve?]

### Business Impact
[Why is this important to the business?]

---

## 📊 SUCCESS METRICS

### Primary Metrics
- **Goal:** [Specific measurable outcome]
- **Current Baseline:** [Current performance]
- **Target:** [What we want to achieve]
- **Timeline:** [When we expect to achieve it]

### Secondary Metrics
- **Metric 1:** [Supporting measurement]
- **Metric 2:** [Supporting measurement]
- **Metric 3:** [Supporting measurement]

### Leading Indicators
- [Early signals of success]
- [Engagement metrics to watch]

---

## 👥 USER STORIES

### Epic
As a [user type], I want [goal] so that [benefit].

### Core User Stories
1. **As a** [user type]
   **I want** [functionality]
   **So that** [benefit]
   **Acceptance Criteria:**
   - [ ] [Specific testable requirement]
   - [ ] [Specific testable requirement]
   - [ ] [Specific testable requirement]

2. **As a** [user type]
   **I want** [functionality]
   **So that** [benefit]
   **Acceptance Criteria:**
   - [ ] [Specific testable requirement]
   - [ ] [Specific testable requirement]

3. **As a** [user type]
   **I want** [functionality]
   **So that** [benefit]
   **Acceptance Criteria:**
   - [ ] [Specific testable requirement]
   - [ ] [Specific testable requirement]

### Edge Cases & Error Handling
- **Story:** As a [user], I want [error handling] so that [recovery benefit]
- **Story:** As a [user], I want [edge case handling] so that [smooth experience]

---

## ✅ ACCEPTANCE CRITERIA

### Functional Requirements
- [ ] **Feature Behavior:** [How the feature should work]
- [ ] **User Interface:** [UI requirements and interactions]
- [ ] **Data Handling:** [How data is processed/stored]
- [ ] **Integration:** [How it works with existing features]
- [ ] **Performance:** [Speed/efficiency requirements]

### Non-Functional Requirements
- [ ] **Accessibility:** [WCAG compliance, screen readers, etc.]
- [ ] **Security:** [Data protection, authentication requirements]
- [ ] **Scalability:** [Performance under load]
- [ ] **Browser Support:** [Supported browsers/devices]
- [ ] **Mobile Responsiveness:** [Mobile experience requirements]

### Definition of Done
- [ ] Feature implemented per specifications
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] UI/UX review completed
- [ ] Accessibility review passed
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Stakeholder sign-off received

---

## 🔧 TECHNICAL REQUIREMENTS

### Architecture & Design
- **Frontend Components:** [List key components needed]
- **Backend Services:** [APIs, services, databases needed]
- **Third-party Integrations:** [External services/APIs]
- **Data Models:** [New/modified data structures]

### Technology Stack
- **Frontend:** [Technologies, frameworks, libraries]
- **Backend:** [Languages, frameworks, databases]
- **Infrastructure:** [Hosting, CDN, monitoring]

### API Specifications
\`\`\`
GET /api/[endpoint]
- Purpose: [What this endpoint does]
- Parameters: [Required parameters]
- Response: [Expected response format]

POST /api/[endpoint]
- Purpose: [What this endpoint does]
- Body: [Required request body]
- Response: [Expected response format]
\`\`\`

### Database Changes
- **New Tables:** [If any new tables needed]
- **Schema Changes:** [Modifications to existing tables]
- **Data Migration:** [Any data migration requirements]

### Performance Requirements
- **Load Time:** [Maximum acceptable load time]
- **Response Time:** [API response time requirements]
- **Throughput:** [Requests per second requirements]
- **Concurrent Users:** [Maximum concurrent user support]

---

## ⚠️ RISK ASSESSMENT

### Technical Risks
| Risk | Impact | Probability | Mitigation Strategy |
|------|---------|-------------|-------------------|
| [Technical risk 1] | High/Med/Low | High/Med/Low | [How to address] |
| [Technical risk 2] | High/Med/Low | High/Med/Low | [How to address] |

### Business Risks
| Risk | Impact | Probability | Mitigation Strategy |
|------|---------|-------------|-------------------|
| [Business risk 1] | High/Med/Low | High/Med/Low | [How to address] |
| [Business risk 2] | High/Med/Low | High/Med/Low | [How to address] |

### Dependencies & Blockers
- **External Dependencies:** [Third-party services, other teams]
- **Internal Dependencies:** [Other features, infrastructure]
- **Resource Dependencies:** [People, tools, budget]

### Rollback Plan
- **Rollback Triggers:** [When to rollback]
- **Rollback Process:** [How to rollback safely]
- **Data Recovery:** [How to handle data in rollback]

---

## 📅 IMPLEMENTATION PLAN

### Phase 1: Foundation
- [ ] [Core infrastructure/setup]
- [ ] [Basic functionality]
- **Timeline:** [Estimated timeline]

### Phase 2: Core Features
- [ ] [Main feature implementation]
- [ ] [Integration with existing systems]
- **Timeline:** [Estimated timeline]

### Phase 3: Polish & Launch
- [ ] [UI/UX refinements]
- [ ] [Performance optimization]
- [ ] [Launch preparation]
- **Timeline:** [Estimated timeline]

### Milestones
- **Milestone 1:** [Description] - [Date]
- **Milestone 2:** [Description] - [Date]
- **Milestone 3:** [Description] - [Date]

---

## 🧪 TESTING STRATEGY

### Testing Types
- [ ] **Unit Testing:** [Component-level testing]
- [ ] **Integration Testing:** [System integration testing]
- [ ] **End-to-End Testing:** [User journey testing]
- [ ] **Performance Testing:** [Load and stress testing]
- [ ] **Security Testing:** [Vulnerability testing]
- [ ] **Accessibility Testing:** [A11y compliance testing]

### Test Scenarios
1. **Happy Path:** [Normal user flow]
2. **Edge Cases:** [Boundary conditions]
3. **Error Handling:** [Error scenarios]
4. **Integration:** [Cross-system functionality]

---

## 📞 STAKEHOLDERS & COMMUNICATION

### Key Stakeholders
- **Product Owner:** [Name and role]
- **Engineering Team:** [Team lead and key developers]
- **Design Team:** [Designer(s) involved]
- **QA Team:** [QA lead]
- **Business Stakeholders:** [Key business contacts]

### Communication Plan
- **Status Updates:** [Frequency and format]
- **Review Sessions:** [When and with whom]
- **Decision Points:** [Key decision milestones]

---

## 📚 APPENDIX

### Research & References
- [Link to user research]
- [Link to competitive analysis]
- [Link to technical documentation]

### Design Assets
- [Link to wireframes]
- [Link to mockups]
- [Link to design system]

### Related Documents
- [Link to PRD]
- [Link to technical specs]
- [Link to project roadmap]

---

*Template generated by PM Guide - Product Management Learning Platform*
*Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}*`;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Feature_Specification_Template_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadUserInterviewGuide = () => {
    const template = `# USER INTERVIEW GUIDE TEMPLATE

## 📋 Interview Information
**Product/Feature:** [Enter product or feature name]
**Research Question:** [What are you trying to learn?]
**Interviewer:** [Your name]
**Interview Date:** ${new Date().toLocaleDateString()}
**Interview Duration:** [Planned duration, e.g., 45 minutes]
**Participant ID:** [Anonymous identifier, e.g., P001]

---

## 🎯 INTERVIEW OBJECTIVES

### Primary Research Goals
- **Goal 1:** [What you want to understand]
- **Goal 2:** [What you want to validate]
- **Goal 3:** [What problems you're exploring]

### Success Criteria
- [ ] Understand user's current workflow
- [ ] Identify pain points and frustrations
- [ ] Validate/invalidate assumptions
- [ ] Discover unmet needs
- [ ] Understand user's context and environment

### Key Questions to Answer
1. [Research question 1]
2. [Research question 2]
3. [Research question 3]

---

## 👤 PARTICIPANT BACKGROUND

### Demographics
- **Age Range:** [e.g., 25-35]
- **Role/Title:** [Job title or role]
- **Company Size:** [Startup, SMB, Enterprise]
- **Industry:** [Industry sector]
- **Experience Level:** [Beginner, Intermediate, Advanced]

### Screening Questions (Pre-Interview)
- [ ] Do you currently use [product category] in your work?
- [ ] How often do you [relevant behavior/task]?
- [ ] Have you experienced [specific problem] in the last 6 months?
- [ ] Are you involved in [decision-making process]?

### Context Questions
- What does a typical day look like for you?
- What tools do you currently use for [relevant task]?
- Who else is involved in this process?

---

## 🔥 WARM-UP QUESTIONS

### Ice Breakers (5 minutes)
1. **"Tell me about your role and what you do day-to-day."**
   - *Purpose: Get them talking, understand their context*
   - *Follow-up: "What's the most challenging part of your job?"*

2. **"How long have you been in this role/industry?"**
   - *Purpose: Understand their experience level*
   - *Follow-up: "How has [relevant area] changed since you started?"*

3. **"What does success look like for you in your role?"**
   - *Purpose: Understand their goals and motivations*
   - *Follow-up: "What metrics or outcomes matter most?"*

### Current State Questions
- Walk me through how you currently [do relevant task]
- What tools or processes do you use today?
- Who else is involved in this workflow?

---

## 💡 CORE QUESTIONS

### Problem Discovery
1. **"Tell me about the last time you had to [relevant task/situation]."**
   - *Probe: What made that challenging?*
   - *Probe: How did you work around it?*
   - *Probe: What would have made it easier?*

2. **"What's the most frustrating part about [current process/tool]?"**
   - *Probe: How often does this happen?*
   - *Probe: What's the impact when this goes wrong?*
   - *Probe: How do you handle it today?*

3. **"If you could wave a magic wand and fix one thing about [area], what would it be?"**
   - *Probe: Why is that the most important?*
   - *Probe: What would change if that was fixed?*

### Workflow & Context
4. **"Walk me through your typical [process/workflow] from start to finish."**
   - *Probe: Where do you usually get stuck?*
   - *Probe: Which steps take the most time?*
   - *Probe: What information do you need at each step?*

5. **"Who else is involved in this process?"**
   - *Probe: How do you collaborate with them?*
   - *Probe: Where do handoffs happen?*
   - *Probe: What causes confusion or delays?*

### Needs & Motivations
6. **"What would need to happen for you to consider changing your current approach?"**
   - *Probe: What would convince you to try something new?*
   - *Probe: What concerns would you have?*
   - *Probe: Who else would need to be involved in that decision?*

7. **"How do you currently measure success for [relevant activity]?"**
   - *Probe: What metrics matter most?*
   - *Probe: How do you track progress?*
   - *Probe: What happens when things go off track?*

### Solution Validation (if applicable)
8. **"How does this compare to your current approach?" [Show concept/prototype]**
   - *Probe: What stands out to you?*
   - *Probe: What questions does this raise?*
   - *Probe: Where would this fit in your workflow?*

9. **"What concerns would you have about using something like this?"**
   - *Probe: What would need to change for you to adopt this?*
   - *Probe: What might prevent you from using this?*

---

## 🎬 WRAP-UP & NEXT STEPS

### Closing Questions (5 minutes)
1. **"What haven't I asked about that's important for me to understand?"**
   - *Often reveals the most important insights*

2. **"If you were building a solution for this problem, what would you focus on first?"**
   - *Understand their priorities*

3. **"Who else should I talk to who has a different perspective on this?"**
   - *Identify additional research participants*

4. **"Would you be open to a follow-up conversation as we develop ideas?"**
   - *Build ongoing research relationship*

### Thank You & Next Steps
- [ ] Thank participant for their time
- [ ] Explain next steps in research process
- [ ] Offer to share insights when available
- [ ] Exchange contact information if appropriate
- [ ] Send follow-up thank you email within 24 hours

---

## 📝 INTERVIEW NOTES TEMPLATE

### Key Insights
**Most Important Finding:**
[What was the biggest insight?]

**Surprising Discovery:**
[What didn't you expect to learn?]

**Validated Assumptions:**
- [Assumption 1: ✓ Confirmed]
- [Assumption 2: ✗ Rejected]

### Quotes & Stories
**Memorable Quotes:**
- "[Direct quote that captures key insight]"
- "[Quote about pain point or need]"
- "[Quote about current workaround]"

**User Stories:**
- [Specific scenario or example they shared]
- [Problem situation they described]
- [Success story or positive outcome]

### Pain Points Identified
1. **[Pain Point 1]**
   - *Frequency:* [How often this happens]
   - *Impact:* [Business/personal impact]
   - *Current Workaround:* [How they handle it today]

2. **[Pain Point 2]**
   - *Frequency:* [How often this happens]
   - *Impact:* [Business/personal impact]
   - *Current Workaround:* [How they handle it today]

### Opportunities Discovered
- [Unmet need or opportunity]
- [Process improvement possibility]
- [Integration or automation opportunity]

### Workflow Mapping
**Current Process:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
*[Note pain points and inefficiencies at each step]*

**Key Tools Used:**
- [Tool 1: Purpose and satisfaction level]
- [Tool 2: Purpose and satisfaction level]

### Follow-up Actions
- [ ] [Research question to explore further]
- [ ] [Assumption to test with other users]
- [ ] [Feature/solution idea to validate]
- [ ] [Additional participant type to interview]

---

## 🎯 POST-INTERVIEW ANALYSIS

### Research Questions Answered
**Q: [Research question 1]**
A: [What you learned]

**Q: [Research question 2]**
A: [What you learned]

### Hypothesis Testing
**Hypothesis:** [Original assumption]
**Result:** [Validated/Invalidated/Partially validated]
**Evidence:** [What evidence supports this conclusion]

### Personas & Jobs-to-be-Done
**User Type:** [How this participant fits existing personas]
**Job-to-be-Done:** [What job are they hiring a solution for?]
**Outcome Expectations:** [What success looks like to them]

### Priority Insights
**High Priority:**
- [Insight that impacts roadmap decisions]
- [Finding that affects core value proposition]

**Medium Priority:**
- [Useful insight for feature prioritization]
- [Understanding that improves user experience]

**Low Priority:**
- [Interesting but not immediately actionable]

---

## 📊 INTERVIEW SYNTHESIS

### Patterns Across Interviews
*[Complete after multiple interviews]*

**Consistent Themes:**
- [Theme 1: Appears in X out of Y interviews]
- [Theme 2: Appears in X out of Y interviews]

**Divergent Perspectives:**
- [Where different user types have different needs]
- [Conflicting feedback to investigate further]

### Segmentation Insights
**Segment A:** [Characteristics and needs]
**Segment B:** [Characteristics and needs]
**Segment C:** [Characteristics and needs]

### Roadmap Implications
**Immediate Actions:**
- [What to prioritize based on research]
- [Quick wins identified]

**Future Investigations:**
- [Areas needing more research]
- [Hypotheses to test in next iteration]

---

## 📚 APPENDIX

### Research Methodology
- **Interview Type:** [Structured/Semi-structured/Unstructured]
- **Duration:** [Actual duration]
- **Recording:** [Yes/No, with permission]
- **Analysis Method:** [How insights were extracted]

### Participant Consent
- [ ] Verbal consent for recording
- [ ] Permission to use quotes (anonymized)
- [ ] Consent for follow-up contact
- [ ] Agreement to research participation terms

### Additional Resources
- [Link to recording/transcript]
- [Link to research repository]
- [Link to participant database]
- [Link to synthesis document]

---

*Template generated by PM Guide - Product Management Learning Platform*
*Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}*`;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `User_Interview_Guide_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCompetitiveAnalysis = () => {
    const template = `# COMPETITIVE ANALYSIS FRAMEWORK

## 📋 Analysis Information
**Analysis Date:** ${new Date().toLocaleDateString()}
**Analyst:** [Your name]
**Product/Feature:** [What you're analyzing]
**Analysis Scope:** [Market segment, geographic region, etc.]
**Analysis Purpose:** [Strategic planning, feature development, positioning, etc.]

---

## 🎯 ANALYSIS OBJECTIVES

### Primary Goals
- **Strategic Goal 1:** [e.g., Understand market positioning opportunities]
- **Strategic Goal 2:** [e.g., Identify feature gaps and opportunities]
- **Strategic Goal 3:** [e.g., Validate pricing strategy]

### Key Questions to Answer
1. Who are our main competitors and how do they position themselves?
2. What features/capabilities do they offer that we don't?
3. What are their pricing models and value propositions?
4. Where are the gaps in the market we could exploit?
5. What are their strengths and weaknesses?

### Success Criteria
- [ ] Complete competitive landscape mapping
- [ ] Identify top 3-5 direct competitors
- [ ] Understand feature differentiation opportunities
- [ ] Validate or adjust our positioning strategy
- [ ] Inform product roadmap priorities

---

## 🏢 COMPETITOR OVERVIEW

### Direct Competitors
**Competitor 1: [Company Name]**
- **Founded:** [Year]
- **Funding:** [Funding stage and amount]
- **Employees:** [Company size]
- **HQ Location:** [Location]
- **Public/Private:** [Status]
- **Market Focus:** [Primary market/segment]

**Competitor 2: [Company Name]**
- **Founded:** [Year]
- **Funding:** [Funding stage and amount]
- **Employees:** [Company size]
- **HQ Location:** [Location]
- **Public/Private:** [Status]
- **Market Focus:** [Primary market/segment]

**Competitor 3: [Company Name]**
- **Founded:** [Year]
- **Funding:** [Funding stage and amount]
- **Employees:** [Company size]
- **HQ Location:** [Location]
- **Public/Private:** [Status]
- **Market Focus:** [Primary market/segment]

### Indirect Competitors
- **[Alternative Solution 1]:** [How users might solve the problem differently]
- **[Alternative Solution 2]:** [Adjacent products that compete for user attention]
- **[Manual Process]:** [What users do without any product solution]

---

## 🔍 FEATURE COMPARISON

### Core Features Matrix

| Feature | Our Product | Competitor 1 | Competitor 2 | Competitor 3 | Market Standard |
|---------|-------------|--------------|--------------|--------------|-----------------|
| [Core Feature 1] | ✅ Advanced | ✅ Basic | ❌ None | ✅ Advanced | Advanced |
| [Core Feature 2] | ✅ Basic | ✅ Advanced | ✅ Basic | ✅ Advanced | Basic |
| [Core Feature 3] | ❌ None | ✅ Basic | ✅ Advanced | ❌ None | Basic |
| [Feature 4] | ✅ Advanced | ❌ None | ✅ Basic | ✅ Basic | Basic |
| [Feature 5] | ✅ Basic | ✅ Basic | ✅ Advanced | ✅ Advanced | Advanced |

**Legend:**
- ✅ Advanced = Best-in-class implementation
- ✅ Basic = Functional but limited implementation  
- ❌ None = Feature not available

### Feature Gaps Analysis
**Our Advantages:**
- [Feature we do better than competitors]
- [Unique capability only we have]
- [Superior implementation of common feature]

**Our Gaps:**
- [Important feature we're missing]
- [Feature where we're behind competitors]
- [Emerging capability we need to develop]

**Market Opportunities:**
- [Feature gap across all competitors]
- [Underserved use case or user segment]
- [Emerging trend no one is addressing well]

---

## 💰 PRICING ANALYSIS

### Pricing Models Overview

**Our Pricing:**
- **Free Tier:** [What's included]
- **Paid Tier 1:** $[price]/[period] - [What's included]
- **Paid Tier 2:** $[price]/[period] - [What's included]
- **Enterprise:** [Custom pricing approach]

**Competitor 1 Pricing:**
- **Free Tier:** [What's included]
- **Paid Tier 1:** $[price]/[period] - [What's included]
- **Paid Tier 2:** $[price]/[period] - [What's included]
- **Enterprise:** [Custom pricing approach]

**Competitor 2 Pricing:**
- **Free Tier:** [What's included]
- **Paid Tier 1:** $[price]/[period] - [What's included]
- **Paid Tier 2:** $[price]/[period] - [What's included]
- **Enterprise:** [Custom pricing approach]

### Pricing Strategy Analysis
**Value-Based Pricing:**
- [How competitors justify their pricing]
- [What value metrics they use]
- [How they package features across tiers]

**Market Position:**
- **Premium:** [Which competitors position as premium and why]
- **Mid-Market:** [Which competitors target mid-market]
- **Budget:** [Which competitors compete on price]

**Pricing Insights:**
- [Key insights about competitor pricing strategies]
- [Opportunities for our pricing optimization]
- [Market pricing trends and patterns]

---

## 👥 USER EXPERIENCE REVIEW

### Product Onboarding
**Our Experience:**
- **Time to Value:** [How long to first success]
- **Setup Complexity:** [Simple/Medium/Complex]
- **Guidance Provided:** [Tutorial, tooltips, documentation]
- **Key Strengths:** [What we do well]
- **Key Weaknesses:** [What needs improvement]

**Competitor 1 Experience:**
- **Time to Value:** [How long to first success]
- **Setup Complexity:** [Simple/Medium/Complex]
- **Guidance Provided:** [Tutorial, tooltips, documentation]
- **Key Strengths:** [What they do well]
- **Key Weaknesses:** [Areas for improvement]

### Core User Flow Analysis
**Task: [Important user task]**

| Competitor | Steps Required | Time to Complete | Ease of Use (1-5) | Notes |
|------------|----------------|------------------|-------------------|-------|
| Our Product | [Number] | [Minutes] | [Rating] | [Key observations] |
| Competitor 1 | [Number] | [Minutes] | [Rating] | [Key observations] |
| Competitor 2 | [Number] | [Minutes] | [Rating] | [Key observations] |

### Interface & Design
**Design Quality Assessment:**
- **Our Product:** [Modern/Dated, Clean/Cluttered, Intuitive/Confusing]
- **Competitor 1:** [Assessment]
- **Competitor 2:** [Assessment]

**Mobile Experience:**
- **Our Product:** [Native app/Web responsive/None]
- **Competitor 1:** [Assessment]
- **Competitor 2:** [Assessment]

---

## 💪 STRENGTHS & WEAKNESSES

### SWOT Analysis Matrix

**Our Product**
- **Strengths:**
  - [Key competitive advantage]
  - [Superior feature or capability]
  - [Unique positioning or value prop]
  
- **Weaknesses:**
  - [Area where we lag behind]
  - [Missing important feature]
  - [Resource or capability constraint]
  
- **Opportunities:**
  - [Market gap we could fill]
  - [Emerging trend we could lead]
  - [Partnership or integration opportunity]
  
- **Threats:**
  - [Competitor advantage that threatens us]
  - [Market trend that could hurt us]
  - [New entrant or technology disruption]

**Competitor 1**
- **Strengths:** [What they do exceptionally well]
- **Weaknesses:** [Where they're vulnerable]
- **Market Position:** [How they're positioned]
- **Likely Strategy:** [What they're probably planning]

**Competitor 2**
- **Strengths:** [What they do exceptionally well]
- **Weaknesses:** [Where they're vulnerable]
- **Market Position:** [How they're positioned]
- **Likely Strategy:** [What they're probably planning]

---

## 📈 STRATEGIC IMPLICATIONS

### Market Positioning Opportunities
**Blue Ocean Opportunities:**
- [Uncontested market space we could create]
- [Customer segment underserved by current solutions]
- [Value proposition gap in the market]

**Differentiation Strategies:**
- [How we could position differently from competitors]
- [Unique value proposition we could develop]
- [Market segment we could own]

### Product Roadmap Implications
**High Priority Features:**
- [Feature that would give us competitive advantage]
- [Capability needed to match market standard]
- [Innovation opportunity to leapfrog competitors]

**Pricing Strategy Recommendations:**
- [How we should position our pricing]
- [Pricing model optimizations to consider]
- [Value packaging improvements]

**Go-to-Market Insights:**
- [Marketing messages that would differentiate us]
- [Customer segments to target or avoid]
- [Partnership opportunities to consider]

---

## 🎭 COMPETITIVE INTELLIGENCE

### Recent Developments
**Competitor 1 Recent Activity:**
- [Recent funding, feature launches, partnerships]
- [Leadership changes or strategic announcements]
- [Customer wins or losses]

**Competitor 2 Recent Activity:**
- [Recent funding, feature launches, partnerships]
- [Leadership changes or strategic announcements]
- [Customer wins or losses]

### Market Trends & Signals
**Technology Trends:**
- [Emerging technologies affecting the space]
- [Platform shifts or integration trends]
- [Performance or capability improvements]

**Customer Behavior Trends:**
- [How customer needs are evolving]
- [New use cases or requirements emerging]
- [Buyer behavior or decision criteria changes]

**Competitive Landscape Evolution:**
- [New entrants to monitor]
- [Consolidation or acquisition activity]
- [Market share shifts]

---

## 📊 COMPETITIVE MONITORING PLAN

### Ongoing Intelligence Gathering
**Weekly Monitoring:**
- [ ] Competitor website and product updates
- [ ] Social media and content marketing activity
- [ ] Job postings for strategic role insights
- [ ] Customer review and feedback analysis

**Monthly Deep Dives:**
- [ ] Feature comparison updates
- [ ] Pricing model changes
- [ ] Customer case studies and wins
- [ ] Product roadmap signals

**Quarterly Strategic Reviews:**
- [ ] Market position assessment
- [ ] Competitive threats evaluation
- [ ] Strategic response planning
- [ ] Product roadmap adjustments

### Information Sources
**Primary Sources:**
- [Competitor websites and product demos]
- [Customer interviews and feedback]
- [Direct product testing and trials]
- [Industry analyst reports]

**Secondary Sources:**
- [News and press releases]
- [Social media and content analysis]
- [Employee LinkedIn activity]
- [Patent filings and technical publications]

---

## 🎯 ACTION ITEMS & RECOMMENDATIONS

### Immediate Actions (Next 30 Days)
- [ ] [Specific competitive response needed]
- [ ] [Feature gap to address urgently]
- [ ] [Pricing adjustment to consider]
- [ ] [Marketing message refinement]

### Short-term Strategy (Next Quarter)
- [ ] [Product development priority]
- [ ] [Go-to-market strategy adjustment]
- [ ] [Partnership or integration to pursue]
- [ ] [Customer segment to focus on]

### Long-term Strategic Moves (Next Year)
- [ ] [Major product investment or pivot]
- [ ] [Market expansion opportunity]
- [ ] [Competitive moat to build]
- [ ] [Technology bet to make]

### Success Metrics
**How We'll Measure Success:**
- [Market share or competitive win metrics]
- [Feature adoption or customer feedback scores]
- [Pricing or revenue impact measures]
- [Brand perception or positioning metrics]

---

## 📚 APPENDIX

### Research Methodology
**Analysis Period:** [Date range of research]
**Data Sources:** [List of all sources used]
**Analysis Framework:** [Methodology followed]
**Confidence Level:** [How confident in findings]

### Detailed Feature Comparison
[Expanded feature-by-feature comparison]

### Pricing Research Details
[Detailed pricing research and calculations]

### User Testing Results
[Results from testing competitor products]

### Additional Resources
- [Links to competitor analysis tools used]
- [Industry reports referenced]
- [Customer interview insights]
- [Market research data]

---

*Template generated by PM Guide - Product Management Learning Platform*
*Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}*`;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Competitive_Analysis_Framework_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProductLaunchChecklist = () => {
    const template = `# PRODUCT LAUNCH CHECKLIST

## 📋 Launch Information
**Product/Feature Name:** [Enter product or feature name]
**Launch Date:** [Target launch date]
**Launch Type:** [Major Release / Minor Update / Feature Launch / Beta Launch]
**Launch Owner:** [PM responsible]
**Cross-functional Team:** [Engineering, Design, Marketing, Sales, Support]
**Last Updated:** ${new Date().toLocaleDateString()}

---

## 🎯 LAUNCH OVERVIEW

### Launch Goals & Success Metrics
**Primary Goals:**
- **Goal 1:** [Specific measurable outcome]
- **Goal 2:** [Specific measurable outcome]
- **Goal 3:** [Specific measurable outcome]

**Success Metrics:**
- **Adoption:** [Target adoption rate or user count]
- **Engagement:** [Usage frequency or depth metrics]
- **Business Impact:** [Revenue, retention, or efficiency goals]
- **Feedback:** [Customer satisfaction or NPS targets]

### Target Audience
- **Primary Users:** [Main user segment]
- **Secondary Users:** [Additional user groups]
- **Geographic Scope:** [Regions or markets included]
- **Customer Segments:** [Enterprise, SMB, Consumer, etc.]

---

## 📅 PRE-LAUNCH PREPARATION

### Product Development (Complete 2-4 weeks before launch)
- [ ] **Core functionality implemented and tested**
  - [ ] All planned features developed
  - [ ] Integration testing completed
  - [ ] Performance testing passed
  - [ ] Security review completed

- [ ] **Quality assurance completed**
  - [ ] Unit tests written and passing (>90% coverage)
  - [ ] Integration tests passing
  - [ ] End-to-end testing completed
  - [ ] Regression testing passed
  - [ ] Browser/device compatibility verified

- [ ] **User acceptance testing**
  - [ ] Internal stakeholder testing completed
  - [ ] Beta user testing conducted (if applicable)
  - [ ] Feedback incorporated or documented
  - [ ] User experience validation completed

- [ ] **Technical infrastructure ready**
  - [ ] Production environment configured
  - [ ] Monitoring and alerting set up
  - [ ] Backup and recovery procedures tested
  - [ ] Scalability tested for expected load
  - [ ] CDN and performance optimization configured

### Documentation & Training
- [ ] **User-facing documentation**
  - [ ] Feature documentation written
  - [ ] Help articles created or updated
  - [ ] Video tutorials produced (if needed)
  - [ ] FAQ section prepared
  - [ ] Release notes drafted

- [ ] **Internal documentation**
  - [ ] Technical documentation updated
  - [ ] API documentation current
  - [ ] Troubleshooting guides created
  - [ ] Known issues documented
  - [ ] Rollback procedures documented

- [ ] **Team training completed**
  - [ ] Customer support team trained
  - [ ] Sales team educated on new features
  - [ ] Marketing team briefed on positioning
  - [ ] Customer success team prepared

---

## 📢 MARKETING & COMMUNICATIONS

### Content Creation (Complete 1-2 weeks before launch)
- [ ] **Marketing materials**
  - [ ] Product announcement blog post written
  - [ ] Feature overview page created
  - [ ] Demo videos produced
  - [ ] Screenshots and visuals prepared
  - [ ] Case studies or customer stories ready

- [ ] **Sales enablement**
  - [ ] Sales deck updated with new features
  - [ ] Competitive positioning materials prepared
  - [ ] Pricing information updated
  - [ ] Demo scripts and talking points created
  - [ ] ROI calculator or value props documented

- [ ] **Communication assets**
  - [ ] Email announcement templates
  - [ ] Social media post content
  - [ ] Press release (if applicable)
  - [ ] Partner communication materials
  - [ ] Customer newsletter content

### Channel Preparation
- [ ] **Website updates**
  - [ ] Product pages updated
  - [ ] Navigation and menus updated
  - [ ] SEO optimization completed
  - [ ] Analytics tracking implemented
  - [ ] A/B tests configured (if applicable)

- [ ] **External channels**
  - [ ] App store listings updated (if applicable)
  - [ ] Third-party integrations notified
  - [ ] Partner portals updated
  - [ ] Review sites and directories updated

---

## 🛠️ TECHNICAL READINESS

### Infrastructure & Operations (Complete 1 week before launch)
- [ ] **Production deployment**
  - [ ] Code deployed to production
  - [ ] Database migrations executed
  - [ ] Feature flags configured
  - [ ] A/B testing framework ready
  - [ ] Rollback plan tested and ready

- [ ] **Monitoring & observability**
  - [ ] Application monitoring configured
  - [ ] Error tracking and alerting set up
  - [ ] Performance dashboards created
  - [ ] User analytics tracking implemented
  - [ ] Business metrics tracking ready

- [ ] **Security & compliance**
  - [ ] Security review completed
  - [ ] Privacy impact assessment done
  - [ ] Compliance requirements verified
  - [ ] Data protection measures in place
  - [ ] Audit trails configured

### Support Infrastructure
- [ ] **Customer support preparation**
  - [ ] Support ticket categories updated
  - [ ] Escalation procedures documented
  - [ ] Support team access to new features
  - [ ] Bug reporting process established
  - [ ] Customer feedback collection ready

- [ ] **Analytics & reporting**
  - [ ] Launch metrics dashboard created
  - [ ] Automated reporting configured
  - [ ] Data export capabilities ready
  - [ ] Success metrics tracking validated
  - [ ] A/B testing results tracking ready

---

## 📈 LAUNCH DAY EXECUTION

### Go-Live Activities (Launch day)
- [ ] **Technical launch**
  - [ ] Feature flags enabled
  - [ ] Production deployment verified
  - [ ] Monitoring systems checked
  - [ ] Performance baseline established
  - [ ] Error rates within acceptable limits

- [ ] **Communication rollout**
  - [ ] Internal teams notified of go-live
  - [ ] Customer announcement sent
  - [ ] Blog post published
  - [ ] Social media posts scheduled
  - [ ] Press release distributed (if applicable)

- [ ] **Stakeholder notifications**
  - [ ] Executive team updated
  - [ ] Customer success team alerted
  - [ ] Sales team notified
  - [ ] Support team ready for inquiries
  - [ ] Partner ecosystem informed

### Launch Day Monitoring
- [ ] **Technical monitoring**
  - [ ] System performance tracking
  - [ ] Error rate monitoring
  - [ ] User adoption tracking
  - [ ] Feature usage analytics
  - [ ] Support ticket volume monitoring

- [ ] **Business monitoring**
  - [ ] User engagement metrics
  - [ ] Conversion rate tracking
  - [ ] Customer feedback collection
  - [ ] Sales inquiry monitoring
  - [ ] Revenue impact tracking

---

## 📊 POST-LAUNCH ACTIVITIES

### Immediate Follow-up (First 24-48 hours)
- [ ] **Performance assessment**
  - [ ] Technical performance review
  - [ ] User adoption analysis
  - [ ] Error and issue investigation
  - [ ] Customer feedback summary
  - [ ] Support ticket review

- [ ] **Issue response**
  - [ ] Critical issues addressed
  - [ ] User experience problems resolved
  - [ ] Performance optimization implemented
  - [ ] Communication about known issues
  - [ ] Hot fixes deployed if needed

### Week 1 Post-Launch
- [ ] **Success metrics review**
  - [ ] Adoption rate vs. targets
  - [ ] Engagement metrics analysis
  - [ ] Business impact assessment
  - [ ] Customer satisfaction measurement
  - [ ] Competitive response monitoring

- [ ] **Optimization activities**
  - [ ] A/B testing results analysis
  - [ ] User behavior analysis
  - [ ] Performance optimization
  - [ ] Feature usage optimization
  - [ ] Conversion funnel analysis

### 30-Day Post-Launch Review
- [ ] **Comprehensive analysis**
  - [ ] Launch success criteria evaluation
  - [ ] ROI and business impact calculation
  - [ ] Customer feedback synthesis
  - [ ] Team performance review
  - [ ] Process improvement identification

- [ ] **Strategic planning**
  - [ ] Next iteration planning
  - [ ] Feature enhancement roadmap
  - [ ] Market expansion opportunities
  - [ ] Lessons learned documentation
  - [ ] Success story development

---

## 🚨 RISK MANAGEMENT & CONTINGENCY

### Launch Risks & Mitigation
**Technical Risks:**
- **Risk:** [Server overload during launch]
  - **Probability:** High/Medium/Low
  - **Impact:** High/Medium/Low
  - **Mitigation:** [Auto-scaling, load testing, capacity planning]
  - **Contingency:** [Manual scaling, traffic throttling]

- **Risk:** [Critical bug discovered post-launch]
  - **Probability:** High/Medium/Low
  - **Impact:** High/Medium/Low
  - **Mitigation:** [Extensive testing, staged rollout]
  - **Contingency:** [Rollback plan, hot fix process]

**Business Risks:**
- **Risk:** [Poor user adoption]
  - **Probability:** High/Medium/Low
  - **Impact:** High/Medium/Low
  - **Mitigation:** [User research, beta testing]
  - **Contingency:** [Enhanced onboarding, feature iteration]

- **Risk:** [Negative customer feedback]
  - **Probability:** High/Medium/Low
  - **Impact:** High/Medium/Low
  - **Mitigation:** [User testing, feedback loops]
  - **Contingency:** [Communication plan, rapid improvements]

### Rollback Plan
- [ ] **Rollback triggers defined**
  - [ ] Performance degradation thresholds
  - [ ] Error rate limits
  - [ ] Customer impact criteria
  - [ ] Business metric thresholds

- [ ] **Rollback procedures tested**
  - [ ] Technical rollback process
  - [ ] Database rollback capability
  - [ ] Feature flag disable process
  - [ ] Communication templates ready

---

## 📞 COMMUNICATION PLAN

### Internal Communication
**Launch Day Communication:**
- **9:00 AM:** Launch go/no-go decision
- **10:00 AM:** Technical deployment complete
- **11:00 AM:** Marketing announcement live
- **12:00 PM:** Lunch hour performance check
- **3:00 PM:** Afternoon metrics review
- **6:00 PM:** End-of-day summary
- **Next Day:** 24-hour post-launch review

**Stakeholder Updates:**
- **Executives:** [Frequency and format]
- **Engineering Team:** [Real-time Slack updates]
- **Sales Team:** [Daily email summaries]
- **Support Team:** [Immediate issue alerts]
- **Marketing Team:** [Performance metrics updates]

### External Communication
**Customer Communication Timeline:**
- **Pre-launch:** [Announcement and education]
- **Launch Day:** [Go-live notification]
- **Week 1:** [Usage tips and success stories]
- **Week 2:** [Feedback request and optimization updates]
- **Month 1:** [Success metrics and roadmap preview]

**Channel Strategy:**
- **Email:** [Primary announcement channel]
- **In-app:** [Feature discovery and onboarding]
- **Social Media:** [Awareness and engagement]
- **Blog/Website:** [Detailed information and SEO]
- **Partners:** [B2B communication and enablement]

---

## 📋 LAUNCH TEAM ROLES & RESPONSIBILITIES

### Core Launch Team
**Launch Owner (PM):**
- [ ] Overall launch coordination
- [ ] Go/no-go decision making
- [ ] Stakeholder communication
- [ ] Success metrics tracking
- [ ] Issue escalation management

**Engineering Lead:**
- [ ] Technical deployment execution
- [ ] Production monitoring
- [ ] Performance optimization
- [ ] Issue resolution
- [ ] Rollback execution if needed

**Design Lead:**
- [ ] User experience validation
- [ ] Design asset preparation
- [ ] Usability monitoring
- [ ] Interface optimization
- [ ] User feedback analysis

**Marketing Lead:**
- [ ] Launch announcement execution
- [ ] Content publishing
- [ ] Channel activation
- [ ] Performance tracking
- [ ] Customer communication

**Sales Lead:**
- [ ] Sales team enablement
- [ ] Customer inquiry handling
- [ ] Revenue impact tracking
- [ ] Competitive positioning
- [ ] Customer feedback collection

**Support Lead:**
- [ ] Support team preparation
- [ ] Issue tracking and resolution
- [ ] Customer satisfaction monitoring
- [ ] Escalation handling
- [ ] Knowledge base updates

### Extended Team
**Customer Success:**
- [ ] Customer onboarding optimization
- [ ] Usage adoption tracking
- [ ] Success story identification
- [ ] Expansion opportunity identification

**Data/Analytics:**
- [ ] Metrics dashboard maintenance
- [ ] Performance analysis
- [ ] User behavior insights
- [ ] Business impact measurement

---

## 📈 SUCCESS MEASUREMENT

### Key Performance Indicators
**Technical KPIs:**
- **System Performance:** [Response time, uptime, error rates]
- **Scalability:** [Concurrent users, throughput]
- **Reliability:** [Availability, mean time to recovery]

**User KPIs:**
- **Adoption:** [Active users, feature usage rate]
- **Engagement:** [Session duration, feature interaction]
- **Satisfaction:** [NPS score, support ticket sentiment]

**Business KPIs:**
- **Revenue:** [New revenue, expansion revenue]
- **Efficiency:** [Cost savings, productivity gains]
- **Growth:** [User acquisition, market share]

### Reporting Schedule
**Daily Reports (First Week):**
- [ ] Technical performance summary
- [ ] User adoption metrics
- [ ] Support ticket summary
- [ ] Critical issues status

**Weekly Reports (First Month):**
- [ ] Comprehensive metrics dashboard
- [ ] User feedback synthesis
- [ ] Business impact analysis
- [ ] Competitive intelligence update

**Monthly Reports (Ongoing):**
- [ ] Launch success evaluation
- [ ] ROI calculation
- [ ] Strategic recommendations
- [ ] Next phase planning

---

## 📚 APPENDIX

### Launch Assets Checklist
- [ ] Technical architecture diagrams
- [ ] User flow documentation
- [ ] Marketing asset library
- [ ] Legal and compliance documents
- [ ] Training materials and guides

### Contact Information
**Emergency Contacts:**
- **Technical Issues:** [Engineering escalation contact]
- **Business Issues:** [PM and exec escalation]
- **Communication Issues:** [Marketing and PR contact]
- **Customer Issues:** [Support and success contact]

### Resources & Tools
- **Project Management:** [Tool and workspace links]
- **Communication:** [Slack channels, email lists]
- **Monitoring:** [Dashboard and alert links]
- **Documentation:** [Wiki and knowledge base links]

---

*Template generated by PM Guide - Product Management Learning Platform*
*Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}*`;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Product_Launch_Checklist_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Exercise Functions
  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setExerciseStep(0);
    setExerciseData({});
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setExerciseStep(0);
    setExerciseData({});
  };

  const nextStep = () => {
    setExerciseStep(prev => prev + 1);
  };

  const prevStep = () => {
    setExerciseStep(prev => Math.max(0, prev - 1));
  };

  const updateExerciseData = (key, value) => {
    setExerciseData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Assessment Functions
  const assessResponse = (field, response, exercise) => {
    if (!response || response.length < 20) {
      return {
        score: 1,
        feedback: "Response too brief. Please provide more detailed analysis.",
        suggestions: ["Add specific examples", "Include quantitative insights", "Consider multiple perspectives"]
      };
    }

    const assessmentCriteria = {
      problemSummary: {
        keywords: ['metric', 'data', 'user', 'business', 'problem', 'cause'],
        minLength: 50,
        maxScore: 5
      },
      dataInsights: {
        keywords: ['trend', 'pattern', 'insight', 'correlation', 'analysis'],
        minLength: 75,
        maxScore: 5
      },
      recommendation: {
        keywords: ['recommend', 'strategy', 'approach', 'solution', 'implement'],
        minLength: 100,
        maxScore: 5
      }
    };

    const criteria = assessmentCriteria[field] || assessmentCriteria.problemSummary;
    const keywordMatches = criteria.keywords.filter(keyword => 
      response.toLowerCase().includes(keyword)
    ).length;
    
    const lengthScore = Math.min(response.length / criteria.minLength, 1);
    const keywordScore = keywordMatches / criteria.keywords.length;
    const score = Math.round((lengthScore * 0.4 + keywordScore * 0.6) * criteria.maxScore);

    const feedback = score >= 4 ? "Excellent analysis!" :
                    score >= 3 ? "Good thinking, consider adding more depth." :
                    score >= 2 ? "Solid start, but needs more specific insights." :
                    "Needs improvement. Add more detail and framework thinking.";

    return {
      score: Math.max(1, score),
      feedback,
      suggestions: score < 3 ? [
        "Use specific metrics and data points",
        "Apply PM frameworks (RICE, Jobs-to-be-Done, etc.)",
        "Consider multiple stakeholder perspectives"
      ] : []
    };
  };

  const calculateOverallScore = () => {
    const responses = Object.values(exerciseData).filter(v => v && v.length > 10);
    if (responses.length === 0) return 0;
    
    const scores = responses.map(response => 
      assessResponse('general', response, activeExercise).score
    );
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getExerciseSteps = (exercise) => {
    const baseSteps = [
      {
        title: "Problem Analysis",
        description: "Analyze the situation and identify key challenges",
        fields: ["problemSummary", "rootCauses", "keyStakeholders"]
      },
      {
        title: "Data Review",
        description: "Review and interpret the provided data",
        fields: ["dataInsights", "additionalDataNeeded", "assumptions"]
      },
      {
        title: "Strategic Options",
        description: "Identify and evaluate strategic options",
        fields: ["option1", "option2", "option3", "recommendation"]
      },
      {
        title: "Implementation Plan",
        description: "Create a detailed implementation roadmap",
        fields: ["phase1", "phase2", "phase3", "timeline"]
      },
      {
        title: "Success Metrics",
        description: "Define how you'll measure success",
        fields: ["primaryMetrics", "secondaryMetrics", "reviewCadence"]
      },
      {
        title: "Risk Assessment",
        description: "Identify and mitigate potential risks",
        fields: ["highRisks", "mitigation", "contingencyPlan"]
      }
    ];

    // Add exercise-specific steps
    if (exercise.context?.aiInitiatives) {
      baseSteps.splice(2, 0, {
        title: "RICE Prioritization",
        description: "Prioritize AI initiatives using RICE framework",
        fields: ["riceAnalysis", "selectedInitiatives", "riceRationale"]
      });
    }

    if (exercise.context?.expansionOptions) {
      baseSteps.splice(2, 0, {
        title: "Market Selection",
        description: "Select and prioritize target markets",
        fields: ["marketRanking", "selectedMarkets", "marketRationale"]
      });
    }

    return baseSteps;
  };

  // Case Study Template Download Function
  const downloadCaseStudyTemplate = (exercise) => {
    const currentDate = new Date().toLocaleDateString();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    let template = `# ${exercise.title.toUpperCase()} - ANALYSIS TEMPLATE

## 📋 Case Study Information
**Case Study:** ${exercise.title}
**Company:** ${exercise.context?.company || 'N/A'}
**Analyst:** [Your Name]
**Date:** ${currentDate}
**Analysis Deadline:** [Enter deadline]

---

## 🎯 EXECUTIVE SUMMARY
[Provide a 2-3 sentence summary of your recommended approach]

---

## 📊 SITUATION ANALYSIS

### Current State Assessment
${exercise.context?.currentMetrics ? 
  Object.entries(exercise.context.currentMetrics).map(([key, value]) => 
    `- **${key.replace(/([A-Z])/g, ' $1').trim()}:** ${value}`
  ).join('\n') : 
  '[Analyze the current business situation]'
}

### Key Challenges Identified
${exercise.constraints.map((constraint, index) => `${index + 1}. ${constraint}`).join('\n')}

### Problem Root Cause Analysis
[Use 5 Whys or fishbone analysis to identify root causes]

---

## 🔍 DATA ANALYSIS

${exercise.dataPoints ? Object.entries(exercise.dataPoints).map(([category, data]) => `
### ${category.replace(/([A-Z])/g, ' $1').trim()}
${typeof data === 'object' && data !== null ? 
  Object.entries(data).map(([key, value]) => 
    `- **${key.replace(/([A-Z])/g, ' $1').trim()}:** ${Array.isArray(value) ? value.join(', ') : value}`
  ).join('\n') : 
  `[Analyze ${category} data]`
}
`).join('\n') : '[Analyze available data to support your recommendations]'}

### Additional Data Needed
- [ ] [List any additional data you would request]
- [ ] [Customer interview insights]
- [ ] [Competitive intelligence]
- [ ] [Market research findings]

---

${exercise.context?.aiInitiatives ? `
## 🤖 AI INITIATIVE ANALYSIS

### RICE Prioritization Matrix
| Initiative | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|------------|-------|--------|------------|--------|------------|----------|
${exercise.context.aiInitiatives.map(initiative => 
  `| ${initiative.name} | [1-10] | [1-5] | [%] | [Points] | [Calculated] | [Rank] |`
).join('\n')}

### Selected Initiatives Analysis
${exercise.context.aiInitiatives.map(initiative => `
#### ${initiative.name}
- **Investment:** ${initiative.estimatedCost}
- **Timeline:** ${initiative.timeToMarket}
- **Expected Impact:** ${initiative.projectedLift}
- **Risk Assessment:** [High/Medium/Low]
- **Rationale:** [Why select/reject this initiative]
`).join('\n')}
` : ''}

${exercise.context?.expansionOptions ? `
## 🌍 MARKET EXPANSION ANALYSIS

### Market Prioritization Framework
| Market | Market Size | Competition | Localization | Regulation | Resource Req | Score | Priority |
|--------|-------------|-------------|--------------|------------|--------------|-------|----------|
${exercise.context.expansionOptions.map(market => 
  `| ${market.market} | ${market.marketSize} | [1-5] | [1-5] | [1-5] | [1-5] | [Total] | [Rank] |`
).join('\n')}

### Selected Markets Analysis
[Choose your top 3 markets and provide detailed rationale for each]

#### Market 1: [Selected Market]
- **Market Size:** [Size and growth rate]
- **Entry Strategy:** [How to enter this market]
- **Resource Requirements:** [Budget, team, timeline]
- **Success Metrics:** [How to measure success]
- **Risk Mitigation:** [Key risks and mitigation strategies]

#### Market 2: [Selected Market]
[Same analysis structure]

#### Market 3: [Selected Market]
[Same analysis structure]
` : ''}

---

## 💡 STRATEGIC RECOMMENDATIONS

### Primary Recommendation
**Recommended Approach:** [Your main recommendation]

**Rationale:**
- [Key reason 1 with supporting data]
- [Key reason 2 with supporting data]
- [Key reason 3 with supporting data]

### Alternative Approaches Considered
1. **Option A:** [Brief description and why rejected/deprioritized]
2. **Option B:** [Brief description and why rejected/deprioritized]

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: [Timeline]
- [ ] [Specific action item]
- [ ] [Specific action item]
- [ ] [Specific action item]

### Phase 2: [Timeline]
- [ ] [Specific action item]
- [ ] [Specific action item]
- [ ] [Specific action item]

### Phase 3: [Timeline]
- [ ] [Specific action item]
- [ ] [Specific action item]
- [ ] [Specific action item]

### Resource Allocation
- **Budget Required:** $[Amount]
- **Team Members Needed:** [Number and roles]
- **Timeline:** [Start date - End date]
- **Dependencies:** [Critical dependencies]

---

## 📈 SUCCESS METRICS & MONITORING

### Primary Success Metrics
${exercise.deliverables.map((deliverable, index) => `${index + 1}. **${deliverable}**
   - **Baseline:** [Current state]
   - **Target:** [Goal to achieve]
   - **Timeline:** [When to achieve]
   - **Measurement Method:** [How to track]`).join('\n\n')}

### Leading Indicators
- [ ] [Early signal of success/failure]
- [ ] [Early signal of success/failure]
- [ ] [Early signal of success/failure]

### Review Checkpoints
- **Week 2:** [What to review]
- **Month 1:** [What to review]
- **Month 3:** [What to review]
- **Month 6:** [What to review]

---

## ⚠️ RISK ASSESSMENT & MITIGATION

### High-Risk Factors
1. **Risk:** [Describe risk]
   - **Probability:** [High/Medium/Low]
   - **Impact:** [High/Medium/Low]
   - **Mitigation:** [How to prevent/minimize]

2. **Risk:** [Describe risk]
   - **Probability:** [High/Medium/Low]
   - **Impact:** [High/Medium/Low]
   - **Mitigation:** [How to prevent/minimize]

### Contingency Plans
- **If Plan A fails:** [Backup approach]
- **If budget cuts occur:** [Reduced scope option]
- **If timeline slips:** [Recovery plan]

---

## 🔄 STAKEHOLDER COMMUNICATION

### Key Stakeholders
- **Executive Team:** [What they need to know, when]
- **Engineering Team:** [What they need to know, when]
- **Marketing Team:** [What they need to know, when]
- **Customer Success:** [What they need to know, when]
- **Customers:** [What they need to know, when]

### Communication Plan
- **Week 1:** [Who gets what update]
- **Ongoing:** [Regular update schedule]
- **Milestones:** [Special communications needed]

---

## 📝 APPENDIX

### Assumptions Made
- [List key assumptions in your analysis]
- [Note any limitations in available data]

### Further Research Needed
- [Areas requiring additional investigation]
- [Questions to answer before implementation]

### References & Sources
- [Data sources used]
- [Frameworks applied]
- [External research referenced]

---

*Generated on ${currentDate} using PM Guide Case Study Analysis Framework*
*🤖 Generated with [Claude Code](https://claude.ai/code)*`;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-study-analysis-${exercise.id}-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      id: 'freemium-conversion',
      title: 'Freemium Conversion Crisis: DocuFlow SaaS',
      scenario: 'You\'re the PM at DocuFlow, a B2B document automation SaaS with 50K+ users. Current conversion rate from free to paid is only 2.3% (industry avg: 4-6%). Monthly churn of paid users is 8.5%. You have 6 months to improve conversion to 4.5% or risk major layoffs.',
      context: {
        company: 'DocuFlow - Document Automation SaaS',
        currentMetrics: {
          freeUsers: '47,800',
          paidUsers: '2,200',
          conversionRate: '2.3%',
          monthlyChurn: '8.5%',
          avgRevenuePerUser: '$89/month',
          customerAcquisitionCost: '$127',
          lifetimeValue: '$445'
        },
        competitorData: {
          pandadoc: { conversionRate: '5.2%', pricing: '$19-$59/month' },
          docusign: { conversionRate: '3.8%', pricing: '$25-$65/month' },
          hellosign: { conversionRate: '4.1%', pricing: '$20-$40/month' }
        }
      },
      constraints: [
        'Engineering can only ship 2 major features per quarter',
        'Marketing budget frozen - no paid acquisition increase',
        'Free plan currently allows 10 docs/month, competitors allow 3-5',
        'Sales team only focuses on enterprise deals ($500+ MRR)',
        'Current paywall triggers: doc limit, advanced templates, integrations',
        'Support team reports 40% of churned users cite "too expensive"'
      ],
      deliverables: [
        'Data-driven conversion improvement strategy with projected impact',
        'Freemium limit optimization with A/B testing plan',
        'Feature prioritization using RICE framework',
        'Pricing tier restructuring proposal',
        'User journey analysis identifying friction points',
        '6-month roadmap with success metrics and risk mitigation'
      ],
      dataPoints: {
        userBehavior: {
          avgDocsPerFreeUser: '3.2/month',
          avgSessionsBeforeUpgrade: '12.5',
          topChurnReasons: ['Price', 'Limited integrations', 'UI complexity'],
          mostUsedFreeFeatures: ['Basic templates', 'E-signatures', 'Mobile app']
        },
        businessContext: {
          yearlyRevenue: '$2.3M',
          burnRate: '$180K/month',
          runway: '18 months',
          teamSize: '23 people',
          engineeringTeam: '8 developers'
        }
      }
    },
    {
      id: 'ai-feature-prioritization',
      title: 'AI Feature Investment: TechRecruits Platform',
      scenario: 'As Head of Product at TechRecruits (recruitment platform with 12K recruiters), you must decide how to allocate $2M AI budget across 5 competing initiatives. Each could be game-changing, but resources only allow pursuing 2. Board wants decision in 4 weeks with clear ROI projections.',
      context: {
        company: 'TechRecruits - B2B Recruitment Platform',
        currentMetrics: {
          activeRecruiters: '12,400',
          avgRevenuePerRecruiter: '$2,400/year',
          userRetentionYear1: '78%',
          timeToFill: '32 days (industry avg: 36)',
          successfulPlacements: '15,600/year'
        },
        aiInitiatives: [
          {
            name: 'Resume Intelligence',
            description: 'AI-powered resume screening and candidate matching',
            estimatedCost: '$800K',
            timeToMarket: '8 months',
            projectedLift: '25% faster screening, 15% better matches'
          },
          {
            name: 'Predictive Analytics',
            description: 'Predict candidate acceptance likelihood and salary expectations',
            estimatedCost: '$600K',
            timeToMarket: '6 months',
            projectedLift: '20% higher offer acceptance, $50K revenue per recruiter'
          },
          {
            name: 'Automated Outreach',
            description: 'AI-generated personalized candidate messages',
            estimatedCost: '$500K',
            timeToMarket: '5 months',
            projectedLift: '40% higher response rates, 30% time savings'
          },
          {
            name: 'Interview Assistant',
            description: 'Real-time interview guidance and bias detection',
            estimatedCost: '$900K',
            timeToMarket: '10 months',
            projectedLift: '25% better hire quality, compliance benefits'
          },
          {
            name: 'Market Intelligence',
            description: 'AI-driven salary benchmarking and talent market insights',
            estimatedCost: '$700K',
            timeToMarket: '7 months',
            projectedLift: '15% higher close rates, new upsell opportunities'
          }
        ]
      },
      constraints: [
        'Total budget: $2M (cannot exceed)',
        'Must launch first feature within 8 months for board demo',
        'Current AI team: 3 ML engineers, need to hire 4-6 more',
        'Competitor "RecruitAI" launching similar features in 12 months',
        'Customer research shows 60% want "better candidate matching"',
        'Sales team reports pricing pressure from AI-powered competitors'
      ],
      deliverables: [
        'Comprehensive RICE prioritization matrix with detailed scoring',
        'ROI analysis with 12-month revenue projections per feature',
        'Risk assessment matrix including technical and market risks',
        'Resource allocation plan including hiring timeline',
        'Go-to-market strategy for chosen features',
        'Competitive analysis and differentiation strategy'
      ],
      dataPoints: {
        customerFeedback: {
          topPainPoints: ['Time-consuming screening', 'Poor candidate matches', 'Manual follow-ups'],
          willingnessToPayMore: '68% for AI features',
          mostRequestedFeature: 'Automated screening (73%)'
        },
        marketContext: {
          recruitmentSoftwareMarket: '$2.3B',
          aiRecruitmentGrowth: '+47% YoY',
          averageAIImplementationTime: '8-14 months',
          competitorAIAdoption: '35% have AI features'
        }
      }
    },
    {
      id: 'platform-migration',
      title: 'Legacy Platform Migration: FinanceForward',
      scenario: 'You\'re leading the migration of FinanceForward\'s 15K+ SMB customers from a legacy accounting platform to a modern cloud solution. Migration must complete in 18 months due to end-of-life support. Early customer interviews reveal 67% fear of data loss and 45% resistance to UI changes.',
      context: {
        company: 'FinanceForward - SMB Accounting Software',
        currentState: {
          legacyUsers: '15,600',
          avgAccountValue: '$3,600/year',
          systemUptime: '94.2% (declining)',
          supportTickets: '2,400/month',
          dataVolume: '2.3TB customer data',
          integrations: '47 third-party connections'
        },
        migrationChallenges: {
          technicalDebt: 'Legacy system built 12 years ago',
          dataComplexity: '67 different data schemas across customer segments',
          customizations: '40% of customers have custom workflows',
          compliance: 'SOX, PCI-DSS requirements'
        }
      },
      constraints: [
        'Legacy system support ends in 18 months (hard deadline)',
        'Engineering team: 12 developers, only 3 familiar with legacy code',
        'Customer success team handling 300% normal ticket volume',
        'Cannot afford >5% customer churn during migration',
        'New platform missing 12 legacy features (sunset decisions needed)',
        'Budget: $4.5M including potential customer retention costs'
      ],
      deliverables: [
        'Comprehensive migration strategy with risk mitigation',
        'Customer segmentation and prioritization framework',
        'Change management plan including training and communication',
        'Technical migration roadmap with rollback procedures',
        'Feature parity analysis and sunset recommendations',
        'Success metrics and monitoring dashboard design'
      ],
      dataPoints: {
        customerSegmentation: {
          powerUsers: '2,340 (15% of base, 45% of revenue)',
          standardUsers: '10,900 (70% of base, 40% of revenue)',
          lightUsers: '2,360 (15% of base, 15% of revenue)'
        },
        riskFactors: {
          dataCorruption: 'High - complex schemas',
          customerResistance: 'Medium - change fatigue',
          competitorPoaching: 'High - vulnerable during transition',
          technicalFailure: 'Medium - legacy system instability'
        },
        successFactors: {
          earlyAdopters: '12% willing to migrate immediately',
          trainingWillingness: '78% want hands-on training',
          supportExpectations: '24/7 during migration period'
        }
      }
    },
    {
      id: 'international-expansion',
      title: 'Global Expansion Strategy: EduTech LMS',
      scenario: 'As VP of Product at EduTech (online learning management system), you\'re tasked with international expansion. Company has found PMF in US/Canada (45K schools, $89M ARR) and must choose 3 international markets for 2024 expansion. Board allocated $12M budget and expects 25% of 2025 revenue from international markets.',
      context: {
        company: 'EduTech - Learning Management System',
        currentSuccess: {
          schools: '45,200',
          students: '8.2M',
          teachers: '420K',
          annualRevenue: '$89M',
          netRevenuRetention: '118%',
          customerSatisfactionScore: '4.6/5'
        },
        expansionOptions: [
          {
            market: 'United Kingdom',
            marketSize: '$2.1B',
            competition: 'High (Google Classroom dominant)',
            localization: 'Minimal - language/currency',
            regulationComplexity: 'Medium - GDPR, data residency'
          },
          {
            market: 'Germany',
            marketSize: '$3.4B',
            competition: 'Medium (fragmented)',
            localization: 'High - language, cultural preferences',
            regulationComplexity: 'High - strict data laws, procurement'
          },
          {
            market: 'Australia',
            marketSize: '$1.8B',
            competition: 'Medium (Canvas strong)',
            localization: 'Low - similar to US market',
            regulationComplexity: 'Low - familiar regulations'
          },
          {
            market: 'Brazil',
            marketSize: '$4.2B',
            competition: 'Low (early market)',
            localization: 'High - language, payment methods',
            regulationComplexity: 'Medium - LGPD compliance'
          },
          {
            market: 'Japan',
            marketSize: '$5.1B',
            competition: 'Medium (traditional systems)',
            localization: 'Very High - language, cultural, mobile-first',
            regulationComplexity: 'High - complex procurement, privacy'
          },
          {
            market: 'India',
            marketSize: '$7.8B',
            competition: 'High (local and global players)',
            localization: 'High - multiple languages, price sensitivity',
            regulationComplexity: 'Medium - data localization requirements'
          }
        ]
      },
      constraints: [
        'Budget: $12M total (includes product, marketing, operations)',
        'Timeline: Launch first market by Q2 2024',
        'Team: Can hire 15-20 people across chosen markets',
        'Technical: Current platform 80% ready for internationalization',
        'Must achieve $20M ARR from international by end of 2025',
        'Existing US business cannot be negatively impacted'
      ],
      deliverables: [
        'Market prioritization framework with scoring methodology',
        'Go-to-market strategy for each chosen market',
        'Localization requirements and technical roadmap',
        'Revenue projections and unit economics by market',
        'Risk assessment and mitigation strategies',
        'Resource allocation and hiring plan by geography'
      ],
      dataPoints: {
        marketResearch: {
          ukReadiness: 'High - existing relationships with 12 schools',
          germanyInterest: 'Medium - regulatory concerns in discovery calls',
          australiaFit: 'High - similar purchasing patterns to US',
          brazilPotential: 'Very High - underserved market with growth',
          japanComplexity: 'Very High - cultural adaptation needed',
          indiaVolume: 'Very High - price point concerns'
        },
        resourceRequirements: {
          localizationCost: '$800K-2.5M per market',
          salesTeamCost: '$150K-300K per market per year',
          marketingBudget: '$500K-1.2M per market first year',
          legalCompliance: '$100K-400K per market setup'
        }
      }
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (template.id === 'feature-spec') {
                            downloadFeatureSpecTemplate();
                          } else if (template.id === 'user-interview') {
                            downloadUserInterviewGuide();
                          } else if (template.id === 'competitive-analysis') {
                            downloadCompetitiveAnalysis();
                          } else if (template.id === 'launch-checklist') {
                            downloadProductLaunchChecklist();
                          }
                        }}
                      >
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
              <div className="space-y-8">
                {caseStudyExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b">
                      <h3 className="font-bold text-slate-900 text-xl mb-2">{exercise.title}</h3>
                      <p className="text-slate-700 mb-4 leading-relaxed">{exercise.scenario}</p>
                      
                      {/* Company Context */}
                      {exercise.context && (
                        <div className="bg-white rounded-lg p-4 mt-4">
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-slate-600" />
                            Company Context
                          </h4>
                          <p className="text-sm text-slate-600 mb-3">{exercise.context.company}</p>
                          
                          {/* Current Metrics */}
                          {exercise.context.currentMetrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              {Object.entries(exercise.context.currentMetrics).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="font-bold text-slate-900">{value}</div>
                                  <div className="text-xs text-slate-500 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                      <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        {/* Constraints */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
                            Constraints & Challenges
                          </h4>
                          <ul className="space-y-2">
                            {exercise.constraints.map((constraint, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start">
                                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                {constraint}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Deliverables */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-emerald-500" />
                            Expected Deliverables
                          </h4>
                          <ul className="space-y-2">
                            {exercise.deliverables.map((deliverable, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Additional Data Points */}
                      {exercise.dataPoints && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                            Key Data Points
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(exercise.dataPoints).map(([category, data]) => (
                              <div key={category}>
                                <h5 className="font-medium text-slate-700 mb-2 capitalize">
                                  {category.replace(/([A-Z])/g, ' $1').trim()}
                                </h5>
                                {typeof data === 'object' && data !== null ? (
                                  <ul className="space-y-1">
                                    {Object.entries(data).map(([key, value]) => (
                                      <li key={key} className="text-xs text-slate-600 flex justify-between">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                        <span className="font-medium">
                                          {Array.isArray(value) ? value.join(', ') : value}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-slate-600">{data}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Context Sections */}
                      {exercise.context?.aiInitiatives && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Brain className="w-4 h-4 mr-2 text-blue-500" />
                            AI Initiative Options
                          </h4>
                          <div className="grid gap-3">
                            {exercise.context.aiInitiatives.map((initiative, index) => (
                              <div key={index} className="bg-white rounded p-3 border">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-slate-900">{initiative.name}</h5>
                                  <span className="text-sm font-bold text-blue-600">{initiative.estimatedCost}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{initiative.description}</p>
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Time to Market: {initiative.timeToMarket}</span>
                                  <span>{initiative.projectedLift}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {exercise.context?.expansionOptions && (
                        <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-emerald-500" />
                            Market Expansion Options
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {exercise.context.expansionOptions.map((market, index) => (
                              <div key={index} className="bg-white rounded p-3 border">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-slate-900">{market.market}</h5>
                                  <span className="text-sm font-bold text-emerald-600">{market.marketSize}</span>
                                </div>
                                <div className="space-y-1 text-xs text-slate-600">
                                  <div><span className="font-medium">Competition:</span> {market.competition}</div>
                                  <div><span className="font-medium">Localization:</span> {market.localization}</div>
                                  <div><span className="font-medium">Regulation:</span> {market.regulationComplexity}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button 
                          onClick={() => downloadCaseStudyTemplate(exercise)}
                          className="bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Analysis Template
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => startExercise(exercise)}
                        >
                          Start Exercise
                        </Button>
                      </div>
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

      {/* Interactive Exercise Modal */}
      {activeExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const steps = getExerciseSteps(activeExercise);
              const currentStep = steps[exerciseStep];
              const isLastStep = exerciseStep === steps.length - 1;
              
              return (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 rounded-t-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{activeExercise.title}</h2>
                        <p className="text-slate-200">{activeExercise.context?.company}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={closeExercise}
                        className="text-white border-white hover:bg-white hover:text-slate-900"
                      >
                        ✕ Close
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Step {exerciseStep + 1} of {steps.length}</span>
                        <div className="flex items-center gap-3">
                          <span>{Math.round(((exerciseStep + 1) / steps.length) * 100)}% Complete</span>
                          {calculateOverallScore() > 0 && (
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                              Quality: {calculateOverallScore()}/5
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((exerciseStep + 1) / steps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Step Navigation */}
                    <div className="flex space-x-2 overflow-x-auto">
                      {steps.map((step, index) => (
                        <div 
                          key={index}
                          className={`flex-shrink-0 px-3 py-1 rounded text-xs ${
                            index === exerciseStep 
                              ? 'bg-emerald-500 text-white' 
                              : index < exerciseStep 
                                ? 'bg-emerald-700 text-white' 
                                : 'bg-slate-600 text-slate-300'
                          }`}
                        >
                          {step.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{currentStep.title}</h3>
                      <p className="text-slate-600 mb-4">{currentStep.description}</p>
                    </div>

                    {/* Context Panel - Show only on first step */}
                    {exerciseStep === 0 && (
                      <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">📋 Exercise Context</h4>
                        <p className="text-sm text-slate-700 mb-3">{activeExercise.scenario}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Key Constraints:</h5>
                            <ul className="space-y-1">
                              {activeExercise.constraints.slice(0, 3).map((constraint, index) => (
                                <li key={index} className="text-xs text-slate-600 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {constraint}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Expected Deliverables:</h5>
                            <ul className="space-y-1">
                              {activeExercise.deliverables.slice(0, 3).map((deliverable, index) => (
                                <li key={index} className="text-xs text-slate-600 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {currentStep.fields.map((field) => {
                        const fieldLabels = {
                          problemSummary: "What is the core problem you need to solve?",
                          rootCauses: "What are the root causes of this problem?",
                          keyStakeholders: "Who are the key stakeholders affected?",
                          dataInsights: "What key insights do you gather from the data?",
                          additionalDataNeeded: "What additional data would you request?",
                          assumptions: "What assumptions are you making?",
                          option1: "Strategic Option 1",
                          option2: "Strategic Option 2", 
                          option3: "Strategic Option 3",
                          recommendation: "Your recommended approach and why",
                          phase1: "Phase 1 (0-3 months)",
                          phase2: "Phase 2 (3-6 months)",
                          phase3: "Phase 3 (6+ months)",
                          timeline: "Overall timeline and milestones",
                          primaryMetrics: "Primary success metrics",
                          secondaryMetrics: "Secondary/leading indicators",
                          reviewCadence: "Review and monitoring schedule",
                          highRisks: "Highest priority risks",
                          mitigation: "Risk mitigation strategies",
                          contingencyPlan: "Contingency plans if things go wrong",
                          riceAnalysis: "RICE scoring for each initiative",
                          selectedInitiatives: "Selected initiatives and budget allocation",
                          riceRationale: "Rationale for your RICE prioritization",
                          marketRanking: "Market ranking with scoring criteria",
                          selectedMarkets: "Selected markets and entry sequence",
                          marketRationale: "Rationale for market selection"
                        };

                        const currentResponse = exerciseData[field] || '';
                        const assessment = currentResponse.length > 0 ? assessResponse(field, currentResponse, activeExercise) : null;
                        
                        return (
                          <div key={field}>
                            <div className="flex justify-between items-start mb-2">
                              <Label className="text-sm font-medium text-slate-900">
                                {fieldLabels[field] || field}
                              </Label>
                              {assessment && (
                                <div className="flex items-center gap-2">
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    assessment.score >= 4 ? 'bg-emerald-100 text-emerald-700' :
                                    assessment.score >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                    assessment.score >= 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {assessment.score}/5
                                  </div>
                                </div>
                              )}
                            </div>
                            <Textarea
                              placeholder="Enter your analysis here..."
                              value={currentResponse}
                              onChange={(e) => updateExerciseData(field, e.target.value)}
                              className="min-h-[100px] resize-y"
                            />
                            {assessment && (
                              <div className="mt-2 space-y-2">
                                <div className={`text-xs p-2 rounded ${
                                  assessment.score >= 4 ? 'bg-emerald-50 text-emerald-700' :
                                  assessment.score >= 3 ? 'bg-yellow-50 text-yellow-700' :
                                  assessment.score >= 2 ? 'bg-orange-50 text-orange-700' :
                                  'bg-red-50 text-red-700'
                                }`}>
                                  💡 {assessment.feedback}
                                </div>
                                {assessment.suggestions.length > 0 && (
                                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                    <div className="font-medium mb-1">💡 Suggestions:</div>
                                    <ul className="space-y-1">
                                      {assessment.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <span className="w-1 h-1 bg-slate-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                          {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={exerciseStep === 0}
                      >
                        ← Previous
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => downloadCaseStudyTemplate(activeExercise)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                        
                        {isLastStep ? (
                          <Button 
                            onClick={() => {
                              const overallScore = calculateOverallScore();
                              const competencyLevel = 
                                overallScore >= 4.5 ? 'Expert' :
                                overallScore >= 4.0 ? 'Advanced' :
                                overallScore >= 3.5 ? 'Proficient' :
                                overallScore >= 3.0 ? 'Developing' : 'Novice';
                              
                              alert(`Exercise Completed! 🎉\n\nYour Analysis Score: ${overallScore}/5\nCompetency Level: ${competencyLevel}\n\nYour detailed analysis has been captured. Consider downloading the template for your records.`);
                              closeExercise();
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Complete Exercise ✓
                          </Button>
                        ) : (
                          <Button 
                            onClick={nextStep}
                            className="bg-slate-900 hover:bg-slate-800"
                          >
                            Next →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveToolsPage;