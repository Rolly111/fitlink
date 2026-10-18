import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { fetchCoachById } from '@/data/api';
import type { Coach } from '@/data/coaches';
import { REVIEWS } from '@/data/reviews';
import { useTheme } from '@/hooks/use-theme';

export default function CoachDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { myReviews, submitReview } = useApp();
  const [coach, setCoach] = useState<Coach | undefined>();
  const [myRating, setMyRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (id) fetchCoachById(id).then(setCoach);
  }, [id]);

  if (!coach) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText themeColor="textSecondary">加载中…</ThemedText>
      </ThemedView>
    );
  }

  const allReviews = [...(myReviews[coach.id] ?? []), ...(REVIEWS[coach.id] ?? [])];

  const handleReviewSubmit = () => {
    if (myRating === 0) return Alert.alert('提示', '请先选择评分');
    if (!reviewText.trim()) return Alert.alert('提示', '请填写评价内容');
    submitReview(coach.id, {
      author: '我',
      rating: myRating,
      content: reviewText.trim(),
      date: '刚刚',
    });
    setMyRating(0);
    setReviewText('');
    Alert.alert('已提交', '感谢你的评价～');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: coach.avatarColor }]}>
            <ThemedText style={styles.avatarText}>{coach.name[0]}</ThemedText>
          </View>
          <View style={styles.headerBody}>
            <View style={styles.nameRow}>
              <ThemedText type="subtitle">{coach.name}</ThemedText>
              {coach.verified && (
                <ThemedText themeColor="accent" type="small">
                  ✓ 已认证
                </ThemedText>
              )}
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {coach.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              📍 {coach.city} · {coach.online ? '在线' : '离线'}
            </ThemedText>
            <ThemedText type="small" themeColor="accent">
              ⭐ {coach.rating} · {coach.reviews} 条评价
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="从业年限" value={`${coach.experienceYears} 年`} />
          <Stat label="解答提问" value={`${coach.answerCount}`} />
          <Stat label="学员评价" value={`${coach.reviews}`} />
        </View>

        <ThemedText type="smallBold">擅长方向</ThemedText>
        <View style={styles.tagRow}>
          {coach.goals.map((g) => (
            <View key={g} style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
              <ThemedText type="small" themeColor="accent">
                {g}
              </ThemedText>
            </View>
          ))}
        </View>

        <ThemedText type="smallBold">资质证书</ThemedText>
        <View style={styles.certList}>
          {coach.certifications.map((cert) => (
            <ThemedView key={cert} type="backgroundElement" style={styles.certItem}>
              <ThemedText style={styles.certIcon}>🎓</ThemedText>
              <ThemedText type="small">{cert}</ThemedText>
            </ThemedView>
          ))}
        </View>

        <ThemedText type="smallBold">教练简介</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {coach.intro}
        </ThemedText>

        <ThemedText type="smallBold">服务项目</ThemedText>
        <View style={styles.serviceList}>
          {coach.services.map((s) => (
            <ThemedView key={s.name} type="backgroundElement" style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <ThemedText type="smallBold">{s.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {s.desc}
                </ThemedText>
              </View>
              <View style={styles.serviceRight}>
                <ThemedText type="smallBold" themeColor="accent">
                  {s.price === 0 ? '免费' : `¥${s.price}`}
                </ThemedText>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/ask',
                      params: { coachId: coach.id, service: s.name },
                    })
                  }>
                  <View style={[styles.serviceBtn, { backgroundColor: theme.accent }]}>
                    <ThemedText type="small" style={styles.btnText}>
                      {s.price === 0 ? '提问' : '咨询'}
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            </ThemedView>
          ))}
        </View>

        <ThemedText type="smallBold">学员评价（{allReviews.length}）</ThemedText>
        <View style={styles.reviewList}>
          {allReviews.map((r) => (
            <ThemedView key={r.id} type="backgroundElement" style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <ThemedText type="smallBold">{r.author}</ThemedText>
                <ThemedText type="small" themeColor="accent">
                  {'★'.repeat(Math.round(r.rating))} {r.rating}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {r.content}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {r.date}
              </ThemedText>
            </ThemedView>
          ))}
        </View>

        <ThemedText type="smallBold">写评价</ThemedText>
        <ThemedView type="backgroundElement" style={styles.reviewForm}>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setMyRating(n)}>
                <ThemedText style={[styles.star, { color: n <= myRating ? '#FFB400' : theme.textSecondary }]}>
                  {n <= myRating ? '★' : '☆'}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="说说你的体验…"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            style={[styles.reviewInput, { color: theme.text }]}
          />
          <Pressable onPress={handleReviewSubmit}>
            <View style={[styles.submitBtn, { backgroundColor: theme.accent }]}>
              <ThemedText type="smallBold" style={styles.btnText}>
                提交评价
              </ThemedText>
            </View>
          </Pressable>
        </ThemedView>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.stat}>
      <ThemedText type="smallBold">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: Spacing.three, gap: Spacing.three },
  header: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  headerBody: { flex: 1, gap: Spacing.one },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  statsRow: { flexDirection: 'row', gap: Spacing.three },
  stat: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  certList: { gap: Spacing.two },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  certIcon: { fontSize: 18 },
  serviceList: { gap: Spacing.two },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  serviceInfo: { flex: 1, gap: Spacing.half },
  serviceRight: { alignItems: 'flex-end', gap: Spacing.two },
  serviceBtn: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  btnText: { color: '#fff' },
  reviewList: { gap: Spacing.two },
  reviewItem: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewForm: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  starRow: { flexDirection: 'row', gap: Spacing.one },
  star: { fontSize: 28 },
  reviewInput: {
    minHeight: 72,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
  submitBtn: {
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
});
