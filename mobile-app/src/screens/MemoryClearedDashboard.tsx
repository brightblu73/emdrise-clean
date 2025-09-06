import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { getCurrentClearedMemories } from '../services/progress';

const brand = {
  bg: '#F7FAFC',
  card: '#FFFFFF',
  primary: '#1E90FF',
  accent: '#22A39F',
  text: '#0F172A',
  subtext: '#334155',
  radius: 16,
};

interface MemoryClearedDashboardProps {
  onBack?: () => void;
}

export default function MemoryClearedDashboard({ onBack }: MemoryClearedDashboardProps = {}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCount = useCallback(async () => {
    setLoading(true);
    const clearedCount = await getCurrentClearedMemories();
    setCount(clearedCount);
    setLoading(false);
  }, []);

  useEffect(() => { loadCount(); }, [loadCount]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>
            You've just cleared another memory. That takes real courage and strength — well done!
          </Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.countLabel}>Memories cleared</Text>
              <Text style={styles.countValue}>{count ?? 0}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onBack || (() => {})}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Return to Home"
          >
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Simple confetti animation using View components since we couldn't install the package */}
        <View style={styles.confettiContainer}>
          {[...Array(20)].map((_, i) => (
            <View key={i} style={[styles.confetti, { 
              left: Math.random() * 300,
              animationDelay: Math.random() * 2000,
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]
            }]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brand.bg },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: brand.bg },
  card: { width: '100%', padding: 20, backgroundColor: brand.card, borderRadius: brand.radius, elevation: 6, gap: 16 },
  emoji: { fontSize: 48, textAlign: 'center' },
  title: { fontSize: 20, textAlign: 'center', color: brand.text, lineHeight: 28 },
  countLabel: { marginTop: 8, fontSize: 14, color: brand.subtext },
  countValue: { fontSize: 40, fontWeight: '700', color: brand.accent, marginTop: 6 },
  button: { marginTop: 20, backgroundColor: brand.primary, paddingVertical: 14, borderRadius: brand.radius },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});