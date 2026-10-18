import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { fetchCoaches } from '@/data/api';
import { CITIES, GOALS, type Coach } from '@/data/coaches';
import { useTheme } from '@/hooks/use-theme';

const SORTS = [
  { key: 'default', label: '综合' },
  { key: 'rating', label: '评分最高' },
  { key: 'price', label: '价格最低' },
  { key: 'experience', label: '经验最多' },
];

function minPrice(c: Coach) {
  const paid = c.services.filter((s) => s.price > 0).map((s) => s.price);
  return paid.length ? Math.min(...paid) : 0;
}

export default function CoachesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [city, setCity] = useState('全部');
  const [goal, setGoal] = useState('全部');
  const [sort, setSort] = useState('default');
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    let alive = true;
    fetchCoaches({ goal, city }).then((list) => {
      if (alive) setCoaches(list);
    });
    return () => {
      alive = false;
    };
  }, [goal, city]);

  const sorted = useMemo(() => {
    const list = [...coaches];
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'experience') list.sort((a, b) => b.experienceYears - a.experienceYears);
    else if (sort === 'price') list.sort((a, b) => minPrice(a) - minPrice(b));
    return list;
  }, [coaches, sort]);

  const renderChips = (options: string[], selected: string, onSelect: (v: string) => void) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chips}>
      {options.map((o) => {
        const active = o === selected;
        return (
          <Pressable key={o} onPress={() => onSelect(o)}>
            <View
              style={[
                styles.chip,
                { backgroundColor: active ? theme.accent : theme.backgroundElement },
              ]}>
              <ThemedText type="smallBold" style={active ? styles.chipActiveText : undefined}>
                {o}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <ThemedText type="small" themeColor="textSecondary">
            📍
          </ThemedText>
          {renderChips(CITIES, city, setCity)}
        </View>

        {renderChips(GOALS, goal, setGoal)}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {SORTS.map((s) => {
            const active = s.key === sort;
            return (
              <Pressable key={s.key} onPress={() => setSort(s.key)}>
                <View
                  style={[
                    styles.sortChip,
                    { borderColor: active ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText
                    type="small"
                    themeColor={active ? 'accent' : 'textSecondary'}
                    style={active ? styles.sortActiveText : undefined}>
                    {s.label}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {sorted.length === 0 ? (
          <ThemedView type="backgroundElement" style={styles.empty}>
            <ThemedText style={styles.emptyIcon}>🔍</ThemedText>
            <ThemedText themeColor="textSecondary">没有找到符合条件的教练</ThemedText>
            <Pressable
              onPress={() => {
                setCity('全部');
                setGoal('全部');
              }}>
              <View style={[styles.resetBtn, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={styles.btnText}>
                  重置筛选
                </ThemedText>
              </View>
            </Pressable>
          </ThemedView>
        ) : (
          <View style={styles.list}>
          {sorted.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: '/coach/[id]', params: { id: c.id } })}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <View style={[styles.avatar, { backgroundColor: c.avatarColor }]}>
                  <ThemedText style={styles.avatarText}>{c.name[0]}</ThemedText>
                  <View
                    style={[
                      styles.onlineDot,
                      { backgroundColor: c.online ? '#22C55E' : theme.backgroundSelected },
                    ]}
                  />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <ThemedText type="smallBold">{c.name}</ThemedText>
                    {c.verified && (
                      <ThemedText type="small" themeColor="accent">
                        ✓ 认证
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {c.title} · {c.city}
                  </ThemedText>
                  <View style={styles.tagRow}>
                    {c.goals.map((t) => (
                      <View key={t} style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
                        <ThemedText type="small" themeColor="accent">
                          {t}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                  <View style={styles.metaRow}>
                    <ThemedText type="small" themeColor="accent">
                      ⭐ {c.rating}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      · {c.experienceYears} 年经验
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      · ¥{minPrice(c)} 起
                    </ThemedText>
                    <ThemedText type="small" themeColor={c.online ? 'accent' : 'textSecondary'}>
                      · {c.online ? '在线' : '离线'}
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>
            </Pressable>
          ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.three },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  chips: { gap: Spacing.two, paddingBottom: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  chipActiveText: { color: '#fff' },
  sortChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    borderWidth: 1,
  },
  sortActiveText: { fontWeight: '700' },
  list: { gap: Spacing.three },
  card: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
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
  cardBody: { flex: 1, gap: Spacing.one },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  metaRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  empty: {
    padding: Spacing.five,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.three,
  },
  emptyIcon: { fontSize: 40 },
  resetBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  btnText: { color: '#fff' },
});
