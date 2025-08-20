66
 // Memoized tab change handler to prevent unnecessary re-renders
67
 const handleTabChange = useCallback((tab) => {
68
 setActiveTab(tab);
69
 // Announce tab change for screen readers
70
 const announcement = `Navigated to ${tab} section`;
71
 // Create temporary live region for announcement
72
 const liveRegion = document.createElement('div');
73
 liveRegion.setAttribute('aria-live', 'polite');
74
 liveRegion.setAttribute('aria-atomic', 'true');
75
 liveRegion.style.position = 'absolute';
76
 liveRegion.style.left = '-10000px';
77
 liveRegion.textContent = announcement;
78
 document.body.appendChild(liveRegion);
79
 setTimeout(() => document.body.removeChild(liveRegion), 1000);
80
  }, []);
81

82
 // Simulate daily login bonus with better error handling
83
 useEffect(() => {
84
 try {
85
 const lastLogin = localStorage.getItem('lastLogin');
86
 const today = new Date().toDateString();
87

88
 if (lastLogin !== today) {
89
 localStorage.setItem('lastLogin', today);
90
 setCoins(prev => prev + 50);
91
 setShowCelebration(true);
92
 toast({
93
 title: "Daily Bonus! 🎉",
94
 description: "You earned 50 Lakshmi Coins for logging in today!",
95
 duration: 3000,
96
        });
97

98
 setTimeout(() => setShowCelebration(false), 3000);
99
      }
100
    } catch (error) {
101
 console.warn('Failed to access localStorage:', error);
102
    }
103
  }, [toast]);
104

105
 // Memoized content renderer to prevent unnecessary re-renders
106
 const renderContent = useMemo(() => {
107
 const contentProps = { coins, streak };
108

109
 switch (activeTab) {
110
 case 'home':
111
 return <HomeDashboard {...contentProps} />;
112
 case 'tasks':
113
 return <TaskManagement {...contentProps} />;
114
 case 'rituals':
115
 return <RitualSystem {...contentProps} />;
116
 case 'family':
117
 return <FamilyHub {...contentProps} />;
118
 case 'kids':
119
 return <KidsActivities coupleId="cmeixvrle0000j655rq9oklyx" {...contentProps} />;
120
      case 'profile':
121
        return <ProfileSettings {...contentProps} />;
122
      default:
123
        return <HomeDashboard {...contentProps} />;
124
    }
125
  }, [activeTab, coins, streak]);
126

127
  // Keyboard navigation handler