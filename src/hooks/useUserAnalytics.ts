import { useState, useEffect } from 'react';

interface UserActivity {
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
  dailyActivity: Array<{
    date: string;
    hoursStudied: number;
    xpEarned: number;
    lessonsCompleted: number;
  }>;
  aiMaterialsGenerated: Array<{
    subject: string;
    topic: string;
    date: Date;
    type: 'study_material' | 'quiz';
    performance?: number;
  }>;
  lastActiveDate: string;
}

const STORAGE_KEY = 'user_analytics';

export const useUserAnalytics = () => {
  const [userActivity, setUserActivity] = useState<UserActivity>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        quizScores: parsed.quizScores?.map((score: any) => ({
          ...score,
          date: new Date(score.date)
        })) || [],
        aiMaterialsGenerated: parsed.aiMaterialsGenerated?.map((material: any) => ({
          ...material,
          date: new Date(material.date)
        })) || [],
        dailyActivity: parsed.dailyActivity || []
      };
    }
    
    return {
      totalXP: 0,
      currentStreak: 0,
      completedLessons: 0,
      totalLessons: 100,
      currentLevel: 'Beginner',
      weeklyGoal: 5,
      weeklyCompleted: 0,
      subjects: [
        { name: 'Mathematics', progress: 0, color: '#3B82F6', icon: '📊', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'Science', progress: 0, color: '#10B981', icon: '🔬', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'History', progress: 0, color: '#8B5CF6', icon: '📚', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'Literature', progress: 0, color: '#EC4899', icon: '📖', lessonsCompleted: 0, totalLessons: 25 }
      ],
      quizScores: [],
      dailyActivity: [],
      aiMaterialsGenerated: [],
      lastActiveDate: new Date().toDateString()
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userActivity));
  }, [userActivity]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(userActivity.lastActiveDate).toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (lastActive === today) {
      return;
    }
    
    let newStreak = userActivity.currentStreak;
    if (lastActive === yesterday) {
      newStreak += 1;
    } else if (lastActive !== today) {
      newStreak = 1;
    }
    
    setUserActivity(prev => ({
      ...prev,
      currentStreak: newStreak,
      lastActiveDate: today
    }));
  };

  const addQuizScore = (subject: string, score: number, totalQuestions: number, isAIGenerated: boolean = false) => {
    const xpEarned = score * 10;
    const today = new Date().toDateString();
    
    setUserActivity(prev => {
      const newQuizScores = [...prev.quizScores, {
        subject,
        score,
        totalQuestions,
        date: new Date(),
        isAIGenerated
      }];
      
      const todayActivity = prev.dailyActivity.find(day => day.date === today);
      const updatedDailyActivity = todayActivity 
        ? prev.dailyActivity.map(day => 
            day.date === today 
              ? { ...day, xpEarned: day.xpEarned + xpEarned }
              : day
          )
        : [...prev.dailyActivity, {
            date: today,
            hoursStudied: 0.5,
            xpEarned,
            lessonsCompleted: 0
          }];
      
      return {
        ...prev,
        totalXP: prev.totalXP + xpEarned,
        quizScores: newQuizScores,
        dailyActivity: updatedDailyActivity
      };
    });
    
    updateStreak();
  };

  const addAIMaterial = (subject: string, topic: string, type: 'study_material' | 'quiz', performance?: number) => {
    setUserActivity(prev => ({
      ...prev,
      aiMaterialsGenerated: [...prev.aiMaterialsGenerated, {
        subject,
        topic,
        date: new Date(),
        type,
        performance
      }]
    }));
  };

  const addStudySession = (subject: string, duration: number) => {
    const today = new Date().toDateString();
    const xpEarned = Math.floor(duration * 20); // 20 XP per hour
    
    setUserActivity(prev => {
      const todayActivity = prev.dailyActivity.find(day => day.date === today);
      const updatedDailyActivity = todayActivity 
        ? prev.dailyActivity.map(day => 
            day.date === today 
              ? { 
                  ...day, 
                  hoursStudied: day.hoursStudied + duration,
                  xpEarned: day.xpEarned + xpEarned
                }
              : day
          )
        : [...prev.dailyActivity, {
            date: today,
            hoursStudied: duration,
            xpEarned,
            lessonsCompleted: 0
          }];
      
      return {
        ...prev,
        totalXP: prev.totalXP + xpEarned,
        dailyActivity: updatedDailyActivity
      };
    });
    
    updateStreak();
  };

  const completeLesson = (subject: string) => {
    const xpEarned = 25;
    const today = new Date().toDateString();
    
    setUserActivity(prev => {
      const updatedSubjects = prev.subjects.map(subj => 
        subj.name === subject 
          ? {
              ...subj,
              lessonsCompleted: subj.lessonsCompleted + 1,
              progress: Math.min(100, ((subj.lessonsCompleted + 1) / subj.totalLessons) * 100)
            }
          : subj
      );
      
      const todayActivity = prev.dailyActivity.find(day => day.date === today);
      const updatedDailyActivity = todayActivity 
        ? prev.dailyActivity.map(day => 
            day.date === today 
              ? { 
                  ...day, 
                  xpEarned: day.xpEarned + xpEarned,
                  lessonsCompleted: day.lessonsCompleted + 1,
                  hoursStudied: day.hoursStudied + 0.5
                }
              : day
          )
        : [...prev.dailyActivity, {
            date: today,
            hoursStudied: 0.5,
            xpEarned,
            lessonsCompleted: 1
          }];
      
      const newCompletedLessons = prev.completedLessons + 1;
      const newWeeklyCompleted = Math.min(prev.weeklyGoal, prev.weeklyCompleted + 1);
      
      let newLevel = 'Beginner';
      const newTotalXP = prev.totalXP + xpEarned;
      if (newTotalXP >= 2000) newLevel = 'Expert';
      else if (newTotalXP >= 1000) newLevel = 'Advanced';
      else if (newTotalXP >= 500) newLevel = 'Intermediate';
      
      return {
        ...prev,
        totalXP: newTotalXP,
        completedLessons: newCompletedLessons,
        weeklyCompleted: newWeeklyCompleted,
        currentLevel: newLevel,
        subjects: updatedSubjects,
        dailyActivity: updatedDailyActivity
      };
    });
    
    updateStreak();
  };

  // Generate weekly data based on real user activity
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayActivity = userActivity.dailyActivity.find(activity => 
        new Date(activity.date).toDateString() === dateStr
      );
      
      weekData.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        hours: dayActivity?.hoursStudied || 0,
        xp: dayActivity?.xpEarned || 0
      });
    }
    
    return weekData;
  };

  // Generate performance trend based on quiz scores
  const getPerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const performanceData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = months[date.getMonth()];
      
      const monthlyQuizzes = userActivity.quizScores.filter(quiz => {
        const quizDate = new Date(quiz.date);
        return quizDate.getMonth() === date.getMonth() && 
               quizDate.getFullYear() === date.getFullYear();
      });
      
      const averageScore = monthlyQuizzes.length > 0 
        ? monthlyQuizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions * 100), 0) / monthlyQuizzes.length
        : 0;
      
      performanceData.push({
        month: monthStr,
        score: Math.round(averageScore)
      });
    }
    
    return performanceData;
  };

  return {
    userActivity,
    addQuizScore,
    addAIMaterial,
    addStudySession,
    completeLesson,
    updateStreak,
    getWeeklyData,
    getPerformanceData
  };
};
