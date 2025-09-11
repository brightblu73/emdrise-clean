import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Article {
  id: string;
  title: string;
  category: 'understanding' | 'preparation' | 'reprocessing' | 'self-care';
  description: string;
  content: string;
  readTime: string;
  tags: string[];
}

// Static therapeutic articles matching web app
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

**Grounding Techniques:** Use your five senses to stay present when memories feel overwhelming. Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.

**Resource Installation:** Identify personal strengths, supportive relationships, and positive experiences you can draw upon during challenging moments.

**Container Exercise:** Visualize a strong container where you can temporarily store difficult memories or emotions when you need a break from processing.`,
    readTime: '4 min',
    tags: ['preparation', 'safety', 'grounding']
  },
  {
    id: 'reprocessing-what-to-expect',
    title: 'Reprocessing: What to Expect During BLS',
    category: 'reprocessing',
    description: 'Understanding the reprocessing phase and how bilateral stimulation facilitates healing.',
    content: `During the reprocessing phase, you'll focus on your target memory while engaging in bilateral stimulation (BLS). Here's what typically happens:

**Initial Activation:** The memory may feel more intense at first - this is normal and indicates your brain is starting to process it.

**Natural Flow:** Allow whatever comes up to come up without trying to control it. Your brain knows how to heal itself.

**Changing Perspectives:** You might notice the memory becomes less vivid, less emotionally charged, or your understanding of it shifts.

**Physical Sensations:** Some people notice changes in their body - tension releasing, breathing deepening, or sensations moving through them.

**Trust the Process:** Each person's experience is unique. Trust that your brain is working to integrate the memory in a healthier way.`,
    readTime: '5 min',
    tags: ['reprocessing', 'BLS', 'healing process']
  },
  {
    id: 'self-care-after-emdr',
    title: 'Self-Care After EMDR Sessions',
    category: 'self-care',
    description: 'Important practices for supporting your healing journey between sessions.',
    content: `After EMDR sessions, gentle self-care supports your continued healing and integration:

**Rest and Hydration:** Processing can be tiring. Get adequate sleep and drink plenty of water.

**Gentle Movement:** Light exercise like walking or stretching can help your body integrate the work.

**Journaling:** Write about insights, dreams, or shifts you notice. This helps track your progress.

**Avoid Major Decisions:** Give yourself time to integrate before making significant life changes.

**Connect with Support:** Reach out to trusted friends, family, or your therapist if you need extra support.

**Be Patient:** Healing isn't linear. Some days will feel easier than others, and that's completely normal.

**Return to Your Safe Place:** Use the calm place visualization you developed whenever you need comfort or grounding.`,
    readTime: '4 min',
    tags: ['self-care', 'integration', 'healing']
  }
];

const ResourcesScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'understanding', label: 'Understanding' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'reprocessing', label: 'Reprocessing' },
    { id: 'self-care', label: 'Self-Care' },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? therapeuticArticles 
    : therapeuticArticles.filter(article => article.category === selectedCategory);

  if (selectedArticle) {
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
            <Text style={styles.readTime}>📖 {selectedArticle.readTime}</Text>
            <View style={styles.tagsContainer}>
              {selectedArticle.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>#{tag}</Text>
              ))}
            </View>
          </View>
          <Text style={styles.articleContent}>{selectedArticle.content}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resources</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>EMDR Resources</Text>
        <Text style={styles.pageDescription}>
          Educational articles and tools to support your EMDR therapy journey.
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

        {/* Emergency Resources */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>🆘 Crisis Support</Text>
          <Text style={styles.emergencyText}>
            If you're experiencing a mental health crisis, please reach out for immediate support:
          </Text>
          <View style={styles.emergencyLinks}>
            <Text style={styles.emergencyLink}>• Samaritans: 116 123 (free, 24/7)</Text>
            <Text style={styles.emergencyLink}>• Crisis Text Line: Text HOME to 85258</Text>
            <Text style={styles.emergencyLink}>• Emergency Services: 999</Text>
          </View>
        </View>
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
    backgroundColor: '#1E90FF',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
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
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
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
    color: '#1E90FF',
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
    color: '#1E90FF',
    marginTop: 20,
    marginBottom: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  readTime: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    fontSize: 12,
    color: '#05A660',
    fontWeight: '500',
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 40,
  },
  emergencySection: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyLinks: {
    gap: 4,
  },
  emergencyLink: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
});

export default ResourcesScreen;