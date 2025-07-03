
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, Play, Trophy, Clock, Target } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number[];
}

const QuizSystem = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const quizzes = {
    mathematics: {
      title: 'Mathematics Quiz',
      subject: 'Mathematics',
      difficulty: 'Intermediate',
      questions: [
        {
          id: '1',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', 'x²', '2x²'],
          correct: 1,
          explanation: 'The derivative of x² is 2x. Using the power rule: d/dx(xⁿ) = n·xⁿ⁻¹',
          subject: 'Mathematics'
        },
        {
          id: '2',
          question: 'Solve for x: 2x + 5 = 13',
          options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
          correct: 1,
          explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4',
          subject: 'Mathematics'
        },
        {
          id: '3',
          question: 'What is the area of a circle with radius 5?',
          options: ['25π', '10π', '5π', '15π'],
          correct: 0,
          explanation: 'Area = πr², so with r = 5, Area = π(5)² = 25π',
          subject: 'Mathematics'
        }
      ]
    },
    science: {
      title: 'Science Quiz',
      subject: 'Science',
      difficulty: 'Beginner',
      questions: [
        {
          id: '1',
          question: 'What is the chemical symbol for water?',
          options: ['H₂O', 'CO₂', 'NaCl', 'CH₄'],
          correct: 0,
          explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom, hence H₂O',
          subject: 'Science'
        },
        {
          id: '2',
          question: 'What process do plants use to make food?',
          options: ['Respiration', 'Digestion', 'Photosynthesis', 'Fermentation'],
          correct: 2,
          explanation: 'Photosynthesis is the process where plants convert sunlight, water, and CO₂ into glucose',
          subject: 'Science'
        },
        {
          id: '3',
          question: 'What is the speed of light in vacuum?',
          options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
          correct: 0,
          explanation: 'Light travels at approximately 300,000 kilometers per second in vacuum',
          subject: 'Science'
        }
      ]
    },
    history: {
      title: 'World History Quiz',
      subject: 'History',
      difficulty: 'Intermediate',
      questions: [
        {
          id: '1',
          question: 'In which year did World War II end?',
          options: ['1944', '1945', '1946', '1947'],
          correct: 1,
          explanation: 'World War II ended in 1945 with the surrender of Japan in September',
          subject: 'History'
        },
        {
          id: '2',
          question: 'Who was the first President of the United States?',
          options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
          correct: 2,
          explanation: 'George Washington served as the first President from 1789 to 1797',
          subject: 'History'
        },
        {
          id: '3',
          question: 'The Renaissance period began in which country?',
          options: ['France', 'Germany', 'Italy', 'England'],
          correct: 2,
          explanation: 'The Renaissance began in Italy during the 14th century, particularly in Florence',
          subject: 'History'
        }
      ]
    }
  };

  const startQuiz = (quizKey: string) => {
    setSelectedQuiz(quizKey);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === '') {
      toast({
        title: "Please select an answer",
        description: "You must choose an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (currentQuestion < quizzes[selectedQuiz as keyof typeof quizzes].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      completeQuiz(newAnswers);
    }
  };

  const completeQuiz = (answers: number[]) => {
    if (startTime) {
      const endTime = new Date();
      const timeSpentSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(timeSpentSeconds);
    }
    
    setQuizCompleted(true);
    setShowResult(true);
    
    const correctCount = answers.reduce((count, answer, index) => {
      return count + (answer === quizzes[selectedQuiz as keyof typeof quizzes].questions[index].correct ? 1 : 0);
    }, 0);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${correctCount} out of ${answers.length} questions correctly.`,
    });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setUserAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
    setSelectedQuiz('');
    setStartTime(null);
    setTimeSpent(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Interactive Quiz System</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Test your knowledge with our AI-powered quizzes. Choose a subject to get started!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(quizzes).map(([key, quiz]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startQuiz(key)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{quiz.subject}</Badge>
                      <Badge variant="outline">{quiz.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{quiz.questions.length} questions</span>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Mathematics Quiz</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
                <Badge className="bg-green-600">85%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Science Quiz</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">92%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">History Quiz</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
                <Badge className="bg-purple-600">78%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuiz = quizzes[selectedQuiz as keyof typeof quizzes];
  const currentQ = currentQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;

  if (showResult) {
    const correctCount = userAnswers.reduce((count, answer, index) => {
      return count + (answer === currentQuiz.questions[index].correct ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span>Quiz Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">{percentage}%</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
                </h3>
                <p className="text-gray-600">
                  You scored {correctCount} out of {currentQuiz.questions.length} questions correctly
                </p>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Time: {formatTime(timeSpent)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Accuracy: {percentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentQuiz.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {userAnswers[index] === question.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">Question {index + 1}: {question.question}</h4>
                      <div className="space-y-1 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`p-2 rounded text-sm ${
                            optIndex === question.correct 
                              ? 'bg-green-100 text-green-800' 
                              : optIndex === userAnswers[index] && userAnswers[index] !== question.correct
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-50'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correct && ' ✓'}
                            {optIndex === userAnswers[index] && userAnswers[index] !== question.correct && ' ✗'}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button onClick={resetQuiz} variant="outline" className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Quiz</span>
          </Button>
          <Button onClick={() => startQuiz(selectedQuiz)} className="bg-gradient-to-r from-purple-600 to-blue-600">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentQuiz.title}</CardTitle>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <div className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetQuiz}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Exit Quiz</span>
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {currentQuestion === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizSystem;
