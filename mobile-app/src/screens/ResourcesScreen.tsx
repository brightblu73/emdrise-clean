import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { EMDRiseColors } from '../constants/branding';

interface Article {
  id: string;
  title: string;
  category: 'understanding' | 'preparation' | 'reprocessing' | 'self-care';
  description: string;
  content: string;
  readTime: string;
  tags: string[];
}

interface Tool {
  title: string;
  description: string;
  type: string;
  duration?: string;
  downloadable?: boolean;
}

// Complete therapeutic articles matching web app exactly
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

// Practical tools from web app
const practicalTools: Tool[] = [
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

const ResourcesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Authentication gating like web app
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign In Required</Text>
          <Text style={styles.authMessage}>Please sign in to access therapeutic resources.</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tabs = [
    { id: 'articles', label: 'Articles', icon: '📚' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'personal', label: 'Personal', icon: '🛡️' },
    { id: 'support', label: 'Support', icon: '💚' },
  ];

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'understanding', label: 'Understanding EMDR' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'reprocessing', label: 'Reprocessing' },
    { id: 'self-care', label: 'Self-Care' },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? therapeuticArticles 
    : therapeuticArticles.filter(article => article.category === selectedCategory);

  // Handle tool access
  const handleToolAccess = (tool: Tool) => {
    if (tool.downloadable) {
      Alert.alert(
        'Download Resource',
        `Would you like to download ${tool.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => Alert.alert('Success', 'Resource downloaded to your device.') }
        ]
      );
    } else {
      Alert.alert('Access Tool', `Opening ${tool.title}...`);
    }
  };

  // Article detail view
  if (selectedArticle) {
    const relatedArticles = therapeuticArticles.filter(
      article => article.category === selectedArticle.category && article.id !== selectedArticle.id
    );

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setSelectedArticle(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to Resources</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
          
          <View style={styles.articleMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {selectedArticle.category.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.readTime}>📖 {selectedArticle.readTime}</Text>
          </View>

          {/* Category Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryNavContainer}
          >
            {['understanding', 'preparation', 'reprocessing', 'self-care'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryNavButton,
                  selectedArticle.category === category && styles.categoryNavButtonActive
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  const firstArticleInCategory = therapeuticArticles.find(a => a.category === category);
                  if (firstArticleInCategory && firstArticleInCategory.id !== selectedArticle.id) {
                    setSelectedArticle(firstArticleInCategory);
                  }
                }}
              >
                <Text style={[
                  styles.categoryNavButtonText,
                  selectedArticle.category === category && styles.categoryNavButtonTextActive
                ]}>
                  {category === 'understanding' && 'Understanding EMDR'}
                  {category === 'preparation' && 'Preparation'}
                  {category === 'reprocessing' && 'Reprocessing'}
                  {category === 'self-care' && 'Self-Care'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.articleContent}>{selectedArticle.content}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {selectedArticle.tags.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>More in {selectedArticle.category}</Text>
              {relatedArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.relatedArticle}
                  onPress={() => setSelectedArticle(article)}
                >
                  <Text style={styles.relatedArticleTitle}>{article.title}</Text>
                  <Text style={styles.relatedArticleTime}>{article.readTime}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main resources view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Therapeutic Resources</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'articles' && (
          <>
            <Text style={styles.pageTitle}>Essential Knowledge</Text>
            <Text style={styles.pageDescription}>
              Professional therapeutic guidance for your healing journey
            </Text>

            {/* Category Filter */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Articles List */}
            <View style={styles.articlesContainer}>
              {filteredArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => setSelectedArticle(article)}
                >
                  <View style={styles.articleHeader}>
                    <Text style={styles.articleCardTitle}>{article.title}</Text>
                    <Text style={styles.articleCardReadTime}>📖 {article.readTime}</Text>
                  </View>
                  <Text style={styles.articleCardDescription}>{article.description}</Text>
                  <View style={styles.articleCardTags}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Text key={index} style={styles.articleCardTag}>#{tag}</Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'tools' && (
          <>
            <Text style={styles.pageTitle}>Practical Tools</Text>
            <Text style={styles.pageDescription}>
              Guided exercises and resources for your healing toolkit
            </Text>
            
            <View style={styles.toolsContainer}>
              {practicalTools.map((tool, index) => (
                <View key={index} style={styles.toolCard}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                  <View style={styles.toolMeta}>
                    <View style={styles.toolTypeBadge}>
                      <Text style={styles.toolTypeText}>{tool.type}</Text>
                    </View>
                    {tool.duration && (
                      <Text style={styles.toolDuration}>{tool.duration}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => handleToolAccess(tool)}
                  >
                    <Text style={styles.toolButtonText}>
                      {tool.downloadable ? 'Download' : 'Access'} 📥
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'personal' && (
          <>
            <Text style={styles.pageTitle}>Personal Resources</Text>
            <Text style={styles.pageDescription}>
              Build your foundation of safety and inner strength for EMDR processing
            </Text>
            
            <View style={styles.personalContainer}>
              <View style={styles.resourceCard}>
                <Text style={styles.resourceIcon}>🏞️</Text>
                <Text style={styles.resourceTitle}>Safe Place</Text>
                <Text style={styles.resourceDescription}>
                  Create your sanctuary for calm and peace during processing
                </Text>
              </View>

              <View style={styles.resourceCard}>
                <Text style={styles.resourceIcon}>🧙‍♀️</Text>
                <Text style={styles.resourceTitle}>Wise Figure</Text>
                <Text style={styles.resourceDescription}>
                  Connect with inner wisdom and compassionate guidance
                </Text>
              </View>

              <View style={styles.resourceCard}>
                <Text style={styles.resourceIcon}>🛡️</Text>
                <Text style={styles.resourceTitle}>Protective Figure</Text>
                <Text style={styles.resourceDescription}>
                  Feel safe and supported during challenging moments
                </Text>
              </View>

              <View style={styles.resourceCard}>
                <Text style={styles.resourceIcon}>🤱</Text>
                <Text style={styles.resourceTitle}>Nurturing Figure</Text>
                <Text style={styles.resourceDescription}>
                  Experience unconditional love and care when needed
                </Text>
              </View>
            </View>
          </>
        )}

        {activeTab === 'support' && (
          <>
            <Text style={styles.pageTitle}>Crisis Support</Text>
            <Text style={styles.pageDescription}>
              If you're experiencing a crisis or need immediate support, please reach out
            </Text>

            {/* Emergency Services */}
            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyTitle}>🚨 Emergency Services</Text>
              <Text style={styles.emergencyText}>
                If you're in immediate danger, call emergency services:
              </Text>
              <Text style={styles.emergencyNumber}>911 (US) • 999 (UK) • 112 (EU)</Text>
            </View>

            {/* Crisis Helplines */}
            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>📞 Crisis Helplines</Text>
              <View style={styles.helplineContainer}>
                <Text style={styles.helplineText}>
                  <Text style={styles.helplineBold}>National Suicide Prevention Lifeline (US):</Text> 988
                </Text>
                <Text style={styles.helplineText}>
                  <Text style={styles.helplineBold}>Samaritans (UK):</Text> 116 123
                </Text>
                <Text style={styles.helplineText}>
                  <Text style={styles.helplineBold}>Crisis Text Line:</Text> Text HOME to 741741
                </Text>
              </View>
            </View>

            {/* Professional Support */}
            <View style={styles.professionalCard}>
              <Text style={styles.professionalTitle}>👩‍⚕️ Professional Support</Text>
              <Text style={styles.professionalText}>
                Remember that this app is a supportive tool but doesn't replace professional therapy. 
                Consider working with a qualified EMDR therapist for comprehensive treatment.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: EMDRiseColors.primaryBlue,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginBottom: 16,
    textAlign: 'center',
  },
  authMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: EMDRiseColors.primaryBlue,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: EMDRiseColors.primaryBlue,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginTop: 20,
    marginBottom: 8,
  },
  pageDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: EMDRiseColors.primaryBlue,
    borderColor: EMDRiseColors.primaryBlue,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  articlesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleCardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginRight: 8,
  },
  articleCardReadTime: {
    fontSize: 14,
    color: '#666',
  },
  articleCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  articleCardTag: {
    fontSize: 12,
    color: '#05A660',
    fontWeight: '500',
  },
  articleContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginTop: 20,
    marginBottom: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: EMDRiseColors.primaryBlue,
    fontWeight: '600',
  },
  readTime: {
    fontSize: 14,
    color: '#666',
  },
  categoryNavContainer: {
    marginBottom: 20,
  },
  categoryNavButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginRight: 8,
  },
  categoryNavButtonActive: {
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  categoryNavButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryNavButtonTextActive: {
    color: '#fff',
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  tagText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500',
  },
  relatedSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
    marginBottom: 40,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginBottom: 12,
  },
  relatedArticle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedArticleTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  relatedArticleTime: {
    fontSize: 12,
    color: '#666',
  },
  toolsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  toolCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  toolMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTypeBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  toolTypeText: {
    fontSize: 12,
    color: EMDRiseColors.primaryBlue,
    fontWeight: '500',
  },
  toolDuration: {
    fontSize: 12,
    color: '#666',
  },
  toolButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toolButtonText: {
    fontSize: 14,
    color: EMDRiseColors.primaryBlue,
    fontWeight: '500',
  },
  personalContainer: {
    gap: 16,
    marginBottom: 32,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  resourceIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: EMDRiseColors.primaryBlue,
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emergencyCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 8,
    lineHeight: 20,
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  supportCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: 12,
  },
  helplineContainer: {
    gap: 8,
  },
  helplineText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  helplineBold: {
    fontWeight: 'bold',
  },
  professionalCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  professionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
  },
  professionalText: {
    fontSize: 14,
    color: '#15803d',
    lineHeight: 20,
  },
});

export default ResourcesScreen;