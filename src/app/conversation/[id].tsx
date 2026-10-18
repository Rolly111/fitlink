import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { getConversation, sendMessage } = useApp();
  const [text, setText] = useState('');

  const conversation = getConversation(id);

  if (!conversation) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText themeColor="textSecondary">会话不存在</ThemedText>
      </ThemedView>
    );
  }

  const handleSend = () => {
    const v = text.trim();
    if (!v) return;
    sendMessage(id, v);
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['bottom']}>
      <Stack.Screen options={{ title: conversation.coachName }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list}>
        {conversation.messages.map((m) => (
          <View
            key={m.id}
            style={[styles.msgRow, m.from === 'user' ? styles.userRow : styles.coachRow]}>
            {m.from === 'coach' && (
              <View style={[styles.msgAvatar, { backgroundColor: theme.accent }]}>
                <ThemedText style={styles.msgAvatarText}>{conversation.coachName[0]}</ThemedText>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                m.from === 'user'
                  ? [styles.userBubble, { backgroundColor: theme.accent }]
                  : [styles.coachBubble, { backgroundColor: theme.backgroundElement }],
              ]}>
              <ThemedText type="small" style={m.from === 'user' ? styles.userText : undefined}>
                {m.text}
              </ThemedText>
              <ThemedText
                type="small"
                style={m.from === 'user' ? styles.userTime : { color: theme.textSecondary }}>
                {m.time}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: theme.background }]}>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="输入消息…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            onSubmitEditing={handleSend}
          />
        </ThemedView>
        <Pressable onPress={handleSend}>
          <View style={[styles.sendBtn, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={styles.sendText}>
              发送
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.three, gap: Spacing.three },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  userRow: { justifyContent: 'flex-end' },
  coachRow: { justifyContent: 'flex-start' },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgAvatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bubble: {
    maxWidth: '75%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  userBubble: { borderBottomRightRadius: Spacing.one },
  coachBubble: { borderBottomLeftRadius: Spacing.one },
  userText: { color: '#fff' },
  userTime: { color: 'rgba(255,255,255,0.8)' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  inputWrap: { flex: 1, paddingHorizontal: Spacing.three, borderRadius: Spacing.five },
  input: { paddingVertical: Spacing.two, fontSize: 16 },
  sendBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  sendText: { color: '#fff' },
});
