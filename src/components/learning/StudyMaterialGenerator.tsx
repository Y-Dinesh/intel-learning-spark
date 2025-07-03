
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, HelpCircle, Wand2, Download, Share2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface StudyMaterial {
  id: string;
  type: 'summary' | 'flashcards' | 'quiz';
  title: string;
  content: any;
  subject: string;
  createdAt: Date;
}

const StudyMaterialGenerator = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  const generateSummary = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to generate a summary.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing

    const summary = {
      id: Date.now().toString(),
      type: 'summary' as const,
      title: `Summary: ${topic}`,
      content: {
        mainPoints: [
          `Key concept 1 about ${topic}: This fundamental principle explains the basic mechanics and underlying theory.`,
          `Key concept 2 about ${topic}: Understanding this helps connect the topic to real-world applications.`,
          `Key concept 3 about ${topic}: This advanced concept builds upon the foundational knowledge.`,
          `Practical applications: How ${topic} is used in everyday situations and professional contexts.`,
          `Common misconceptions: Important clarifications about ${topic} that students often misunderstand.`
        ],
        keyTerms: [
          { term: 'Primary Term', definition: `The most important concept in ${topic} studies.` },
          { term: 'Secondary Concept', definition: `A supporting idea that enhances understanding of ${topic}.` },
          { term: 'Advanced Principle', definition: `A complex aspect of ${topic} for deeper learning.` }
        ]
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [summary, ...prev]);
    setIsGenerating(false);
    toast({
      title: "Summary Generated!",
      description: `Created a comprehensive summary for ${topic}.`,
    });
  };

  const generateFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const flashcards = {
      id: Date.now().toString(),
      type: 'flashcards' as const,
      title: `Flashcards: ${topic}`,
      content: {
        cards: [
          {
            front: `What is the primary principle of ${topic}?`,
            back: `The primary principle involves understanding the fundamental concepts that govern how ${topic} works in practice.`
          },
          {
            front: `How does ${topic} apply to real-world situations?`,
            back: `${topic} is commonly used in various fields including science, technology, and everyday problem-solving scenarios.`
          },
          {
            front: `What are the key components of ${topic}?`,
            back: `The main components include theoretical foundations, practical applications, and analytical methods.`
          },
          {
            front: `Why is ${topic} important to study?`,
            back: `Understanding ${topic} provides critical thinking skills and knowledge applicable to many academic and professional areas.`
          },
          {
            front: `What are common mistakes when learning ${topic}?`,
            back: `Students often confuse basic concepts or skip foundational knowledge before advancing to complex topics.`
          }
        ]
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [flashcards, ...prev]);
    setIsGenerating(false);
    toast({
      title: "Flashcards Generated!",
      description: `Created ${flashcards.content.cards.length} flashcards for ${topic}.`,
    });
  };

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to generate a quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const quiz = {
      id: Date.now().toString(),
      type: 'quiz' as const,
      title: `Quiz: ${topic}`,
      content: {
        questions: [
          {
            question: `Which of the following best describes ${topic}?`,
            options: [
              'A complex theoretical framework',
              'A practical application method',
              'A fundamental principle with wide applications',
              'A specialized technical concept'
            ],
            correct: 2,
            explanation: `${topic} is best understood as a fundamental principle that has wide-ranging applications across multiple fields.`
          },
          {
            question: `What is the most important aspect to remember about ${topic}?`,
            options: [
              'Its historical development',
              'Its mathematical formulation',
              'Its practical applications',
              'Its theoretical foundations'
            ],
            correct: 3,
            explanation: `Understanding the theoretical foundations is crucial for mastering ${topic} and its applications.`
          },
          {
            question: `How does ${topic} relate to other concepts in ${subject}?`,
            options: [
              'It stands completely independent',
              'It builds upon basic principles',
              'It contradicts other theories',
              'It only applies in specific cases'
            ],
            correct: 1,
            explanation: `${topic} builds upon and connects with other fundamental principles in ${subject}.`
          }
        ]
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [quiz, ...prev]);
    setIsGenerating(false);
    toast({
      title: "Quiz Generated!",
      description: `Created a ${quiz.content.questions.length}-question quiz for ${topic}.`,
    });
  };

  const renderSummary = (material: StudyMaterial) => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Key Points:</h4>
        <ul className="space-y-2">
          {material.content.mainPoints.map((point: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Key Terms:</h4>
        <div className="space-y-2">
          {material.content.keyTerms.map((term: any, index: number) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium text-purple-700">{term.term}</h5>
              <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFlashcards = (material: StudyMaterial) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {material.content.cards.map((card: any, index: number) => (
        <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border">
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-blue-700 mb-2">Question {index + 1}:</h5>
              <p className="text-sm">{card.front}</p>
            </div>
            <div className="border-t pt-3">
              <h5 className="font-medium text-purple-700 mb-2">Answer:</h5>
              <p className="text-sm">{card.back}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuiz = (material: StudyMaterial) => (
    <div className="space-y-6">
      {material.content.questions.map((q: any, index: number) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium mb-3">Question {index + 1}: {q.question}</h5>
          <div className="space-y-2 mb-3">
            {q.options.map((option: string, optIndex: number) => (
              <div key={optIndex} className={`p-2 rounded ${optIndex === q.correct ? 'bg-green-100 border border-green-300' : 'bg-white border'}`}>
                <span className="text-sm">{String.fromCharCode(65 + optIndex)}. {option}</span>
                {optIndex === q.correct && <Badge className="ml-2 bg-green-600">Correct</Badge>}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Explanation:</strong> {q.explanation}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <span>AI Study Material Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                placeholder="Enter topic (e.g., Photosynthesis, Algebra, World War II)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={generateSummary}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </Button>
            <Button
              onClick={generateFlashcards}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-green-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Flashcards'}
            </Button>
            <Button
              onClick={generateQuiz}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-purple-700"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    {material.type === 'summary' && <FileText className="w-5 h-5 text-white" />}
                    {material.type === 'flashcards' && <CreditCard className="w-5 h-5 text-white" />}
                    {material.type === 'quiz' && <HelpCircle className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{material.subject}</Badge>
                      <span className="text-sm text-gray-500">
                        {material.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {material.type === 'summary' && renderSummary(material)}
              {material.type === 'flashcards' && renderFlashcards(material)}
              {material.type === 'quiz' && renderQuiz(material)}
            </CardContent>
          </Card>
        ))}
      </div>

      {materials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials generated yet</h3>
            <p className="text-gray-600 mb-4">Enter a topic above and generate your first study material!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyMaterialGenerator;
