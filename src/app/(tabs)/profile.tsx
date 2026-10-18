import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const MENU = [
  { icon: '💬', label: '我的消息', route: '/chats' },
  { icon: '🎯', label: '目标设置', route: '/goals' },
  { icon: '🔥', label: '训练打卡', route: '/checkin' },
  { icon: '🔔', label: '通知', route: '/notifications' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { questions, coachApplications, userRole, logout } = useApp();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <ThemedView type="backgroundElement" style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.avatarText}>{userRole === 'coach' ? '教' : '我'}</ThemedText>
          </View>
          <View>
            <ThemedText type="subtitle">
              {userRole === 'coach' ? '健身教练' : '健身小白'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {userRole === 'coach' ? '教练端' : '目标：减脂 · 新手'}
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.statsRow}>
          <ThemedView type="backgroundElement" style={styles.stat}>
            <ThemedText type="smallBold">{questions.length}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              我的提问
            </ThemedText>
          </ThemedView>
          <ThemedView type="backgroundElement" style={styles.stat}>
            <ThemedText type="smallBold">{coachApplications.length}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              入驻申请
            </ThemedText>
          </ThemedView>
        </View>

        <View style={styles.menuList}>
          {MENU.map((m) => (
            <Pressable key={m.label} onPress={() => router.push(m.route)}>
              <ThemedView type="backgroundElement" style={styles.menuItem}>
                <ThemedText style={styles.menuIcon}>{m.icon}</ThemedText>
                <ThemedText type="smallBold" style={styles.menuLabel}>
                  {m.label}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  ›
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => router.push('/coach-apply')}>
          <ThemedView type="backgroundElement" style={styles.applyCard}>
            <View style={styles.applyLeft}>
              <ThemedText style={styles.applyIcon}>🏋️</ThemedText>
              <View>
                <ThemedText type="smallBold">成为教练</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  申请入驻，上传资质证书
                </ThemedText>
              </View>
            </View>
            <ThemedText type="small" themeColor="accent">
              去申请 ›
            </ThemedText>
          </ThemedView>
        </Pressable>

        {coachApplications.length > 0 && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              我的入驻申请
            </ThemedText>
            <View style={styles.list}>
              {coachApplications.map((a) => (
                <ThemedView key={a.id} type="backgroundElement" style={styles.applyItem}>
                  <View style={styles.applyItemHeader}>
                    <ThemedText type="smallBold">
                      {a.name} · {a.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="accent">
                      {a.status}
                    </ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    📍 {a.city} · {a.goals.join(' / ')}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    🎓 {a.certifications.join('、')}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {a.createdAt} 提交
                  </ThemedText>
                </ThemedView>
              ))}
            </View>
          </>
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          我的提问
        </ThemedText>

        {questions.length === 0 ? (
          <ThemedView type="backgroundElement" style={styles.empty}>
            <ThemedText themeColor="textSecondary">还没有提问，去问个问题吧～</ThemedText>
            <Pressable onPress={() => router.push('/ask')}>
              <View style={[styles.askBtn, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={styles.btnText}>
                  去提问
                </ThemedText>
              </View>
            </Pressable>
          </ThemedView>
        ) : (
          <View style={styles.list}>
            {questions.map((q) => (
              <ThemedView key={q.id} type="backgroundElement" style={styles.qCard}>
                <View style={styles.qHeader}>
                  <ThemedText type="smallBold">{q.coachName}</ThemedText>
                  <ThemedText type="small" themeColor="accent">
                    {q.status}
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {q.serviceType}
                </ThemedText>
                <ThemedText type="small">{q.content}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {q.createdAt}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => {
            logout();
            router.replace('/login');
          }}>
          <ThemedView type="backgroundElement" style={styles.logoutBtn}>
            <ThemedText type="smallBold" themeColor="accent">
              退出登录
            </ThemedText>
          </ThemedView>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: Spacing.three },
  stat: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  menuList: { gap: Spacing.two },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1 },
  applyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  applyLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  applyIcon: { fontSize: 24 },
  sectionTitle: { marginTop: Spacing.two },
  applyItem: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  applyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: { gap: Spacing.three },
  qCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  empty: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.three,
  },
  askBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  btnText: { color: '#fff' },
  logoutBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
});
