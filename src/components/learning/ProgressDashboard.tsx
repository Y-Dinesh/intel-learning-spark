
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award, Clock, BookOpen } from 'lucide-react';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

interface UserProgressData {
  totalXP: number;
  currentStreak: number;
  completedLessons: number;
  totalLessons: number;
  currentLevel: string;
  weeklyGoal: number;
  weeklyCompleted: number;
  subjects: Array<{
    name: string;
    progress: number;
    color: string;
    icon: string;
    lessonsCompleted: number;
    totalLessons: number;
  }>;
  quizScores: Array<{
    subject: string;
    score: number;
    totalQuestions: number;
    date: Date;
    isAIGenerated?: boolean;
  }>;
  aiMaterialsGenerated: Array<{
    subject: string;
    topic: string;
    date: Date;
    type: 'study_material' | 'quiz' | 'tutor_session';
    performance?: number;
  }>;
}

interface ProgressDashboardProps {
  userProgress: UserProgressData;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userProgress }) => {
  const { getWeeklyData, getPerformanceData } = useUserAnalytics();
  
  const weeklyData = getWeeklyData();
  const performanceData = getPerformanceData();

  // Helper function to format hours and minutes
  const formatHoursMinutes = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  // Convert subject data for pie chart with proper time formatting and colors
  const subjectData = userProgress.subjects.map(subject => ({
    subject: subject.name,
    hours: (subject.progress / 100) * 10, // Convert progress to hours studied
    fill: subject.color,
    formattedTime: formatHoursMinutes((subject.progress / 100) * 10)
  }));

  // Calculate achievements based on real progress
  const calculateAchievements = () => {
    const aiQuizzes = userProgress.quizScores.filter(q => q.isAIGenerated).length;
    const aiMaterials = userProgress.aiMaterialsGenerated.length;
    const perfectScores = userProgress.quizScores.filter(q => q.score === q.totalQuestions).length;
    
    return [
      { 
        title: 'Week Warrior', 
        description: '7-day learning streak', 
        icon: '🔥', 
        earned: userProgress.currentStreak >= 7 
      },
      { 
        title: 'Quiz Master', 
        description: '10 perfect quiz scores', 
        icon: '🎯', 
        earned: perfectScores >= 10 
      },
      { 
        title: 'AI Explorer', 
        description: 'Used AI quiz generation 5 times', 
        icon: '🤖', 
        earned: aiQuizzes >= 5 
      },
      { 
        title: 'Study Creator', 
        description: 'Generated 10 AI study materials', 
        icon: '📚', 
        earned: aiMaterials >= 10 
      },
      { 
        title: 'Subject Expert', 
        description: 'Complete a subject path', 
        icon: '🎓', 
        earned: userProgress.subjects.some(s => s.progress >= 80) 
      },
      { 
        title: 'Consistent Learner', 
        description: '30-day streak', 
        icon: '📖', 
        earned: userProgress.currentStreak >= 30 
      }
    ];
  };

  const achievements = calculateAchievements();
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalWeeklyHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const averageScore = performanceData.length > 0 
    ? Math.floor(performanceData.reduce((sum, month) => sum + month.score, 0) / performanceData.length)
    : 0;

  // AI-generated content stats
  const aiQuizCount = userProgress.quizScores.filter(q => q.isAIGenerated).length;
  const aiMaterialCount = userProgress.aiMaterialsGenerated.filter(m => m.type === 'study_material').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-900">{totalWeeklyHours.toFixed(1)}</div>
                <p className="text-sm text-blue-600">Hours studied</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-900">{averageScore}%</div>
                <p className="text-sm text-green-600">Quiz performance</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">AI Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-900">{aiQuizCount + aiMaterialCount}</div>
                <p className="text-sm text-purple-600">Generated items</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-900">{earnedAchievements}/{achievements.length}</div>
                <p className="text-sm text-orange-600">Unlocked</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Weekly Learning Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Subject Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="hours"
                  label={({ subject, formattedTime }) => `${subject}: ${formattedTime}`}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatHoursMinutes(value), 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{aiQuizCount}</div>
                  <div className="text-sm text-blue-600">AI Quizzes Taken</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{aiMaterialCount}</div>
                  <div className="text-sm text-green-600">Materials Generated</div>
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {userProgress.aiMaterialsGenerated.slice(-5).reverse().map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{material.topic}</div>
                      <div className="text-xs text-gray-600">{material.subject}</div>
                    </div>
                    <Badge variant={material.type === 'quiz' ? 'default' : 'secondary'}>
                      {material.type === 'quiz' ? '🧠 Quiz' : '📖 Material'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                    {achievement.earned && <Badge className="bg-yellow-600">Earned</Badge>}
                  </div>
                  <p className={`text-sm ${achievement.earned ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
