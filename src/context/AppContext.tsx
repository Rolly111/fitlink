// 全局状态：管理「登录 / 提问 / 目标 / 打卡 / 通知 / 教练入驻 / 评价 / 聊天」等跨页面数据
// 当前存在内存中，未来可替换为后端持久化

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Review } from '@/data/reviews';

export type Question = {
  id: string;
  coachId: string;
  coachName: string;
  serviceType: string;
  content: string;
  createdAt: string;
  status: string;
};

type NewQuestion = Omit<Question, 'id' | 'createdAt' | 'status'>;

export type UserGoal = {
  type: string;
  targetWeight: string;
  weeklySessions: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type CoachApplication = {
  id: string;
  name: string;
  title: string;
  city: string;
  goals: string[];
  experienceYears: string;
  intro: string;
  certifications: string[];
  price: string;
  status: string;
  createdAt: string;
};

type NewCoachApplication = Omit<CoachApplication, 'id' | 'status' | 'createdAt'>;

export type Message = {
  id: string;
  from: 'user' | 'coach';
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  coachId: string;
  coachName: string;
  messages: Message[];
};

export type UserRole = 'user' | 'coach';

type AppContextType = {
  isLoggedIn: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;

  questions: Question[];
  submitQuestion: (q: NewQuestion) => string; // 返回会话 id

  goal: UserGoal;
  setGoal: (g: UserGoal) => void;

  checkins: string[];
  checkInToday: () => void;
  hasCheckedInToday: boolean;
  streak: number;
  weekCheckins: boolean[];

  notifications: NotificationItem[];
  markAllRead: () => void;
  unreadCount: number;

  coachApplications: CoachApplication[];
  submitCoachApplication: (app: NewCoachApplication) => void;

  myReviews: Record<string, Review[]>;
  submitReview: (coachId: string, review: Omit<Review, 'id'>) => void;

  conversations: Conversation[];
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (conversationId: string, text: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTO_REPLY =
  '收到你的消息了，我先看了下你的情况，给你个初步建议：保持规律训练、控制饮食结构。更详细的方案我整理好后发你～';

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function fmtTime(d: Date) {
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`;
}

function todayStr() {
  return fmtDate(new Date());
}

function initCheckins() {
  const d = new Date();
  const list: string[] = [];
  d.setDate(d.getDate() - 1);
  list.push(fmtDate(d));
  d.setDate(d.getDate() - 1);
  list.push(fmtDate(d));
  return list;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [goal, setGoal] = useState<UserGoal>({
    type: '减脂',
    targetWeight: '60',
    weeklySessions: 3,
  });
  const [checkins, setCheckins] = useState<string[]>(initCheckins);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'welcome',
      title: '欢迎来到练链',
      body: '有健身问题，随时找专业教练提问～',
      time: '昨天',
      read: false,
    },
  ]);
  const [coachApplications, setCoachApplications] = useState<CoachApplication[]>([]);
  const [myReviews, setMyReviews] = useState<Record<string, Review[]>>({});
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const login = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const submitQuestion = (q: NewQuestion): string => {
    const now = new Date();
    const createdAt = fmtTime(now);
    const convId = String(now.getTime());
    setQuestions((prev) => [
      { ...q, id: convId, createdAt, status: '待教练回复' },
      ...prev,
    ]);
    setConversations((prev) => [
      {
        id: convId,
        coachId: q.coachId,
        coachName: q.coachName,
        messages: [{ id: convId, from: 'user', text: q.content, time: createdAt }],
      },
      ...prev,
    ]);
    setNotifications((prev) => [
      {
        id: convId,
        title: '提问已提交',
        body: `已向 ${q.coachName} 发起「${q.serviceType}」，等待回复`,
        time: '刚刚',
        read: false,
      },
      ...prev,
    ]);
    setTimeout(() => {
      const reply: Message = {
        id: `${convId}-first`,
        from: 'coach',
        text: '收到你的问题，我先了解下你的具体情况，稍后给你详细回复～',
        time: fmtTime(new Date()),
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, reply] } : c)),
      );
    }, 1500);
    return convId;
  };

  const sendMessage = (conversationId: string, text: string) => {
    const now = new Date();
    const userMsg: Message = { id: String(now.getTime()), from: 'user', text, time: fmtTime(now) };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, userMsg] } : c,
      ),
    );
    setTimeout(() => {
      const reply: Message = {
        id: `${now.getTime()}-r`,
        from: 'coach',
        text: AUTO_REPLY,
        time: fmtTime(new Date()),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, reply] } : c,
        ),
      );
    }, 1200);
  };

  const submitCoachApplication = (app: NewCoachApplication) => {
    const now = new Date();
    const createdAt = `${now.getMonth() + 1}月${now.getDate()}日`;
    setCoachApplications((prev) => [
      { ...app, id: String(now.getTime()), status: '待审核', createdAt },
      ...prev,
    ]);
    setNotifications((prev) => [
      {
        id: `apply-${now.getTime()}`,
        title: '入驻申请已提交',
        body: `教练「${app.name}」的入驻申请已提交，等待平台审核`,
        time: '刚刚',
        read: false,
      },
      ...prev,
    ]);
  };

  const submitReview = (coachId: string, review: Omit<Review, 'id'>) => {
    const id = String(new Date().getTime());
    setMyReviews((prev) => ({
      ...prev,
      [coachId]: [{ ...review, id }, ...(prev[coachId] ?? [])],
    }));
  };

  const hasCheckedInToday = checkins.includes(todayStr());

  const checkInToday = () => {
    const t = todayStr();
    setCheckins((prev) => (prev.includes(t) ? prev : [t, ...prev]));
  };

  const streak = (() => {
    const set = new Set(checkins);
    const d = new Date();
    if (!set.has(fmtDate(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(fmtDate(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  })();

  const weekCheckins = (() => {
    const set = new Set(checkins);
    const d = new Date();
    const mondayOffset = d.getDay() === 0 ? -6 : 1 - d.getDay();
    d.setDate(d.getDate() + mondayOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(d);
      dd.setDate(d.getDate() + i);
      return set.has(fmtDate(dd));
    });
  })();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getConversation = (id: string) => conversations.find((c) => c.id === id);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userRole,
        login,
        logout,
        questions,
        submitQuestion,
        goal,
        setGoal,
        checkins,
        checkInToday,
        hasCheckedInToday,
        streak,
        weekCheckins,
        notifications,
        markAllRead,
        unreadCount,
        coachApplications,
        submitCoachApplication,
        myReviews,
        submitReview,
        conversations,
        getConversation,
        sendMessage,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp 必须在 AppProvider 内使用');
  return ctx;
}
