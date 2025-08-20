'use client';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HomeDashboard } from '@/components/HomeDashboard';
import { TaskManagement } from '@/components/TaskManagement';
import { RitualSystem } from '@/components/RitualSystem';
import { FamilyHub } from '@/components/FamilyHub';
import { ProfileSettings } from '@/components/ProfileSettings';
import { KidsActivities } from '@/components/KidsActivities';
import { FamilyPlanning } from '@/components/FamilyPlanning';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useToast } from '@/hooks/use-toast';

// Memoized celebration component for performance
const CelebrationOverlay = memo(() => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    role="alert"
    aria-live="polite"
    aria-label="Daily bonus celebration"
  >
    <div className="animate-bounce text-6xl">
      🎉
    </div>
  </div>
));

CelebrationOverlay.displayName = 'CelebrationOverlay';

// Memoized BottomNavigation wrapper to prevent unnecessary re-renders
const BottomNavigationWrapper = memo(({ activeTab, onTabChange }) => (
  <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
));

BottomNavigationWrapper.displayName = 'BottomNavigationWrapper';

// Main Home component with comprehensive accessibility features
export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  // Memoized content renderer for performance optimization
  const renderContent = useMemo(() => {
    const commonProps = {
      role: 'main',
      'aria-labelledby': 'page-title',
      className: 'flex-1 overflow-auto focus:outline-none',
      tabIndex: -1
    };

    switch (activeTab) {
      case 'home':
        return <HomeDashboard {...commonProps} />;
      case 'tasks':
        return <TaskManagement {...commonProps} />;
      case 'rituals':
        return <RitualSystem {...commonProps} />;
      case 'family':
        return <FamilyHub {...commonProps} />;
      case 'profile':
        return <ProfileSettings {...commonProps} />;
      case 'kids':
        return <KidsActivities {...commonProps} />;
      case 'planning':
        return <FamilyPlanning {...commonProps} />;
      default:
        return <HomeDashboard {...commonProps} />;
    }
  }, [activeTab]);

  // Memoized tab change handler to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Announce tab change for screen readers
    const announcement = `Navigated to ${tab} section`;
    // Create temporary live region for announcement
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.textContent = announcement;
    document.body.appendChild(liveRegion);
    setTimeout(() => document.body.removeChild(liveRegion), 1000);
  }, []);

  // Memoized keyboard navigation handler
  const handleKeyDown = useCallback((event) => {
    // Alt + number keys for quick navigation
    if (event.altKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          handleTabChange('home');
          break;
        case '2':
          event.preventDefault();
          handleTabChange('tasks');
          break;
        case '3':
          event.preventDefault();
          handleTabChange('rituals');
          break;
        case '4':
          event.preventDefault();
          handleTabChange('family');
          break;
        case '5':
          event.preventDefault();
          handleTabChange('profile');
          break;
        case '6':
          event.preventDefault();
          handleTabChange('kids');
          break;
        case '7':
          event.preventDefault();
          handleTabChange('planning');
          break;
      }
    }
    
    // Escape key to focus main content
    if (event.key === 'Escape') {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }
  }, [handleTabChange]);

  // Daily bonus celebration trigger
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    toast({
      title: "Daily Bonus! 🎉",
      description: "You've earned extra family points today!",
      duration: 3000,
    });
    
    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, [toast]);

  // Check for daily bonus on component mount
  useEffect(() => {
    const lastBonusDate = localStorage.getItem('lastDailyBonus');
    const today = new Date().toDateString();
    
    if (lastBonusDate !== today) {
      // Trigger celebration after a short delay for better UX
      setTimeout(() => {
        triggerCelebration();
        localStorage.setItem('lastDailyBonus', today);
      }, 2000);
    }
  }, [triggerCelebration]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      role="application"
      aria-label="LeelaGitOS Family Management App"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
        tabIndex={0}
      >
        Skip to main content
      </a>

      {/* Celebration overlay with accessibility improvements */}
      {showCelebration && <CelebrationOverlay />}

      {/* Main content area with proper ARIA labels */}
      <main id="main-content">
        {renderContent}
      </main>

      {/* Floating Action Button with accessibility */}
      <FloatingActionButton
        aria-label="Quick actions menu"
        tabIndex={0}
      />

      {/* Bottom Navigation with memoization and accessibility */}
      <BottomNavigationWrapper
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Screen reader only instructions */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-label="Keyboard navigation instructions"
      >
        Use Alt + number keys (1-6) to navigate between sections. Press Escape to focus main content.
      </div>
    </div>
  );
}