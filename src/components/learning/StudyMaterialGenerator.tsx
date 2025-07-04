
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, Sparkles, Brain, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface StudyMaterial {
  id: string;
  type: 'summary' | 'flashcard' | 'quiz';
  title: string;
  content: any;
  subject: string;
  createdAt: Date;
}

const StudyMaterialGenerator = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  const generateAIMaterial = async (type: 'summary' | 'flashcard' | 'quiz') => {
    if (!topic.trim() || !subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both topic and subject.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const apiKey = localStorage.getItem('openrouter_api_key');
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please set your OpenRouter API key in the AI Tutor tab first.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      let prompt = '';
      switch (type) {
        case 'summary':
          prompt = `Create a comprehensive study summary for the topic "${topic}" in ${subject}. Include key concepts, important facts, and main points. Format it clearly with headings and bullet points.`;
          break;
        case 'flashcard':
          prompt = `Create 10 flashcards for the topic "${topic}" in ${subject}. Format as JSON array with "question" and "answer" fields. Focus on key concepts and definitions.`;
          break;
        case 'quiz':
          prompt = `Create a 5-question multiple choice quiz about "${topic}" in ${subject}. Format as JSON array with "question", "options" (array of 4 choices), "correct" (index of correct answer), and "explanation" fields.`;
          break;
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Learning Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "system",
              "content": "You are an educational content generator. Create high-quality study materials that are accurate, well-structured, and educational."
            },
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "Failed to generate content.";

      let parsedContent;
      if (type === 'flashcard' || type === 'quiz') {
        try {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0]);
          } else {
            parsedContent = content;
          }
        } catch {
          parsedContent = content;
        }
      } else {
        parsedContent = content;
      }

      const newMaterial: StudyMaterial = {
        id: Date.now().toString(),
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${topic}`,
        content: parsedContent,
        subject,
        createdAt: new Date()
      };

      setMaterials(prev => [newMaterial, ...prev]);
      setActiveTab('materials');
      
      toast({
        title: "Material Generated!",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully.`,
      });

    } catch (error) {
      console.error('Error generating material:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate study material. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMaterial = (material: StudyMaterial) => {
    switch (material.type) {
      case 'summary':
        return (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{material.content}</pre>
          </div>
        );
      
      case 'flashcard':
        if (Array.isArray(material.content)) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {material.content.map((card: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="text-sm font-medium text-blue-600 mb-2">Question {index + 1}</div>
                  <div className="font-medium mb-2">{card.question}</div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Answer:</strong> {card.answer}
                  </div>
                </Card>
              ))}
            </div>
          );
        } else {
          return <pre className="whitespace-pre-wrap text-sm">{material.content}</pre>;
        }
      
      case 'quiz':
        if (Array.isArray(material.content)) {
          return (
            <div className="space-y-6">
              {material.content.map((question: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="font-medium mb-3">
                    {index + 1}. {question.question}
                  </div>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    {question.options?.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded border text-sm ${
                          optIndex === question.correct
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          );
        } else {
          return <pre className="whitespace-pre-wrap text-sm">{material.content}</pre>;
        }
      
      default:
        return <div>Unknown material type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Materials</TabsTrigger>
          <TabsTrigger value="materials">My Materials ({materials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>AI Study Material Generator</span>
              </CardTitle>
              <CardDescription>
                Generate personalized study materials using AI. Enter your topic and subject to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g., Mathematics, Biology, History"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="e.g., Photosynthesis, World War II"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => generateAIMaterial('summary')}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 h-auto p-4 flex-col"
                  variant="outline"
                >
                  <FileText className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="font-medium">Generate Summary</span>
                  <span className="text-xs text-gray-500 text-center">
                    Comprehensive overview with key points
                  </span>
                </Button>

                <Button
                  onClick={() => generateAIMaterial('flashcard')}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 h-auto p-4 flex-col"
                  variant="outline"
                >
                  <Brain className="w-8 h-8 text-green-600 mb-2" />
                  <span className="font-medium">Create Flashcards</span>
                  <span className="text-xs text-gray-500 text-center">
                    Interactive cards for quick review
                  </span>
                </Button>

                <Button
                  onClick={() => generateAIMaterial('quiz')}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 h-auto p-4 flex-col"
                  variant="outline"
                >
                  <HelpCircle className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="font-medium">Generate Quiz</span>
                  <span className="text-xs text-gray-500 text-center">
                    Test your knowledge with questions
                  </span>
                </Button>
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating AI content...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <div className="space-y-4">
            {materials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Yet</h3>
                  <p className="text-gray-500 mb-4">Generate some study materials to get started!</p>
                  <Button onClick={() => setActiveTab('generate')}>
                    Generate Materials
                  </Button>
                </CardContent>
              </Card>
            ) : (
              materials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{material.subject}</Badge>
                        <Badge variant="outline">{material.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Created on {material.createdAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderMaterial(material)}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyMaterialGenerator;
