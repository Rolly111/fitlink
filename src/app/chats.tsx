import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function ChatsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { conversations } = useApp();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {conversations.length === 0 ? (
          <ThemedView type="backgroundElement" style={styles.empty}>
            <ThemedText style={styles.emptyIcon}>💬</ThemedText>
            <ThemedText themeColor="textSecondary">还没有消息，去提问开启对话吧</ThemedText>
            <Pressable onPress={() => router.push('/coaches')}>
              <View style={[styles.goBtn, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={styles.btnText}>
                  找教练
                </ThemedText>
              </View>
            </Pressable>
          </ThemedView>
        ) : (
          <View style={styles.list}>
            {conversations.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <Pressable
                  key={c.id}
                  onPress={() =>
                    router.push({ pathname: '/conversation/[id]', params: { id: c.id } })
                  }>
                  <ThemedView type="backgroundElement" style={styles.chatItem}>
                    <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
                      <ThemedText style={styles.avatarText}>{c.coachName[0]}</ThemedText>
                    </View>
                    <View style={styles.chatBody}>
                      <View style={styles.chatHeader}>
                        <ThemedText type="smallBold">{c.coachName}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {last?.time}
                        </ThemedText>
                      </View>
                      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                        {last?.from === 'user' ? `我：${last.text}` : last?.text}
                      </ThemedText>
                    </View>
                  </ThemedView>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three },
  empty: {
    padding: Spacing.five,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.five,
  },
  emptyIcon: { fontSize: 40 },
  goBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  btnText: { color: '#fff' },
  list: { gap: Spacing.two },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  chatBody: { flex: 1, gap: Spacing.half },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
