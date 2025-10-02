import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
      const response = await axios.get(`${API}/progress`);
      setProgress(response.data);
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
    if (!isAuthenticated) {
      // For non-authenticated users, just update local state
      setProgress(prev => {
        const newCompletedSections = [...prev.completed_sections];
        if (completed && !newCompletedSections.includes(sectionId)) {
          newCompletedSections.push(sectionId);
        } else if (!completed && newCompletedSections.includes(sectionId)) {
          const index = newCompletedSections.indexOf(sectionId);
          newCompletedSections.splice(index, 1);
        }

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

        return {
          ...prev,
          completed_sections: newCompletedSections,
          module_progress: newModuleProgress,
          total_progress: totalProgress,
          last_accessed_module: moduleId
        };
      });
      return;
    }

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
  };

  const submitAssessment = async (assessmentId, answers, score) => {
    if (!isAuthenticated) {
      // For non-authenticated users, just update local state
      setProgress(prev => ({
        ...prev,
        assessment_scores: [
          ...prev.assessment_scores,
          {
            assessment_id: assessmentId,
            score,
            answers,
            completed_at: new Date().toISOString()
          }
        ]
      }));
      return;
    }

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