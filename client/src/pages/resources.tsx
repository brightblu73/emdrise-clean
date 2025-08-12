import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../state/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BookOpen, Lightbulb, Shield, Heart, Download, ExternalLink, FileText } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: 'understanding' | 'preparation' | 'reprocessing' | 'self-care';
  description: string;
  content: string;
  readTime: string;
  tags: string[];
}

// Static therapeutic articles
const therapeuticArticles: Article[] = [
  {
    id: 'understanding-emdr',
    title: 'Understanding EMDR: How Your Brain Heals Trauma',
    category: 'understanding',
    description: 'Learn how EMDR therapy works and what happens in your brain during reprocessing.',
    content: `EMDR (Eye Movement Desensitization and Reprocessing) helps your brain process traumatic memories naturally. When we experience trauma, memories can get "stuck" in our emotional brain, causing ongoing distress.

During EMDR, bilateral stimulation (eye movements, sounds, or tapping) activates both sides of your brain, helping it process these stuck memories. This allows the memory to move from your emotional brain to your rational brain, where it becomes less disturbing.

The process is like defragmenting a computer - reorganizing information so it works better. You'll still remember what happened, but it won't feel as overwhelming or trigger strong emotional reactions.`,
    readTime: '3 min',
    tags: ['brain science', 'healing', 'memory processing']
  },
  {
    id: 'preparation-techniques',
    title: 'Preparing for EMDR: Building Your Foundation',
    category: 'preparation',
    description: 'Essential techniques to help you feel safe and ready for reprocessing work.',
    content: `Before starting EMDR reprocessing, building a strong foundation of safety and stability is crucial. Here are key preparation techniques:

**Safe Place Visualization:** Create a detailed mental image of a place where you feel completely safe and calm. This becomes your retreat during processing.

**Resource Installation:** Identify your inner strengths, supportive people, and positive qualities. These resources support you during difficult moments.

**Grounding Techniques:** Practice breathing exercises, body awareness, and mindfulness to stay present when emotions arise.

**Window of Tolerance:** Learn to recognize when you're in your optimal zone for processing versus when you need to pause and regulate.

Remember: Going slow builds a stronger foundation for healing.`,
    readTime: '4 min',
    tags: ['preparation', 'safety', 'grounding', 'resources']
  },
  {
    id: 'during-reprocessing',
    title: 'What to Expect During Reprocessing',
    category: 'reprocessing',
    description: 'Navigate the reprocessing experience with confidence and understanding.',
    content: `During EMDR reprocessing, you might experience various sensations and emotions. This is normal and indicates your brain is working to heal.

**Common Experiences:**
- Images, thoughts, or memories may shift and change
- Physical sensations in your body
- Emotions may intensify before they decrease
- New insights or perspectives may emerge

**"What do you notice now?"** This question helps you observe without judgment. Simply notice whatever comes up - there's no right or wrong response.

**Stay Curious:** Approach the process with curiosity rather than fear. Your brain knows how to heal when given the right conditions.

**Trust the Process:** Sometimes processing feels chaotic before it becomes clear. Trust that your brain is doing important work.

If you feel overwhelmed, use your safe place or let your therapist know you need a break.`,
    readTime: '5 min',
    tags: ['reprocessing', 'expectations', 'healing process']
  },
  {
    id: 'self-care-between-sessions',
    title: 'Self-Care Between EMDR Sessions',
    category: 'self-care',
    description: 'Essential practices to support your healing journey between therapy sessions.',
    content: `Your healing continues between EMDR sessions. Here's how to support yourself:

**Gentle Activities:** Choose nurturing activities like walks in nature, warm baths, or listening to calming music.

**Stay Hydrated:** Processing takes energy. Drink plenty of water and eat nourishing foods.

**Rest and Sleep:** Your brain consolidates healing during sleep. Prioritize good sleep hygiene.

**Journal:** Write about any dreams, memories, or insights that arise between sessions.

**Limit Stressors:** When possible, avoid major decisions or high-stress situations immediately after sessions.

**Connect with Support:** Reach out to trusted friends or family when you need connection.

**Use Your Resources:** Practice your safe place visualization and connect with your inner strengths.

Remember: Healing isn't linear. Some days will feel harder than others, and that's completely normal.`,
    readTime: '4 min',
    tags: ['self-care', 'between sessions', 'healing support']
  },
  {
    id: 'managing-activation',
    title: 'Managing Emotional Activation',
    category: 'reprocessing',
    description: 'Tools for staying grounded when emotions feel overwhelming.',
    content: `Sometimes during or after EMDR, emotions can feel intense. Here are tools to help you manage activation:

**Breathing Techniques:**
- 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8
- Box breathing: 4 counts in, hold 4, out 4, hold 4

**Grounding Exercises:**
- 5-4-3-2-1: Notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste
- Feel your feet on the ground
- Hold a cold object or splash cold water on your face

**Body-Based Techniques:**
- Gentle stretching or yoga
- Bilateral tapping on your knees
- Progressive muscle tension and release

**Cognitive Strategies:**
- Remind yourself: "This feeling will pass"
- "I am safe in this moment"
- "My brain is healing"

If activation persists or feels unmanageable, contact your therapist or crisis support.`,
    readTime: '6 min',
    tags: ['activation', 'grounding', 'emotional regulation', 'coping skills']
  },
  {
    id: 'building-positive-resources',
    title: 'Building Your Internal Resource Library',
    category: 'preparation',
    description: 'Strengthen your inner resources to support the healing process.',
    content: `Strong internal resources provide stability during EMDR processing. Here's how to build and strengthen them:

**Wise Figure:** Imagine someone (real or fictional) who embodies wisdom and compassion. What would they tell you? How do they support you?

**Protective Figure:** Visualize someone or something that makes you feel completely safe and protected. This could be a person, animal, or even a symbolic presence.

**Nurturing Figure:** Think of someone who offers unconditional love and care. How does it feel to receive their nurturing?

**Personal Strengths:** Identify times you showed courage, resilience, kindness, or determination. These qualities live within you always.

**Positive Memories:** Recall moments of joy, accomplishment, love, or peace. These memories are resources you can access anytime.

**Installation Practice:** Spend time each day connecting with these resources through visualization and feeling their positive qualities in your body.

Strong resources make the healing journey feel less alone and more supported.`,
    readTime: '5 min',
    tags: ['resources', 'inner strength', 'visualization', 'support']
  }
];

const practicalTools = [
  {
    title: 'Grounding Exercise Audio Guide',
    description: 'A 5-minute guided practice to help you feel centered and present.',
    type: 'audio',
    duration: '5 min'
  },
  {
    title: 'Safe Place Visualization Worksheet',
    description: 'Step-by-step guide to create and strengthen your safe place.',
    type: 'worksheet',
    downloadable: true
  },
  {
    title: 'Daily Resource Practice',
    description: 'Simple exercises to connect with your inner strengths each day.',
    type: 'guide',
    downloadable: true
  },
  {
    title: 'Emotional Regulation Toolkit',
    description: 'Quick reference for managing difficult emotions between sessions.',
    type: 'toolkit',
    downloadable: true
  }
];

export default function Resources() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("articles");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to access resources.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-space-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Therapeutic Resources</h1>
          <p className="text-lg text-slate-600">Essential tools and knowledge for your healing journey</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Therapeutic Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Articles
              </Button>
              <Button
                variant={selectedCategory === "understanding" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("understanding")}
              >
                Understanding EMDR
              </Button>
              <Button
                variant={selectedCategory === "preparation" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("preparation")}
              >
                Preparation
              </Button>
              <Button
                variant={selectedCategory === "reprocessing" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("reprocessing")}
              >
                Reprocessing
              </Button>
              <Button
                variant={selectedCategory === "self-care" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("self-care")}
              >
                Self-Care
              </Button>
            </div>

            {selectedArticle ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">{selectedArticle.category}</Badge>
                        <span className="text-sm text-slate-500">{selectedArticle.readTime} read</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedArticle(null)}
                    >
                      Back to Articles
                    </Button>
                  </div>
                  
                  {/* Category Navigation in Article View */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["understanding", "preparation", "reprocessing", "self-care"].map((category) => (
                      <Button
                        key={category}
                        variant={selectedArticle.category === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          const firstArticleInCategory = therapeuticArticles.find(a => a.category === category);
                          if (firstArticleInCategory && firstArticleInCategory.id !== selectedArticle.id) {
                            setSelectedArticle(firstArticleInCategory);
                          }
                        }}
                      >
                        {category === "understanding" && "Understanding EMDR"}
                        {category === "preparation" && "Preparation"}
                        {category === "reprocessing" && "Reprocessing"}
                        {category === "self-care" && "Self-Care"}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Related Articles Navigation */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4">More in {selectedArticle.category}</h4>
                    <div className="grid gap-2">
                      {therapeuticArticles
                        .filter(article => article.category === selectedArticle.category && article.id !== selectedArticle.id)
                        .map((article) => (
                          <Button
                            key={article.id}
                            variant="ghost"
                            className="justify-start h-auto p-3"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <div className="text-left">
                              <div className="font-medium text-sm">{article.title}</div>
                              <div className="text-xs text-slate-500">{article.readTime}</div>
                            </div>
                          </Button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {therapeuticArticles
                  .filter(article => selectedCategory === "all" || article.category === selectedCategory)
                  .map((article) => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6" onClick={() => setSelectedArticle(article)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                            <p className="text-slate-600 text-sm mb-3">{article.description}</p>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">{article.category}</Badge>
                              <span className="text-xs text-slate-500">{article.readTime}</span>
                            </div>
                          </div>
                          <FileText className="h-5 w-5 text-slate-400 ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Practical Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid gap-4">
              {practicalTools.map((tool, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                        <p className="text-slate-600 text-sm mb-3">{tool.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{tool.type}</Badge>
                          {tool.duration && (
                            <span className="text-xs text-slate-500">{tool.duration}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {tool.downloadable && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Personal Resources Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Personal Resources</CardTitle>
                <p className="text-slate-600">Build your foundation of safety and inner strength for EMDR processing.</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Safe Place</h4>
                        <p className="text-sm text-slate-600">Create your sanctuary for calm and peace</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Wise Figure</h4>
                        <p className="text-sm text-slate-600">Connect with inner wisdom and guidance</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Protective Figure</h4>
                        <p className="text-sm text-slate-600">Feel safe and supported during processing</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crisis Support Resources</CardTitle>
                <p className="text-slate-600">If you're experiencing a crisis or need immediate support, please reach out.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Emergency Services</h4>
                  <p className="text-red-700 text-sm mb-2">If you're in immediate danger, call emergency services:</p>
                  <p className="font-bold text-red-800">911 (US) • 999 (UK) • 112 (EU)</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Crisis Helplines</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>National Suicide Prevention Lifeline (US):</strong> 988</p>
                    <p><strong>Samaritans (UK):</strong> 116 123</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Professional Support</h4>
                  <p className="text-green-700 text-sm">
                    Remember that this app is a supportive tool but doesn't replace professional therapy. 
                    Consider working with a qualified EMDR therapist for comprehensive treatment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}