import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { notifications, markAllRead } = useApp();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ThemedText type="subtitle">通知</ThemedText>
          <Pressable onPress={markAllRead}>
            <ThemedText type="smallBold" themeColor="accent">
              全部已读
            </ThemedText>
          </Pressable>
        </View>

        {notifications.length === 0 ? (
          <ThemedView type="backgroundElement" style={styles.empty}>
            <ThemedText themeColor="textSecondary">暂无通知</ThemedText>
          </ThemedView>
        ) : (
          <View style={styles.list}>
            {notifications.map((n) => (
              <ThemedView key={n.id} type="backgroundElement" style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    {!n.read && <View style={[styles.dot, { backgroundColor: theme.accent }]} />}
                    <ThemedText type="smallBold">{n.title}</ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {n.time}
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {n.body}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  list: { gap: Spacing.two },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
