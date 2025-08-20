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
    <div 
      className="animate-bounce text-6xl"
      aria-hidden="true"
    >
      🎉
    </div>
  </div>
));
CelebrationOverlay.displayName = 'CelebrationOverlay';

// Memoized main content container for performance
const MainContent = memo(({ children }) => (
  <main 
    className="flex-1 overflow-y-auto pb-20"
    role="main"
    aria-label="Application main content"
  >
    {children}
  </main>
));
MainContent.displayName = 'MainContent';

// Memoized bottom navigation wrapper
const BottomNavigationWrapper = memo(({ activeTab, onTabChange }) => (
  <nav 
    className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg"
    role="navigation"
    aria-label="Main navigation"
  >
    <BottomNavigation 
      activeTab={activeTab} 
      onTabChange={onTabChange}
    />
  </nav>
));
BottomNavigationWrapper.displayName = 'BottomNavigationWrapper';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(7);
  const [coins, setCoins] = useState(250);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

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

  // Simulate daily login bonus with better error handling
  useEffect(() => {
    try {
      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();
      
      if (lastLogin !== today) {
        localStorage.setItem('lastLogin', today);
        setCoins(prev => prev + 50);
        setShowCelebration(true);
        toast({
          title: "Daily Bonus! 🎉",
          description: "You earned 50 Lakshmi Coins for logging in today!",
          duration: 3000,
        });
        
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  }, [toast]);

  // Memoized content renderer to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    const contentProps = { coins, streak };
    
    switch (activeTab) {
      case 'home':
        return <HomeDashboard {...contentProps} />;
      case 'tasks':
        return <TaskManagement />;
      case 'rituals':
        return <RitualSystem />;
      case 'family':
        return <FamilyHub />;
      case 'kids':
        return <KidsActivities coupleId="cmeixvrle0000j655rq9oklyx" />;
      case 'profile':
        return <ProfileSettings {...contentProps} />;
      default:
        return <HomeDashboard {...contentProps} />;
    }
  }, [activeTab, coins, streak]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event) => {
    // Handle tab navigation with Alt + number keys
    if (event.altKey && event.key >= '1' && event.key <= '6') {
      event.preventDefault();
      const tabs = ['home', 'tasks', 'rituals', 'family', 'kids', 'profile'];
      const tabIndex = parseInt(event.key) - 1;
      if (tabs[tabIndex]) {
        handleTabChange(tabs[tabIndex]);
      }
    }
    
    // Escape key to focus on main content
    if (event.key === 'Escape') {
      const mainElement = document.querySelector('[role="main"]');
      if (mainElement) {
        mainElement.focus();
      }
    }
  }, [handleTabChange]);

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
      <MainContent id="main-content">
        {renderContent}
      </MainContent>

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
