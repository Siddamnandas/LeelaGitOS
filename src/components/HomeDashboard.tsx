'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DailySyncCard } from '@/components/DailySyncCard';
import { AISuggestionCard } from '@/components/AISuggestionCard';
import { RasaBalanceWheel } from '@/components/RasaBalanceWheel';
import { CoinStreakAnimation } from '@/components/CoinStreakAnimation';
import { AchievementCelebration } from '@/components/AchievementCelebration';
import { RewardModal, LevelUpModal, MilestoneModal } from '@/components/PremiumModal';
import { MemoryJukebox } from '@/components/MemoryJukebox';
import {
  Sparkles,
  Heart,
  Target,
  TrendingUp,
  Gift,
  Clock,
  Trophy,
  Star,
  Zap,
  Crown
} from 'lucide-react';

interface HomeDashboardProps {
  streak: number;
  coins: number;
}

export function HomeDashboard({ streak, coins }: HomeDashboardProps) {
  const [dailySyncCompleted, setDailySyncCompleted] = useState(false);
  const [rasaBalance, setRasaBalance] = useState({
    play: 35,
    duty: 40,
    balance: 25
  });
  const [showAchievement, setShowAchievement] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);

  const aiSuggestion = {
    type: 'ritual',
    archetype: 'radha_krishna',
    title: 'Evening Connection Ritual',
    description: 'Reignite your romance with a 15-minute tech-free evening ritual that deepens your emotional bond.',
    actionSteps: [
      'Set phones aside for 15 minutes',
      'Share highlights of your day',
      'Express one thing you appreciate about each other',
      'Plan tomorrow together'
    ],
    estimatedDuration: 900,
    rewardCoins: 25,
    reasoning: {
      trigger: 'low_quality_time',
      severity: 2,
      factors: ['high_stress', 'limited_connection_time']
    }
  };

  const handleSyncComplete = (data: any) => {
    setDailySyncCompleted(true);
    // Update rasa balance based on sync data
    setRasaBalance(prev => ({
      ...prev,
      play: Math.min(100, prev.play + 5),
      balance: Math.min(100, prev.balance + 3)
    }));
    
    // Show achievement celebration
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 5000);
  };

  const handleCoinClick = () => {
    // Handle coin click animation
    console.log('Coin clicked!');
  };

  const handleStreakClick = () => {
    // Handle streak click animation
    console.log('Streak clicked!');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with premium glass effect */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Good Morning! 💕</h1>
              <p className="text-white/80 text-sm">Ready to strengthen your bond today?</p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl overflow-hidden min-w-[80px] h-[60px] bg-white/20 backdrop-blur-lg"
                aria-label="Couple photo"
              >
                <Image
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop&crop=faces"
                  alt="Couple smiling"
                  width={80}
                  height={60}
                  className="w-[80px] h-[60px] object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col items-center bg-yellow-400/90 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="text-xl animate-bounce">🪙</span>
                  <span className="text-xl font-bold text-yellow-900">{coins}</span>
                </div>
                <span className="text-xs text-yellow-900">coins</span>
              </div>
            </div>
          </div>
          
          {/* Daily progress bar */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">Daily Progress</span>
              <span className="text-sm text-white/90">75%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Coin & Streak Animation */}
      <CoinStreakAnimation 
        coins={coins}
        streak={streak}
        onCoinClick={handleCoinClick}
        onStreakClick={handleStreakClick}
      />

      {/* Daily Sync Card with premium styling */}
      {!dailySyncCompleted && (
        <div className="animate-fade-in">
          <DailySyncCard onCompleteSync={handleSyncComplete} />
        </div>
      )}

      {/* Memory Jukebox Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Memory Jukebox
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        {/* Recent Memories Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎵</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recent Audio</h3>
                <p className="text-sm text-gray-600">Baby's first laugh</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-pink-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-xs text-gray-500">0:45</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">📷</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Latest Photo</h3>
                <p className="text-sm text-gray-600">Beach sunset</p>
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌅</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Heart className="w-4 h-4 mr-2" />
          View Memory Jukebox
        </Button>
      </div>
    </div>
  );
}