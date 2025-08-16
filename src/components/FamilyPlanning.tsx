'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Target, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Utensils,
  ShoppingCart,
  Heart,
  Plus,
  Star,
  Clock,
  CheckCircle,
  Plane,
  Car,
  Building
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  category: 'home' | 'travel' | 'financial' | 'lifestyle';
  targetDate: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  milestones: string[];
  description: string;
}

interface WeekendMealSuggestion {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  discount: number;
  priceForTwo: number;
  familyFriendly: boolean;
  weekendSpecial: boolean;
}

interface GrocerySuggestion {
  id: string;
  name: string;
  category: string;
  bestPrice: number;
  originalPrice: number;
  discount: number;
  store: string;
  urgency: 'high' | 'medium' | 'low';
  quantity: string;
  healthRating: number;
}

export function FamilyPlanning() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weekendMealSuggestions, setWeekendMealSuggestions] = useState<WeekendMealSuggestion[]>([]);
  const [grocerySuggestions, setGrocerySuggestions] = useState<GrocerySuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          title: 'Buy Our First Home',
          category: 'home',
          targetDate: '2025-12-31',
          targetAmount: 5000000,
          currentAmount: 1200000,
          priority: 'high',
          status: 'active',
          milestones: ['Save ₹20L down payment', 'Get loan pre-approved', 'Find perfect location'],
          description: 'Dream home in a family-friendly neighborhood with good schools'
        },
        {
          id: '2',
          title: 'Europe Family Vacation',
          category: 'travel',
          targetDate: '2024-08-15',
          targetAmount: 500000,
          currentAmount: 350000,
          priority: 'medium',
          status: 'active',
          milestones: ['Book flights', 'Plan itinerary', 'Get visas'],
          description: '2-week trip to Paris, Rome, and Barcelona with kids'
        },
        {
          id: '3',
          title: 'Emergency Fund',
          category: 'financial',
          targetDate: '2024-06-30',
          targetAmount: 1000000,
          currentAmount: 850000,
          priority: 'high',
          status: 'active',
          milestones: ['Reach ₹5L', 'Reach ₹8L', 'Reach ₹10L'],
          description: '6 months of expenses as financial safety net'
        },
        {
          id: '4',
          title: 'New Family Car',
          category: 'lifestyle',
          targetDate: '2024-10-31',
          targetAmount: 1200000,
          currentAmount: 300000,
          priority: 'medium',
          status: 'active',
          milestones: ['Research models', 'Test drive', 'Final decision'],
          description: '7-seater SUV for family trips and daily commute'
        }
      ]);

      setWeekendMealSuggestions([
        {
          id: '1',
          name: 'Family Weekend Thali',
          restaurant: 'Biryani House',
          cuisine: 'North Indian',
          rating: 4.6,
          deliveryTime: '30-40 min',
          minOrder: 299,
          discount: 20,
          priceForTwo: 599,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '2',
          name: 'Weekend Pizza Feast',
          restaurant: 'Pizza Paradise',
          cuisine: 'Italian',
          rating: 4.4,
          deliveryTime: '25-35 min',
          minOrder: 399,
          discount: 15,
          priceForTwo: 799,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '3',
          name: 'Chinese Family Combo',
          restaurant: 'Dragon Palace',
          cuisine: 'Chinese',
          rating: 4.3,
          deliveryTime: '35-45 min',
          minOrder: 349,
          discount: 25,
          priceForTwo: 699,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '4',
          name: 'Weekend Brunch Special',
          restaurant: 'Cafe Coffee Day',
          cuisine: 'Continental',
          rating: 4.2,
          deliveryTime: '20-30 min',
          minOrder: 249,
          discount: 10,
          priceForTwo: 449,
          familyFriendly: true,
          weekendSpecial: true
        }
      ]);

      setGrocerySuggestions([
        {
          id: '1',
          name: 'Premium Basmati Rice 5kg',
          category: 'Grains',
          bestPrice: 450,
          originalPrice: 650,
          discount: 31,
          store: 'BigBasket',
          urgency: 'medium',
          quantity: '5kg',
          healthRating: 4.5
        },
        {
          id: '2',
          name: 'Extra Virgin Olive Oil 1L',
          category: 'Cooking Oil',
          bestPrice: 680,
          originalPrice: 950,
          discount: 28,
          store: 'Amazon Fresh',
          urgency: 'medium',
          quantity: '1L',
          healthRating: 5.0
        },
        {
          id: '3',
          name: 'Organic Honey 500g',
          category: 'Sweeteners',
          bestPrice: 320,
          originalPrice: 450,
          discount: 29,
          store: 'Blinkit',
          urgency: 'low',
          quantity: '500g',
          healthRating: 4.8
        },
        {
          id: '4',
          name: 'Premium Dry Fruits Mix 1kg',
          category: 'Dry Fruits',
          bestPrice: 890,
          originalPrice: 1200,
          discount: 26,
          store: 'FreshToHome',
          urgency: 'low',
          quantity: '1kg',
          healthRating: 4.9
        },
        {
          id: '5',
          name: 'Imported Cheese Pack',
          category: 'Dairy',
          bestPrice: 750,
          originalPrice: 950,
          discount: 21,
          store: 'BigBasket',
          urgency: 'medium',
          quantity: '500g',
          healthRating: 4.2
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'travel': return <Plane className="w-5 h-5" />;
      case 'financial': return <DollarSign className="w-5 h-5" />;
      case 'lifestyle': return <Car className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'home': return 'bg-blue-100 text-blue-700';
      case 'travel': return 'bg-purple-100 text-purple-700';
      case 'financial': return 'bg-green-100 text-green-700';
      case 'lifestyle': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
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
          <h1 className="text-2xl font-bold text-gray-900">Family Planning</h1>
          <p className="text-gray-600">Plan your couple goals, weekend meals, and smart grocery shopping</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {goals.filter(g => g.status === 'active').length}
            </div>
            <div className="text-sm text-blue-600">Active Goals</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">
              {weekendMealSuggestions.filter(m => m.weekendSpecial).length}
            </div>
            <div className="text-sm text-orange-600">Weekend Specials</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">
              {grocerySuggestions.filter(g => g.discount > 25).length}
            </div>
            <div className="text-sm text-purple-600">Hot Deals</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Couple Goals</TabsTrigger>
          <TabsTrigger value="meals">Weekend Meals</TabsTrigger>
          <TabsTrigger value="grocery">Grocery Deals</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                goal.status === 'completed' ? 'bg-green-50 border-green-200' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        {goal.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(goal.category)}>
                          {getCategoryIcon(goal.category)}
                          <span className="ml-1">{goal.category}</span>
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(goal.currentAmount / goal.targetAmount) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones:</h4>
                        <div className="space-y-1">
                          {goal.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className={`w-4 h-4 ${index < 2 ? 'text-green-500' : 'text-gray-300'}`} />
                              {milestone}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="space-y-4">
            {weekendMealSuggestions.map((meal) => (
              <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                        {meal.weekendSpecial && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            🎉 Weekend Special
                          </Badge>
                        )}
                        {meal.familyFriendly && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            👨‍👩‍👧‍👦 Family Friendly
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          🍽️ {meal.cuisine}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ⭐ {meal.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          🚚 {meal.deliveryTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {meal.restaurant} • Min order: ₹{meal.minOrder}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">₹{meal.priceForTwo}</div>
                          <div className="text-xs text-gray-500">for two</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{meal.discount}% OFF</div>
                          <div className="text-xs text-gray-500">discount</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Menu
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grocery" className="space-y-4">
          <div className="space-y-4">
            {grocerySuggestions.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        {item.bestPrice > 500 && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            💎 High Value
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.category} • {item.quantity}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.bestPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          {item.discount}% OFF
                        </Badge>
                        {item.discount > 25 && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            🔥 Hot Deal
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Health Rating: ⭐ {item.healthRating}/5
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.store}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}