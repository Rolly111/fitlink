import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

export default function CheckinScreen() {
  const theme = useTheme();
  const { streak, hasCheckedInToday, checkInToday, weekCheckins } = useApp();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF6B35', '#FF7A59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <ThemedText style={styles.heroValue}>🔥 {streak} 天</ThemedText>
          <ThemedText style={styles.heroLabel}>连续打卡</ThemedText>
        </LinearGradient>

        <Pressable onPress={checkInToday} disabled={hasCheckedInToday}>
          <View
            style={[
              styles.checkinBtn,
              { backgroundColor: hasCheckedInToday ? theme.backgroundElement : theme.accent },
            ]}>
            <ThemedText
              type="smallBold"
              style={hasCheckedInToday ? { color: theme.textSecondary } : styles.btnText}>
              {hasCheckedInToday ? '今日已打卡 ✅' : '今日打卡'}
            </ThemedText>
          </View>
        </Pressable>

        <ThemedText type="smallBold">本周打卡</ThemedText>
        <ThemedView type="backgroundElement" style={styles.weekRow}>
          {weekCheckins.map((done, i) => (
            <View key={i} style={styles.weekCell}>
              <ThemedText type="small" themeColor="textSecondary">
                {WEEK_LABELS[i]}
              </ThemedText>
              <View
                style={[styles.dot, { backgroundColor: done ? theme.accent : theme.backgroundSelected }]}
              />
            </View>
          ))}
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" style={styles.tip}>
          小提示：连续打卡 7 天、30 天会有里程碑奖励（即将上线）
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  hero: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
  heroValue: { color: '#fff', fontSize: 40, fontWeight: '700' },
  heroLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 16 },
  checkinBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
  btnText: { color: '#fff' },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  weekCell: { alignItems: 'center', gap: Spacing.two },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  tip: { textAlign: 'center' },
});
