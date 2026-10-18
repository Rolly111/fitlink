import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const GOAL_TYPES = ['减脂', '增肌', '塑形'];
const SESSION_OPTIONS = [2, 3, 4, 5];

export default function GoalsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { goal, setGoal } = useApp();

  const [type, setType] = useState(goal.type);
  const [targetWeight, setTargetWeight] = useState(goal.targetWeight);
  const [weeklySessions, setWeeklySessions] = useState(goal.weeklySessions);

  const handleSave = () => {
    setGoal({ type, targetWeight: targetWeight || '—', weeklySessions });
    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <ThemedText type="smallBold">我的目标</ThemedText>
        <View style={styles.typeRow}>
          {GOAL_TYPES.map((t) => {
            const active = t === type;
            return (
              <Pressable key={t} style={styles.typeWrap} onPress={() => setType(t)}>
                <View
                  style={[
                    styles.typeCard,
                    { backgroundColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText type="smallBold" style={active ? styles.activeText : undefined}>
                    {t}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="smallBold">目标体重（kg）</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            placeholder="例如 60"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">每周训练次数</ThemedText>
        <View style={styles.sessionRow}>
          {SESSION_OPTIONS.map((n) => {
            const active = n === weeklySessions;
            return (
              <Pressable key={n} style={styles.sessionWrap} onPress={() => setWeeklySessions(n)}>
                <View
                  style={[
                    styles.sessionCard,
                    { backgroundColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText type="smallBold" style={active ? styles.activeText : undefined}>
                    {n} 次
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={handleSave}>
          <View style={[styles.saveBtn, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={styles.btnText}>
              保存目标
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  typeRow: { flexDirection: 'row', gap: Spacing.two },
  typeWrap: { flex: 1 },
  typeCard: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  activeText: { color: '#fff' },
  inputWrap: {
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: { paddingVertical: Spacing.three, fontSize: 16 },
  sessionRow: { flexDirection: 'row', gap: Spacing.two },
  sessionWrap: { flex: 1 },
  sessionCard: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  saveBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
