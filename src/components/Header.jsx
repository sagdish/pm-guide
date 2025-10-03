import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import AuthModal from './AuthModal';
import { User, LogOut, BookOpen } from 'lucide-react';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { progress } = useProgress();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">PM Guide</span>
            </Link>

            {!isHomePage && isAuthenticated && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">Overall Progress</div>
                  <Progress value={progress.total_progress || 0} className="w-32" />
                  <div className="text-xs text-slate-500 mt-1">
                    {Math.round(progress.total_progress || 0)}% Complete
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                sessionStorage.getItem('pm_guide_browse_mode') !== 'true' && (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Login / Sign Up
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onBrowseWithoutAuth={() => {
          sessionStorage.setItem('pm_guide_browse_mode', 'true');
          setShowAuthModal(false);
        }}
      />
    </>
  );
};

export default Header;