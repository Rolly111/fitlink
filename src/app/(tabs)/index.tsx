import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { COACHES } from '@/data/coaches';
import { useTheme } from '@/hooks/use-theme';

const ENTRIES = [
  { icon: '🏋️', title: '找教练', desc: '匹配专业教练', route: '/coaches' },
  { icon: '💬', title: '免费提问', desc: '无压力提问', route: '/ask' },
  { icon: '🎯', title: '目标计划', desc: '设置健身目标', route: '/goals' },
  { icon: '👤', title: '我的', desc: '提问与订单', route: '/profile' },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { streak, hasCheckedInToday, checkInToday, goal, weekCheckins, questions, unreadCount } =
    useApp();

  const weekTrained = weekCheckins.filter(Boolean).length;
  const progress = Math.min(weekTrained / (goal.weeklySessions || 1), 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#FF6B35', '#FF7A59']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroTop}>
              <View>
                <ThemedText style={styles.heroTitle}>你好，健身小白 👋</ThemedText>
                <ThemedText style={styles.heroSub}>今天也要动起来</ThemedText>
              </View>
              <Pressable onPress={() => router.push('/notifications')}>
                <View style={styles.bell}>
                  <ThemedText style={styles.bellText}>🔔</ThemedText>
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>

            <Pressable onPress={checkInToday} disabled={hasCheckedInToday}>
              <View style={styles.checkinPill}>
                <ThemedText style={styles.checkinText}>
                  {hasCheckedInToday ? '今日已打卡 ✅' : '🔥 今日打卡'}
                </ThemedText>
              </View>
            </Pressable>
          </LinearGradient>

          <View style={styles.statsRow}>
            <StatCard
              icon="🔥"
              value={`${streak} 天`}
              label="连续打卡"
              onPress={() => router.push('/checkin')}
            />
            <StatCard
              icon="💪"
              value={`${weekTrained} 次`}
              label="本周训练"
              onPress={() => router.push('/checkin')}
            />
            <StatCard
              icon="💬"
              value={`${questions.length}`}
              label="我的提问"
              onPress={() => router.push('/profile')}
            />
          </View>

          <ThemedView type="backgroundElement" style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <ThemedText type="smallBold">🎯 我的目标：{goal.type}</ThemedText>
              <Pressable onPress={() => router.push('/goals')}>
                <ThemedText type="small" themeColor="accent">
                  调整
                </ThemedText>
              </Pressable>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress * 100}%`, backgroundColor: theme.accent },
                ]}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              本周已练 {weekTrained} 次 / 目标 {goal.weeklySessions} 次 · 目标体重 {goal.targetWeight}
              kg
            </ThemedText>
          </ThemedView>

          <View style={styles.grid}>
            {ENTRIES.map((e) => (
              <Pressable key={e.title} style={styles.gridItemWrap} onPress={() => router.push(e.route)}>
                <ThemedView type="backgroundElement" style={styles.gridItem}>
                  <ThemedText style={styles.gridIcon}>{e.icon}</ThemedText>
                  <ThemedText type="smallBold">{e.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {e.desc}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">推荐教练</ThemedText>
            <Pressable onPress={() => router.push('/coaches')}>
              <ThemedText themeColor="accent" type="smallBold">
                查看全部
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COACHES.slice(0, 5).map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push({ pathname: '/coach/[id]', params: { id: c.id } })}>
                <ThemedView type="backgroundElement" style={styles.coachCard}>
                  <View style={[styles.avatar, { backgroundColor: c.avatarColor }]}>
                    <ThemedText style={styles.avatarText}>{c.name[0]}</ThemedText>
                    <View
                      style={[
                        styles.onlineDot,
                        { backgroundColor: c.online ? '#22C55E' : theme.backgroundSelected },
                      ]}
                    />
                  </View>
                  <ThemedText type="smallBold">{c.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {c.title} · {c.city}
                  </ThemedText>
                  <ThemedText type="small" themeColor="accent">
                    ⭐ {c.rating}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  value,
  label,
  onPress,
}: {
  icon: string;
  value: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.statCardWrap} onPress={onPress}>
      <ThemedView type="backgroundElement" style={styles.statCard}>
        <ThemedText style={styles.statIcon}>{icon}</ThemedText>
        <ThemedText type="smallBold">{value}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three, paddingBottom: Spacing.six },
  hero: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: Spacing.one },
  bell: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: { fontSize: 18 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FF6B35', fontSize: 11, fontWeight: '700' },
  checkinPill: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  checkinText: { color: '#FF6B35', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: Spacing.three },
  statCardWrap: { flex: 1 },
  statCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statIcon: { fontSize: 20 },
  goalCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  gridItemWrap: { flex: 1, minWidth: '45%' },
  gridItem: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  gridIcon: { fontSize: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  coachCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginRight: Spacing.three,
    width: 120,
    alignItems: 'center',
    gap: Spacing.one,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
