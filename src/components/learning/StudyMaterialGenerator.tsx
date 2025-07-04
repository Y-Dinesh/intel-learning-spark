
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, HelpCircle, Plus, Download, Share2 } from 'lucide-react';
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
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  const createSummary = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your summary.",
        variant: "destructive",
      });
      return;
    }

    const summary = {
      id: Date.now().toString(),
      type: 'summary' as const,
      title: `Summary: ${title}`,
      content: {
        text: content || 'Add your summary content here...',
        mainPoints: []
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [summary, ...prev]);
    setTitle('');
    setContent('');
    toast({
      title: "Summary Created!",
      description: `Created summary for ${title}.`,
    });
  };

  const createFlashcards = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your flashcards.",
        variant: "destructive",
      });
      return;
    }

    const flashcards = {
      id: Date.now().toString(),
      type: 'flashcards' as const,
      title: `Flashcards: ${title}`,
      content: {
        cards: [
          { front: 'Sample Question 1', back: 'Sample Answer 1' },
          { front: 'Sample Question 2', back: 'Sample Answer 2' }
        ]
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [flashcards, ...prev]);
    setTitle('');
    setContent('');
    toast({
      title: "Flashcards Created!",
      description: `Created flashcards for ${title}.`,
    });
  };

  const createQuiz = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your quiz.",
        variant: "destructive",
      });
      return;
    }

    const quiz = {
      id: Date.now().toString(),
      type: 'quiz' as const,
      title: `Quiz: ${title}`,
      content: {
        questions: [
          {
            question: 'Sample question about ' + title,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: 0,
            explanation: 'This is a sample explanation.'
          }
        ]
      },
      subject: subject || 'General',
      createdAt: new Date()
    };

    setMaterials(prev => [quiz, ...prev]);
    setTitle('');
    setContent('');
    toast({
      title: "Quiz Created!",
      description: `Created quiz for ${title}.`,
    });
  };

  const renderSummary = (material: StudyMaterial) => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm whitespace-pre-wrap">{material.content.text}</p>
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
            <Plus className="w-5 h-5 text-purple-600" />
            <span>Create Study Materials</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Enter title for your study material"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
            
            <div>
              <label className="block text-sm font-medium mb-2">Content (Optional)</label>
              <Textarea
                placeholder="Add any additional content or notes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={createSummary}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Summary
            </Button>
            <Button
              onClick={createFlashcards}
              className="bg-gradient-to-r from-green-600 to-green-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Create Flashcards
            </Button>
            <Button
              onClick={createQuiz}
              className="bg-gradient-to-r from-purple-600 to-purple-700"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Create Quiz
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
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials created yet</h3>
            <p className="text-gray-600 mb-4">Create your first study material using the form above!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyMaterialGenerator;
