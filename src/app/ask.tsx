import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { fetchCoachById } from '@/data/api';
import type { Coach, Service } from '@/data/coaches';
import { useTheme } from '@/hooks/use-theme';

const DEFAULT_SERVICES: Service[] = [
  { name: '免费提问', price: 0, desc: '限 1 个问题' },
  { name: '单次咨询', price: 99, desc: '30 分钟深度答疑' },
  { name: '定制训练计划', price: 299, desc: '4 周个性化计划' },
];

export default function AskScreen() {
  const { coachId, service } = useLocalSearchParams<{ coachId?: string; service?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { submitQuestion } = useApp();

  const [coach, setCoach] = useState<Coach | undefined>();
  const [selectedService, setSelectedService] = useState<string | undefined>(service);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (coachId) fetchCoachById(coachId).then(setCoach);
  }, [coachId]);

  const services = useMemo(() => coach?.services ?? DEFAULT_SERVICES, [coach]);

  const handleSubmit = () => {
    if (!selectedService) return Alert.alert('提示', '请选择一个服务类型');
    if (!content.trim()) return Alert.alert('提示', '请描述你的健身问题');
    const convId = submitQuestion({
      coachId: coach?.id ?? '',
      coachName: coach?.name ?? '平台教练',
      serviceType: selectedService,
      content: content.trim(),
    });
    router.replace({ pathname: '/conversation/[id]', params: { id: convId } });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {coach && (
          <ThemedView type="backgroundElement" style={styles.coachRow}>
            <View style={[styles.avatar, { backgroundColor: coach.avatarColor }]}>
              <ThemedText style={styles.avatarText}>{coach.name[0]}</ThemedText>
            </View>
            <View>
              <ThemedText type="smallBold">{coach.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {coach.title}
              </ThemedText>
            </View>
          </ThemedView>
        )}

        <ThemedText type="smallBold">选择服务类型</ThemedText>
        <View style={styles.serviceOptions}>
          {services.map((s) => {
            const active = selectedService === s.name;
            return (
              <Pressable key={s.name} onPress={() => setSelectedService(s.name)}>
                <View
                  style={[
                    styles.serviceOption,
                    { backgroundColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText type="smallBold" style={active ? styles.optionActiveText : undefined}>
                    {s.name}
                    {s.price === 0 ? '（免费）' : ` ¥${s.price}`}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="smallBold">描述你的问题</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="例如：我想减脂，一周练几次比较好？"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={6}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <Pressable onPress={handleSubmit}>
          <View style={[styles.submitBtn, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={styles.btnText}>
              提交提问
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  coachRow: {
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
  serviceOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  serviceOption: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  optionActiveText: { color: '#fff' },
  inputWrap: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
  submitBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16 },
});
