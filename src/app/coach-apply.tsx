import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

const CITIES = ['宁波', '杭州', '上海'];
const GOALS = ['减脂', '增肌', '塑形', '康复'];

export default function CoachApplyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { submitCoachApplication } = useApp();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('宁波');
  const [goals, setGoals] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [price, setPrice] = useState('');
  const [intro, setIntro] = useState('');
  const [certInput, setCertInput] = useState('');
  const [certs, setCerts] = useState<string[]>([]);

  const toggleGoal = (g: string) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const addCert = () => {
    const v = certInput.trim();
    if (!v) return;
    setCerts((prev) => [...prev, v]);
    setCertInput('');
  };

  const removeCert = (c: string) => {
    setCerts((prev) => prev.filter((x) => x !== c));
  };

  const handleSubmit = () => {
    if (!name.trim()) return Alert.alert('提示', '请填写姓名');
    if (!title.trim()) return Alert.alert('提示', '请填写教练头衔');
    if (goals.length === 0) return Alert.alert('提示', '请至少选择一个擅长方向');
    if (certs.length === 0) return Alert.alert('提示', '请至少添加一个资质证书');
    submitCoachApplication({
      name: name.trim(),
      title: title.trim(),
      city,
      goals,
      experienceYears: experienceYears.trim() || '—',
      intro: intro.trim(),
      certifications: certs,
      price: price.trim() || '—',
    });
    Alert.alert('提交成功', '入驻申请已提交，平台审核通过后即可上线接单', [
      { text: '好的', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <ThemedText type="small" themeColor="textSecondary">
          填写以下信息申请入驻，审核通过后即可在平台接单
        </ThemedText>

        <ThemedText type="smallBold">姓名</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="你的姓名"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">教练头衔</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="如：力量训练专家"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">所在城市</ThemedText>
        <View style={styles.chipRow}>
          {CITIES.map((c) => {
            const active = c === city;
            return (
              <Pressable key={c} onPress={() => setCity(c)}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText type="smallBold" style={active ? styles.chipActiveText : undefined}>
                    {c}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="smallBold">擅长方向（可多选）</ThemedText>
        <View style={styles.chipRow}>
          {GOALS.map((g) => {
            const active = goals.includes(g);
            return (
              <Pressable key={g} onPress={() => toggleGoal(g)}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText type="smallBold" style={active ? styles.chipActiveText : undefined}>
                    {g}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="smallBold">从业年限（年）</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={experienceYears}
            onChangeText={setExperienceYears}
            keyboardType="numeric"
            placeholder="如 5"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">单次咨询价格（元）</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="如 99"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">简介</ThemedText>
        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={intro}
            onChangeText={setIntro}
            placeholder="介绍你的专业背景与训练理念"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedText type="smallBold">资质证书（至少一个）</ThemedText>
        <View style={styles.certAddRow}>
          <ThemedView type="backgroundElement" style={styles.certInputWrap}>
            <TextInput
              value={certInput}
              onChangeText={setCertInput}
              placeholder="如 NASM-CPT 国际认证"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              onSubmitEditing={addCert}
            />
          </ThemedView>
          <Pressable onPress={addCert}>
            <View style={[styles.addBtn, { backgroundColor: theme.accent }]}>
              <ThemedText type="smallBold" style={styles.btnText}>
                添加
              </ThemedText>
            </View>
          </Pressable>
        </View>

        {certs.map((c) => (
          <ThemedView key={c} type="backgroundElement" style={styles.certItem}>
            <ThemedText type="small">🎓 {c}</ThemedText>
            <Pressable onPress={() => removeCert(c)}>
              <ThemedText type="small" themeColor="accent">
                删除
              </ThemedText>
            </Pressable>
          </ThemedView>
        ))}

        <Pressable onPress={handleSubmit}>
          <View style={[styles.submitBtn, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={styles.btnText}>
              提交入驻申请
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.two },
  inputWrap: {
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: { paddingVertical: Spacing.three, fontSize: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  chipActiveText: { color: '#fff' },
  certAddRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  certInputWrap: { flex: 1, paddingHorizontal: Spacing.three, borderRadius: Spacing.three },
  addBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  certItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  submitBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
