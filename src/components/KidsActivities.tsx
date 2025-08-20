'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  // Emotion Explorers
  Baby,
  Book,
  Palette,
  Music,
  Gamepad2,
  Star,
  Clock,
  Trophy,
  Target,
  Heart,
  Plus,
  Sparkles,

  // Mythological Characters
  Feather,
  Moon,
  Sun,

  // Krishna Prank
  Smile,
  Laugh,
  Camera,
  Image as ImageIcon,

  // Hanuman Helper
  CheckCircle,
  Target as TargetIcon,
  Shield,

  // Saraswati Creative
  Brush,
  Lightbulb,
  PenTool,

  // General
  Calendar,
  Users,
  Gift,
  TrendingUp,
  Zap,
  Play
} from 'lucide-react';
import { KidsActivityScheduler } from '@/components/KidsActivityScheduler';
import { useToast } from '@/hooks/use-toast';

interface EmotionScenario {
  id: string;
  title: string;
  description: string;
  character: string;
  situation: string;
  emotions: string[];
  emojis: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface KindnessMoment {
  id: string;
  date: Date;
  description: string;
  category: string;
  points: number;
  verified: boolean;
}

interface MythologicalQuestion {
  id: string;
  character: string;
  question: string;
  answer: string;
  context: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ThemedDay {
  id: string;
  name: string;
  character: string;
  essence: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  parentRole: string;
}

interface KrishnaPrank {
  id: string;
  title: string;
  helperParent: string;
  targetParent: string;
  prompt: string;
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface HanumanTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  materials: string[];
  celebrationPrompt: string;
}

interface SaraswatiCreative {
  id: string;
  title: string;
  description: string;
  category: string;
  materials: string[];
  prompts: string[];
  estimatedTime: string;
  reflectionQuestions: string[];
}

interface FamilyStorybookEntry {
  id: string;
  date: Date;
  type: 'krishna' | 'hanuman' | 'saraswati';
  title: string;
  description: string;
  photo?: string;
  audio?: string;
  video?: string;
  notes?: string;
  participants: string[];
}

export function KidsActivities() {
  const [activeTab, setActiveTab] = useState('daily');
  const [emotionScenarios, setEmotionScenarios] = useState<EmotionScenario[]>([]);
  const [kindnessMoments, setKindnessMoments] = useState<KindnessMoment[]>([]);
  const [mythologicalQuestions, setMythologicalQuestions] = useState<MythologicalQuestion[]>([]);
  const [themedDays, setThemedDays] = useState<ThemedDay[]>([]);
  const [krishnaPranks, setKrishnaPranks] = useState<KrishnaPrank[]>([]);
  const [hanumanTasks, setHanumanTasks] = useState<HanumanTask[]>([]);
  const [saraswatiCreatives, setSaraswatiCreatives] = useState<SaraswatiCreative[]>([]);
  const [storybookEntries, setStorybookEntries] = useState<FamilyStorybookEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [kindnessPoints, setKindnessPoints] = useState(0);
  const [currentDay, setCurrentDay] = useState('');
  const [isAddStorybookOpen, setIsAddStorybookOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize all data
    initializeData();
  }, []);

  const initializeData = () => {
    // Emotion Explorers Scenarios
    const emotionScenariosData: EmotionScenario[] = [
      {
        id: '1',
        title: 'The Lost Toy',
        description: 'A little bear lost his favorite toy',
        character: 'Bear',
        situation: 'Lost favorite toy',
        emotions: ['Sad', 'Upset', 'Disappointed', 'Worried'],
        emojis: ['😢', '😞', '😔', '😟'],
        difficulty: 'easy'
      },
      {
        id: '2',
        title: 'The Birthday Surprise',
        description: 'Rabbit gets a surprise birthday party',
        character: 'Rabbit',
        situation: 'Surprise party',
        emotions: ['Happy', 'Excited', 'Surprised', 'Grateful'],
        emojis: ['😊', '😄', '😲', '🙏'],
        difficulty: 'easy'
      },
      {
        id: '3',
        title: 'The Rainy Day',
        description: 'Fox cannot play outside because of rain',
        character: 'Fox',
        situation: 'Cannot play outside',
        emotions: ['Bored', 'Disappointed', 'Sad', 'Frustrated'],
        emojis: ['😑', '😞', '😢', '😤'],
        difficulty: 'medium'
      }
    ];

    // Kindness Moments (Sample)
    const kindnessMomentsData: KindnessMoment[] = [
      {
        id: '1',
        date: new Date(),
        description: 'Shared toys with friend',
        category: 'Sharing',
        points: 5,
        verified: true
      },
      {
        id: '2',
        date: new Date(),
        description: 'Helped mom with dishes',
        category: 'Helping',
        points: 8,
        verified: true
      }
    ];

    // Mythological Questions
    const mythologicalQuestionsData: MythologicalQuestion[] = [
      {
        id: '1',
        character: 'Krishna',
        question: 'Why did Krishna love to play the flute?',
        answer: 'Because music brings joy and happiness to everyone',
        context: 'Krishna\'s flute music made all the cows and villagers happy',
        difficulty: 'easy'
      },
      {
        id: '2',
        character: 'Hanuman',
        question: 'Why was Hanuman so strong?',
        answer: 'Because he had unwavering faith and devotion',
        context: 'Hanuman\'s strength came from his pure heart and devotion to Rama',
        difficulty: 'medium'
      },
      {
        id: '3',
        character: 'Saraswati',
        question: 'Why does Saraswati hold a veena?',
        answer: 'Because music and knowledge create harmony in the world',
        context: 'Saraswati\'s veena represents the music of knowledge and wisdom',
        difficulty: 'medium'
      }
    ];

    // Themed Days
    const themedDaysData: ThemedDay[] = [
      {
        id: 'krishna',
        name: 'Krishna Prank Day',
        character: 'Krishna',
        essence: 'Play & joy',
        color: 'from-purple-500 to-pink-500',
        icon: <Smile className="w-5 h-5" />,
        description: 'The child becomes Krishna and does pranks with parents',
        parentRole: 'Help or be the target'
      },
      {
        id: 'hanuman',
        name: 'Hanuman Helper Day',
        character: 'Hanuman',
        essence: 'Service & contribution',
        color: 'from-orange-500 to-red-500',
        icon: <CheckCircle className="w-5 h-5" />,
        description: 'The child takes responsibility and does helpful tasks',
        parentRole: 'Encourage task'
      },
      {
        id: 'saraswati',
        name: 'Saraswati Creative Day',
        character: 'Saraswati',
        essence: 'Creativity & curiosity',
        color: 'from-blue-500 to-indigo-500',
        icon: <Brush className="w-5 h-5" />,
        description: 'Parents and child do creative activities together',
        parentRole: 'Facilitate & engage'
      }
    ];

    // Krishna Pranks
    const krishnaPranksData: KrishnaPrank[] = [
      {
        id: '1',
        title: 'The Mysterious Note',
        helperParent: 'Mom',
        targetParent: 'Dad',
        prompt: 'Help your child write a mysterious note and hide it for Dad to find',
        instructions: [
          'Write a fun, mysterious message together',
          'Hide it where Dad will find it during the day',
          'Keep it light and fun',
          'Enjoy Dad\'s surprised reaction together'
        ],
        difficulty: 'easy',
        estimatedTime: '15 minutes'
      },
      {
        id: '2',
        title: 'The Sock Swap',
        helperParent: 'Dad',
        targetParent: 'Mom',
        prompt: 'Help your child swap a few pairs of socks in Mom\'s drawer',
        instructions: [
          'Choose colorful, fun socks',
          'Swap 2-3 pairs in Mom\'s drawer',
          'Be there when Mom discovers it',
          'Laugh together about the fun mix-up'
        ],
        difficulty: 'easy',
        estimatedTime: '10 minutes'
      }
    ];

    // Hanuman Tasks
    const hanumanTasksData: HanumanTask[] = [
      {
        id: '1',
        title: 'Book Organization Mission',
        description: 'Organize your books like a true Hanuman helper',
        category: 'Organization',
        difficulty: 'easy',
        estimatedTime: '20 minutes',
        materials: ['Books', 'Shelf space'],
        celebrationPrompt: 'Great job organizing! You\'re as helpful as Hanuman!'
      },
      {
        id: '2',
        title: 'Toy Tidy Up',
        description: 'Help organize the toys in the living room',
        category: 'Cleaning',
        difficulty: 'easy',
        estimatedTime: '15 minutes',
        materials: ['Toys', 'Storage containers'],
        celebrationPrompt: 'Wonderful work! You\'re a true helper like Hanuman!'
      }
    ];

    // Saraswati Creatives
    const saraswatiCreativesData: SaraswatiCreative[] = [
      {
        id: '1',
        title: 'Dream House Drawing',
        description: 'Draw your dream house and tell your parent about it',
        category: 'Drawing',
        materials: ['Paper', 'Colors', 'Pencils'],
        prompts: [
          'What rooms would you have?',
          'What special features would make it fun?',
          'Who would live there with you?'
        ],
        estimatedTime: '30 minutes',
        reflectionQuestions: [
          'What was the most fun part of your dream house?',
          'What would you do if you lived there?'
        ]
      },
      {
        id: '2',
        title: 'Story Creation',
        description: 'Create a story together with your child',
        category: 'Storytelling',
        materials: ['Paper', 'Pencils', 'Imagination'],
        prompts: [
          'Who would be the main character?',
          'What adventure would they go on?',
          'How would the story end?'
        ],
        estimatedTime: '25 minutes',
        reflectionQuestions: [
          'What was your favorite part of the story?',
          'What would you like to create a story about next time?'
        ]
      }
    ];

    // Family Storybook Entries
    const storybookEntriesData: FamilyStorybookEntry[] = [
      {
        id: '1',
        date: new Date(),
        type: 'krishna',
        title: 'The Great Note Adventure',
        description: 'Had fun writing mysterious notes and hiding them',
        participants: ['Child', 'Mom']
      },
      {
        id: '2',
        date: new Date(),
        type: 'hanuman',
        title: 'Book Organization Mission',
        description: 'Successfully organized all books on the shelf',
        participants: ['Child', 'Dad']
      }
    ];

    setEmotionScenarios(emotionScenariosData);
    setKindnessMoments(kindnessMomentsData);
    setMythologicalQuestions(mythologicalQuestionsData);
    setThemedDays(themedDaysData);
    setKrishnaPranks(krishnaPranksData);
    setHanumanTasks(hanumanTasksData);
    setSaraswatiCreatives(saraswatiCreativesData);
    setStorybookEntries(storybookEntriesData);

    // Calculate kindness points
    const totalPoints = kindnessMomentsData.reduce((sum, moment) => sum + moment.points, 0);
    setKindnessPoints(totalPoints);

    // Set current day (simulate)
    setCurrentDay('krishna');

    setLoading(false);
  };

  const handleEmotionSelect = (emotion: string, emoji: string) => {
    setSelectedEmotion(emotion);
    toast({
      title: "Emotion Selected! 🎭",
      description: `You chose ${emoji} ${emotion} - Great emotional vocabulary building!`,
      duration: 3000,
    });
  };

  const handleKindnessMoment = (description: string, category: string) => {
    const newMoment: KindnessMoment = {
      id: Date.now().toString(),
      date: new Date(),
      description,
      category,
      points: Math.floor(Math.random() * 10) + 1,
      verified: true
    };

    setKindnessMoments(prev => [...prev, newMoment]);
    setKindnessPoints(prev => prev + newMoment.points);

    toast({
      title: "Kindness Recorded! 🌟",
      description: `Great job! You earned ${newMoment.points} kindness points.`,
      duration: 3000,
    });
  };

  const handleMythologicalAnswer = (questionId: string, answer: string) => {
    const question = mythologicalQuestions.find(q => q.id === questionId);
    if (question) {
      toast({
        title: "Great Answer! 📚",
        description: `You know about ${question.character}! ${question.answer}`,
        duration: 4000,
      });
    }
  };

  const handlePrankComplete = (prankId: string) => {
    const prank = krishnaPranks.find(p => p.id === prankId);
    if (prank) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'krishna',
        title: prank.title,
        description: `Had fun with ${prank.helperParent} and ${prank.targetParent}`,
        participants: ['Child', prank.helperParent, prank.targetParent]
      };

      setStorybookEntries(prev => [...prev, newEntry]);

      toast({
        title: "Prank Complete! 😄",
        description: "What a fun Krishna-style adventure!",
        duration: 3000,
      });
    }
  };

  const handleTaskComplete = (taskId: string) => {
    const task = hanumanTasks.find(t => t.id === taskId);
    if (task) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'hanuman',
        title: task.title,
        description: task.description,
        participants: ['Child', 'Parent']
      };

      setStorybookEntries(prev => [...prev, newEntry]);

      toast({
        title: "Task Complete! 🎉",
        description: task.celebrationPrompt,
        duration: 3000,
      });
    }
  };

  const handleCreativeComplete = (creativeId: string) => {
    const creative = saraswatiCreatives.find(c => c.id === creativeId);
    if (creative) {
      const newEntry: FamilyStorybookEntry = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'saraswati',
        title: creative.title,
        description: creative.description,
        participants: ['Child', 'Parent']
      };

      setStorybookEntries(prev => [...prev, newEntry]);

      toast({
        title: "Creation Complete! 🎨",
        description: "Beautiful Saraswati-inspired creativity!",
        duration: 3000,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCharacterColor = (character: string) => {
    switch (character) {
      case 'Krishna': return 'bg-purple-100 text-purple-700';
      case 'Hanuman': return 'bg-orange-100 text-orange-700';
      case 'Saraswati': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kids Activities</h1>
          <p className="text-gray-600">Mythology-inspired adventures for emotional intelligence</p>
        </div>
        <Dialog open={isAddStorybookOpen} onOpenChange={setIsAddStorybookOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add to Family Storybook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Memory title" />
              <Textarea placeholder="Describe this special moment..." />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select className="w-full p-2 border rounded">
                    <option value="krishna">Krishna - Play & Joy</option>
                    <option value="hanuman">Hanuman - Service</option>
                    <option value="saraswati">Saraswati - Creativity</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Participants</label>
                  <Input placeholder="Child, Mom, Dad" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddStorybookOpen(false)}>
                  Cancel
                </Button>
                <Button>Save Memory</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kindness Jar Meter */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Kindness Jar</h3>
                <p className="text-sm text-gray-600">Building emotional intelligence through kindness</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-pink-600">{kindnessPoints}</div>
              <div className="text-sm text-pink-600">Kindness Points</div>
            </div>
          </div>

          <div className="mb-4">
            <Progress value={Math.min(kindnessPoints * 10, 100)} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Keep being kind!</span>
              <span>{Math.min(kindnessPoints * 10, 100)}% full</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleKindnessMoment('Shared toys with friend', 'Sharing')}
              className="flex-1 bg-pink-500 hover:bg-pink-600"
            >
              Shared Toys
            </Button>
            <Button
              onClick={() => handleKindnessMoment('Helped with dinner', 'Helping')}
              className="flex-1 bg-pink-500 hover:bg-pink-600"
            >
              Helped Parents
            </Button>
            <Button
              onClick={() => handleKindnessMoment('Comforted sad friend', 'Comforting')}
              className="flex-1 bg-pink-500 hover:bg-pink-600"
            >
              Comforted Friend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="daily">Daily Games</TabsTrigger>
          <TabsTrigger value="mythology">Mythology</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="storybook">Storybook</TabsTrigger>
        </TabsList>

        {/* Daily Games Tab */}
        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Emotion Explorers</h3>
            <Badge variant="outline" className="text-xs">
              <Book className="w-3 h-3 mr-1" />
              Building emotional vocabulary
            </Badge>
          </div>

          <div className="space-y-4">
            {emotionScenarios.map((scenario) => (
              <Card key={scenario.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{scenario.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {scenario.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getDifficultyColor(scenario.difficulty)}>
                          {scenario.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Parent & Child
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">How might {scenario.character} be feeling?</h5>
                    <div className="flex flex-wrap gap-3">
                      {scenario.emotions.map((emotion, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmotionSelect(emotion, scenario.emojis[index])}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                            selectedEmotion === emotion
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-1">{scenario.emojis[index]}</span>
                          <span className="text-sm text-gray-700">{emotion}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Parent Tip:</h5>
                    <p className="text-sm text-blue-800">
                      Talk about why the character might feel this way. This helps build emotional intelligence and empathy!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mythology Tab */}
        <TabsContent value="mythology" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Curiosity Q&A</h3>
            <Badge variant="outline" className="text-xs">
              <Feather className="w-3 h-3 mr-1" />
              Hindu Mythological Wisdom
            </Badge>
          </div>

          <div className="space-y-4">
            {mythologicalQuestions.map((question) => (
              <Card key={question.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCharacterColor(question.character)}`}>
                      <span className="text-lg">
                        {question.character === 'Krishna' ? '👦' :
                         question.character === 'Hanuman' ? '🐒' : '👩'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{question.question}</h4>
                      <p className="text-sm text-gray-600 mb-3">{question.context}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          5 min discussion
                        </Badge>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                        <h5 className="text-sm font-medium text-yellow-900 mb-2">💡 Answer:</h5>
                        <p className="text-sm text-yellow-800">{question.answer}</p>
                      </div>

                      <Button
                        onClick={() => handleMythologicalAnswer(question.id, question.answer)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                      >
                        Discuss with Child
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">This Week's Special Days</h3>
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              3 Days of Adventure
            </Badge>
          </div>

          <div className="space-y-6">
            {themedDays.map((day) => (
              <Card key={day.id} className={`overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-r ${day.color} bg-opacity-10`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${day.color} text-white`}>
                        {day.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{day.name}</h4>
                        <p className="text-sm text-gray-600">{day.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Target className="w-3 h-3 mr-1" />
                            {day.essence}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {day.parentRole}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day-specific activities */}
                  {day.id === 'krishna' && (
                    <div className="space-y-4">
                      {krishnaPranks.map((prank) => (
                        <div key={prank.id} className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{prank.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Helper:</strong> {prank.helperParent} | <strong>Target:</strong> {prank.targetParent}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">{prank.prompt}</p>
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Instructions:</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {prank.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  {instruction}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getDifficultyColor(prank.difficulty)}>
                              {prank.difficulty}
                            </Badge>
                            <Button
                              onClick={() => handlePrankComplete(prank.id)}
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              Complete Prank
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.id === 'hanuman' && (
                    <div className="space-y-4">
                      {hanumanTasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getDifficultyColor(task.difficulty)}>
                              {task.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimatedTime}
                            </Badge>
                          </div>
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Materials:</h6>
                            <div className="flex flex-wrap gap-1">
                              {task.materials.map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleTaskComplete(task.id)}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                            Complete Task
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.id === 'saraswati' && (
                    <div className="space-y-4">
                      {saraswatiCreatives.map((creative) => (
                        <div key={creative.id} className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{creative.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{creative.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getDifficultyColor('medium')}>
                              Creative
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {creative.estimatedTime}
                            </Badge>
                          </div>
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Materials:</h6>
                            <div className="flex flex-wrap gap-1">
                              {creative.materials.map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Prompts:</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {creative.prompts.map((prompt, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  {prompt}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            onClick={() => handleCreativeComplete(creative.id)}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                          >
                            Start Creating
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scheduler Tab */}
        <TabsContent value="scheduler" className="space-y-4">
          <KidsActivityScheduler />
        </TabsContent>

        {/* Storybook Tab */}
        <TabsContent value="storybook" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Family Storybook</h3>
            <Badge variant="outline" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              {storybookEntries.length} memories
            </Badge>
          </div>

          {storybookEntries.length === 0 ? (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Your Family Story</h4>
                <p className="text-gray-600 mb-4">
                  Complete activities to start building your family's mythology-inspired storybook!
                </p>
                <Button onClick={() => setIsAddStorybookOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Memory
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {storybookEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                          <Badge className={getCharacterColor(entry.type)}>
                            {entry.type === 'krishna' ? '👦 Krishna' :
                             entry.type === 'hanuman' ? '🐒 Hanuman' : '👩 Saraswati'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{entry.date.toLocaleDateString()}</span>
                          <span>{entry.participants.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4 mr-1" />
                        Add Photo
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4 mr-1" />
                        Remember
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}