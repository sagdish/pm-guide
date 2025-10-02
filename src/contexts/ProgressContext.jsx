import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { USE_FRONTEND_ONLY } from '../config/appMode';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState({
    completed_sections: [],
    module_progress: {},
    assessment_scores: [],
    total_progress: 0,
    last_accessed_module: null
  });
  const [loading, setLoading] = useState(false);

  // Load user progress when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress();
    } else {
      // Reset progress when not authenticated
      setProgress({
        completed_sections: [],
        module_progress: {},
        assessment_scores: [],
        total_progress: 0,
        last_accessed_module: null
      });
    }
  }, [isAuthenticated, user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      if (USE_FRONTEND_ONLY) {
        // Load from localStorage
        const savedProgress = localStorage.getItem(`pm_guide_progress_${user?.id}`);
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } else {
        // Load from backend
        const response = await axios.get(`${API}/progress`);
        setProgress(response.data);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      // Use default progress if API fails
      setProgress({
        completed_sections: [],
        module_progress: {
          'pm-basics': { completed: false, completed_at: null },
          'discovery': { completed: false, completed_at: null },
          'product-sense': { completed: false, completed_at: null },
          'metrics': { completed: false, completed_at: null },
          'ai-era': { completed: false, completed_at: null },
          'tools': { completed: false, completed_at: null }
        },
        assessment_scores: [],
        total_progress: 0,
        last_accessed_module: null
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSectionProgress = async (sectionId, moduleId, completed) => {
    if (!user) return;

    if (USE_FRONTEND_ONLY) {
      // Update progress locally
      setProgress(prev => {
        const sectionKey = `${moduleId}-${sectionId}`;
        let newCompletedSections = [...prev.completed_sections];
        
        if (completed && !newCompletedSections.includes(sectionKey)) {
          newCompletedSections.push(sectionKey);
        } else if (!completed) {
          newCompletedSections = newCompletedSections.filter(s => s !== sectionKey);
        }

        // Update module progress
        const newModuleProgress = { ...prev.module_progress };
        if (!newModuleProgress[moduleId]) {
          newModuleProgress[moduleId] = { completed: false, completed_at: null };
        }
        newModuleProgress[moduleId].completed = completed;
        if (completed) {
          newModuleProgress[moduleId].completed_at = new Date().toISOString();
        }

        // Calculate progress locally
        const totalModules = 6;
        const completedModules = Object.values(newModuleProgress).filter(m => m.completed).length;
        const totalProgress = (completedModules / totalModules) * 100;

        const newProgress = {
          ...prev,
          completed_sections: newCompletedSections,
          module_progress: newModuleProgress,
          total_progress: totalProgress,
          last_accessed_module: moduleId
        };

        // Save to localStorage
        localStorage.setItem(`pm_guide_progress_${user.id}`, JSON.stringify(newProgress));
        
        return newProgress;
      });
      return;
    } else {
      // Backend mode
      try {
        const response = await axios.post(`${API}/progress/section`, {
          section_id: sectionId,
          module_id: moduleId,
          completed
        });

        // Reload progress to get updated data
        await loadProgress();
        
        return response.data;
      } catch (error) {
        console.error('Failed to update progress:', error);
        throw error;
      }
    }
  };

    const submitAssessment = async (assessmentId, answers, score) => {
    if (!user) return;

    if (USE_FRONTEND_ONLY) {
      // Update assessment locally
      setProgress(prev => {
        const newAssessmentScores = [...prev.assessment_scores];
        const existingIndex = newAssessmentScores.findIndex(
          assessment => assessment.assessment_id === assessmentId
        );

        const assessmentResult = {
          assessment_id: assessmentId,
          answers,
          score,
          completed_at: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          newAssessmentScores[existingIndex] = assessmentResult;
        } else {
          newAssessmentScores.push(assessmentResult);
        }

        const newProgress = {
          ...prev,
          assessment_scores: newAssessmentScores
        };

        // Save to localStorage
        localStorage.setItem(`pm_guide_progress_${user.id}`, JSON.stringify(newProgress));
        
        return newProgress;
      });
      return;
    } else {
      // Backend mode
      try {
        const response = await axios.post(`${API}/progress/assessment`, {
          assessment_id: assessmentId,
          answers,
          score
        });

        // Reload progress to get updated data
        await loadProgress();
        
        return response.data;
      } catch (error) {
        console.error('Failed to submit assessment:', error);
        throw error;
      }
    }
  };

  const isSectionCompleted = (sectionId) => {
    return progress.completed_sections.includes(sectionId);
  };

  const isModuleCompleted = (moduleId) => {
    return progress.module_progress[moduleId]?.completed || false;
  };

  const getAssessmentScore = (assessmentId) => {
    const assessment = progress.assessment_scores.find(
      score => score.assessment_id === assessmentId
    );
    return assessment?.score || null;
  };

  const value = {
    progress,
    loading,
    updateSectionProgress,
    submitAssessment,
    isSectionCompleted,
    isModuleCompleted,
    getAssessmentScore,
    loadProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};