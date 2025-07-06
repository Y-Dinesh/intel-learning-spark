
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
  }>;
  dailyActivity: Array<{
    date: string;
    hoursStudied: number;
    xpEarned: number;
    lessonsCompleted: number;
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
        { name: 'Mathematics', progress: 0, color: 'bg-blue-500', icon: '📊', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'Science', progress: 0, color: 'bg-green-500', icon: '🔬', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'History', progress: 0, color: 'bg-purple-500', icon: '📚', lessonsCompleted: 0, totalLessons: 25 },
        { name: 'Literature', progress: 0, color: 'bg-pink-500', icon: '📖', lessonsCompleted: 0, totalLessons: 25 }
      ],
      quizScores: [],
      dailyActivity: [],
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
      return; // Already active today
    }
    
    let newStreak = userActivity.currentStreak;
    if (lastActive === yesterday) {
      newStreak += 1; // Consecutive day
    } else if (lastActive !== today) {
      newStreak = 1; // Reset streak
    }
    
    setUserActivity(prev => ({
      ...prev,
      currentStreak: newStreak,
      lastActiveDate: today
    }));
  };

  const addQuizScore = (subject: string, score: number, totalQuestions: number) => {
    const xpEarned = score * 10; // 10 XP per correct answer
    const today = new Date().toDateString();
    
    setUserActivity(prev => {
      const newQuizScores = [...prev.quizScores, {
        subject,
        score,
        totalQuestions,
        date: new Date()
      }];
      
      // Update daily activity
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

  const completeLesson = (subject: string) => {
    const xpEarned = 25; // 25 XP per lesson
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
      
      // Update daily activity
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
      
      // Update level based on total XP
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

  const addStudySession = (subject: string, hours: number) => {
    const xpEarned = Math.floor(hours * 20); // 20 XP per hour
    const today = new Date().toDateString();
    
    setUserActivity(prev => {
      const todayActivity = prev.dailyActivity.find(day => day.date === today);
      const updatedDailyActivity = todayActivity 
        ? prev.dailyActivity.map(day => 
            day.date === today 
              ? { 
                  ...day, 
                  hoursStudied: day.hoursStudied + hours,
                  xpEarned: day.xpEarned + xpEarned
                }
              : day
          )
        : [...prev.dailyActivity, {
            date: today,
            hoursStudied: hours,
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

  return {
    userActivity,
    addQuizScore,
    completeLesson,
    addStudySession,
    updateStreak
  };
};
