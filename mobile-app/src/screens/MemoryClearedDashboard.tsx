import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, Alert } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { supabase } from '../services/supabase';

const brand = { bg: '#F7FAFC', card: '#FFFFFF', primary: '#1E90FF', accent: '#22A39F', text: '#0F172A', subtext: '#334155', radius: 16 };

interface MemoryClearedDashboardProps {
  onBack?: () => void;
}

export default function MemoryClearedDashboard({ onBack }: MemoryClearedDashboardProps = {}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCount = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCount(0); setLoading(false); return; }
    const { data, error } = await supabase.from('profiles').select('memory_cleared_count').eq('id', user.id).single();
    if (error) { console.log('[Dashboard] load error', error); setCount(0); } else { setCount(data?.memory_cleared_count ?? 0); }
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

          <TouchableOpacity onPress={onBack || (() => {})} style={styles.button} accessibilityRole="button" accessibilityLabel="Return to Home">
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
        <ConfettiCannon count={120} origin={{ x: 0, y: 0 }} fallSpeed={3000} fadeOut />
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
});