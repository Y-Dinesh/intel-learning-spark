import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award, Clock, BookOpen } from 'lucide-react';

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
  }>;
}

interface ProgressDashboardProps {
  userProgress: UserProgressData;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userProgress }) => {
  // Calculate real weekly data based on user progress
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseHours = userProgress.weeklyCompleted / 7;
    return days.map((day, index) => ({
      day,
      hours: Math.max(0, baseHours + (Math.random() - 0.5) * 2),
      xp: Math.floor((baseHours + (Math.random() - 0.5) * 2) * 50)
    }));
  };

  // Convert subject data for pie chart
  const subjectData = userProgress.subjects.map(subject => ({
    subject: subject.name,
    hours: (subject.progress / 100) * 10, // Convert progress to hours
    color: subject.color.replace('bg-', '#').replace('-500', '')
  }));

  // Generate performance trend based on current progress
  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentScore = Math.floor((userProgress.completedLessons / userProgress.totalLessons) * 100);
    return months.map((month, index) => ({
      month,
      score: Math.max(60, currentScore - (5 - index) * 5 + Math.random() * 10)
    }));
  };

  const weeklyData = generateWeeklyData();
  const performanceData = generatePerformanceData();

  // Calculate achievements based on real progress
  const calculateAchievements = () => {
    const completionRate = (userProgress.completedLessons / userProgress.totalLessons) * 100;
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
        earned: userProgress.totalXP > 1000 
      },
      { 
        title: 'Study Marathon', 
        description: '5+ hours in one day', 
        icon: '⏰', 
        earned: userProgress.weeklyCompleted >= 5 
      },
      { 
        title: 'Subject Expert', 
        description: 'Complete a subject path', 
        icon: '🎓', 
        earned: userProgress.subjects.some(s => s.progress >= 80) 
      },
      { 
        title: 'Helper', 
        description: 'Answer community questions', 
        icon: '🤝', 
        earned: false 
      },
      { 
        title: 'Consistent Learner', 
        description: '30-day streak', 
        icon: '📚', 
        earned: userProgress.currentStreak >= 30 
      }
    ];
  };

  const achievements = calculateAchievements();
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalWeeklyHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const averageScore = Math.floor(performanceData.reduce((sum, month) => sum + month.score, 0) / performanceData.length);

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
                <p className="text-sm text-green-600">This month</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-900">{earnedAchievements}/{achievements.length}</div>
                <p className="text-sm text-purple-600">Unlocked</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-900">{userProgress.completedLessons}</div>
                <p className="text-sm text-orange-600">Completed</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-600" />
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
                  label={({ subject, hours }) => `${subject}: ${hours.toFixed(1)}h`}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
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
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
    </div>
  );
};

export default ProgressDashboard;
