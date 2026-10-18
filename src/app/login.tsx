import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp, type UserRole } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useApp();

  const [role, setRole] = useState<UserRole>('user');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const doLogin = () => {
    login(role);
    router.replace('/');
  };

  const handleWechat = () => {
    doLogin();
  };

  const handleGetCode = () => {
    if (phone.trim().length < 11) return Alert.alert('提示', '请先输入正确的手机号');
    Alert.alert('已发送', '验证码已发送（演示环境，任意 4 位数字均可）');
  };

  const handlePhone = () => {
    if (phone.trim().length < 11) return Alert.alert('提示', '请输入正确的手机号');
    if (!code.trim()) return Alert.alert('提示', '请输入验证码');
    doLogin();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <View style={styles.brand}>
          <LinearGradient
            colors={['#FF6B35', '#FF7A59']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logo}>
            <ThemedText style={styles.logoText}>练</ThemedText>
          </LinearGradient>
          <ThemedText type="subtitle">练链 FitLink</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            连接健身小白与专业教练
          </ThemedText>
        </View>

        <ThemedText type="smallBold">选择你的身份</ThemedText>
        <View style={styles.roleRow}>
          {(['user', 'coach'] as UserRole[]).map((r) => {
            const active = r === role;
            return (
              <Pressable key={r} style={styles.roleWrap} onPress={() => setRole(r)}>
                <View
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: active ? theme.accentSoft : theme.backgroundElement,
                      borderColor: active ? theme.accent : 'transparent',
                    },
                  ]}>
                  <ThemedText style={styles.roleIcon}>{r === 'user' ? '💪' : '🏋️'}</ThemedText>
                  <ThemedText type="smallBold" themeColor={active ? 'accent' : 'text'}>
                    {r === 'user' ? '我是健身小白' : '我是教练'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {r === 'user' ? '提问、找教练' : '入驻、接单'}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={handleWechat}>
          <View style={styles.wechatBtn}>
            <ThemedText style={styles.wechatIcon}>💬</ThemedText>
            <ThemedText style={styles.wechatText}>微信一键登录</ThemedText>
          </View>
        </Pressable>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
          <ThemedText type="small" themeColor="textSecondary">
            其他登录方式
          </ThemedText>
          <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
        </View>

        <ThemedView type="backgroundElement" style={styles.inputWrap}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="请输入手机号"
            placeholderTextColor={theme.textSecondary}
            maxLength={11}
            style={[styles.input, { color: theme.text }]}
          />
        </ThemedView>

        <View style={styles.codeRow}>
          <ThemedView type="backgroundElement" style={styles.codeInputWrap}>
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="验证码"
              placeholderTextColor={theme.textSecondary}
              maxLength={6}
              style={[styles.input, { color: theme.text }]}
            />
          </ThemedView>
          <Pressable onPress={handleGetCode}>
            <View style={[styles.codeBtn, { backgroundColor: theme.accentSoft }]}>
              <ThemedText type="smallBold" themeColor="accent">
                获取验证码
              </ThemedText>
            </View>
          </Pressable>
        </View>

        <Pressable onPress={handlePhone}>
          <View style={[styles.phoneBtn, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={styles.btnText}>
              登录
            </ThemedText>
          </View>
        </Pressable>

        <ThemedText type="small" themeColor="textSecondary" style={styles.agreement}>
          登录即代表同意《用户协议》和《隐私政策》
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    justifyContent: 'center',
  },
  brand: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.two },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  logoText: { color: '#fff', fontSize: 34, fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: Spacing.three },
  roleWrap: { flex: 1 },
  roleCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
    borderWidth: 1.5,
  },
  roleIcon: { fontSize: 28 },
  wechatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: '#07C160',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    marginTop: Spacing.two,
  },
  wechatIcon: { fontSize: 20 },
  wechatText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  dividerLine: { flex: 1, height: 1 },
  inputWrap: {
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: { paddingVertical: Spacing.three, fontSize: 16 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  codeInputWrap: { flex: 1, paddingHorizontal: Spacing.three, borderRadius: Spacing.three },
  codeBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  phoneBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  btnText: { color: '#fff', fontSize: 16 },
  agreement: { textAlign: 'center', marginTop: Spacing.one },
});
