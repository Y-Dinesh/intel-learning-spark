
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Lightbulb, BookOpen, Calculator, Beaker } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI learning assistant. I can help you with explanations, create study materials, answer questions, and guide you through complex topics. What would you like to learn about today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const input = userInput.toLowerCase();
    
    // Subject detection and responses
    if (input.includes('math') || input.includes('calculus') || input.includes('algebra') || input.includes('equation')) {
      const mathResponses = [
        "Great question about mathematics! Let me break this down step by step. Mathematics is all about patterns and logical thinking. Would you like me to create some practice problems for you?",
        "I love helping with math! Remember, the key to mastering mathematics is practice and understanding the underlying concepts. What specific topic would you like to explore?",
        "Mathematics can be challenging but rewarding! Let me explain this concept using a real-world example to make it clearer..."
      ];
      return mathResponses[Math.floor(Math.random() * mathResponses.length)];
    }
    
    if (input.includes('science') || input.includes('physics') || input.includes('chemistry') || input.includes('biology')) {
      const scienceResponses = [
        "Science is fascinating! Let me explain this concept using the scientific method. First, we observe, then we hypothesize, and finally we test our ideas.",
        "Excellent science question! Understanding the 'why' behind natural phenomena is what makes science so exciting. Let me break this down for you...",
        "Science is all around us! This concept connects to many real-world applications. Would you like me to show you some examples?"
      ];
      return scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
    }
    
    if (input.includes('history') || input.includes('historical') || input.includes('ancient') || input.includes('war')) {
      const historyResponses = [
        "History helps us understand how we got to where we are today! This period was particularly significant because of its lasting impact on modern society.",
        "What a fascinating historical topic! Understanding the context and causes of historical events helps us learn valuable lessons for today.",
        "History is full of amazing stories and important lessons! Let me put this event in its proper historical context..."
      ];
      return historyResponses[Math.floor(Math.random() * historyResponses.length)];
    }
    
    if (input.includes('literature') || input.includes('reading') || input.includes('book') || input.includes('novel')) {
      const literatureResponses = [
        "Literature opens up new worlds and perspectives! This work is particularly important because of its themes and literary techniques.",
        "Great choice in literature! Understanding the author's background and historical context can really enhance your appreciation of the work.",
        "Literary analysis is like detective work - we look for clues about meaning, themes, and the author's intentions. Let me guide you through this..."
      ];
      return literatureResponses[Math.floor(Math.random() * literatureResponses.length)];
    }
    
    // General responses
    const generalResponses = [
      "That's a great question! Let me think about the best way to explain this clearly. Learning is most effective when we connect new information to what you already know.",
      "I'm here to help you understand this concept thoroughly! The key is breaking complex ideas into smaller, manageable pieces.",
      "Excellent! I can see you're thinking deeply about this topic. Let me provide some additional context that might help clarify things.",
      "This is a common area where students have questions. You're definitely on the right track! Let me elaborate on the key points...",
      "I love your curiosity! Understanding the fundamentals is crucial before moving on to more advanced concepts. Here's what you need to know..."
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { text: "Explain photosynthesis", icon: <Beaker className="w-4 h-4" />, subject: "Science" },
    { text: "Help with algebra", icon: <Calculator className="w-4 h-4" />, subject: "Math" },
    { text: "Summarize World War II", icon: <BookOpen className="w-4 h-4" />, subject: "History" },
    { text: "Analyze Shakespeare", icon: <Lightbulb className="w-4 h-4" />, subject: "Literature" },
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>AI Learning Tutor</span>
              <Badge variant="secondary">Online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'ai' && <Bot className="w-4 h-4 mt-0.5 text-purple-600" />}
                        {message.sender === 'user' && <User className="w-4 h-4 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleQuickPrompt(prompt.text)}
              >
                <div className="flex items-center space-x-2">
                  {prompt.icon}
                  <div>
                    <div className="font-medium text-sm">{prompt.text}</div>
                    <div className="text-xs text-gray-500">{prompt.subject}</div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                <p>Ask specific questions for better explanations</p>
              </div>
              <div className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />
                <p>Request examples and practice problems</p>
              </div>
              <div className="flex items-start space-x-2">
                <Calculator className="w-4 h-4 text-green-500 mt-0.5" />
                <p>Break complex topics into smaller parts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITutor;
