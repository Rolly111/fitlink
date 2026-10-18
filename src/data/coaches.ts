// 教练与服务的类型定义 + 模拟数据
// 未来接入真实后端时，这些数据改由 src/data/api.ts 从接口获取

export type Service = {
  name: string; // 服务名，如「免费提问」「单次咨询」
  price: number; // 价格（元），0 表示免费
  desc: string;
};

export type Coach = {
  id: string;
  name: string;
  title: string; // 头衔，如「力量训练专家」
  goals: string[]; // 擅长目标：减脂 / 增肌 / 塑形 / 康复
  city: string; // 所在城市（线下授课撮合的关键）
  rating: number; // 评分
  reviews: number; // 评价数
  answerCount: number; // 已回答提问数
  experienceYears: number; // 从业年限
  verified: boolean; // 是否已认证
  online: boolean; // 是否在线
  avatarColor: string; // 头像底色（占位，用首字显示）
  intro: string; // 简介
  certifications: string[]; // 资质证书
  services: Service[];
};

export const GOALS = ['全部', '减脂', '增肌', '塑形', '康复'];

export const CITIES = ['全部', '宁波', '杭州', '上海'];

export const COACHES: Coach[] = [
  {
    id: 'chen-wei',
    name: '陈伟',
    title: '力量训练专家',
    goals: ['增肌', '减脂'],
    city: '宁波',
    rating: 4.9,
    reviews: 326,
    answerCount: 1280,
    experienceYears: 8,
    verified: true,
    online: true,
    avatarColor: '#FF6B35',
    intro: '8 年力量训练经验，专注帮助新手建立正确的动作模式与增肌减脂计划。',
    certifications: ['NASM-CPT 国际私人教练认证', '国家职业资格健身教练（高级）'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 128, desc: '30 分钟图文 / 语音深度答疑' },
      { name: '定制训练计划', price: 328, desc: '4 周个性化增肌 / 减脂计划' },
    ],
  },
  {
    id: 'li-ting',
    name: '李婷',
    title: '塑形与体态教练',
    goals: ['塑形', '减脂'],
    city: '杭州',
    rating: 4.8,
    reviews: 218,
    answerCount: 860,
    experienceYears: 5,
    verified: true,
    online: true,
    avatarColor: '#7C5CFF',
    intro: '擅长女性塑形与体态调整，帮你告别「练了没效果」的误区。',
    certifications: ['ACE-CPT 美国运动委员会认证', '产后修复专项认证'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 98, desc: '30 分钟图文 / 语音深度答疑' },
      { name: '定制训练计划', price: 268, desc: '4 周塑形 / 体态改善计划' },
    ],
  },
  {
    id: 'wang-hao',
    name: '王浩',
    title: '体能训练师',
    goals: ['减脂', '增肌'],
    city: '宁波',
    rating: 4.7,
    reviews: 154,
    answerCount: 640,
    experienceYears: 6,
    verified: true,
    online: false,
    avatarColor: '#22C55E',
    intro: '前健身工作室主教练，擅长高效减脂与体能提升，风格务实。',
    certifications: ['国家职业资格健身教练（中级）', '体适能训练认证'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 88, desc: '30 分钟图文 / 语音深度答疑' },
      { name: '定制训练计划', price: 198, desc: '4 周减脂冲刺计划' },
    ],
  },
  {
    id: 'zhao-min',
    name: '赵敏',
    title: '运动康复师',
    goals: ['康复', '塑形'],
    city: '上海',
    rating: 5.0,
    reviews: 189,
    answerCount: 720,
    experienceYears: 9,
    verified: true,
    online: true,
    avatarColor: '#0EA5E9',
    intro: '运动康复方向，针对体态问题、关节不适给出安全可行的训练建议。',
    certifications: ['运动康复师资格证', 'FMS 功能动作筛查认证'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 158, desc: '40 分钟图文 / 语音评估答疑' },
      { name: '定制训练计划', price: 428, desc: '4 周康复 / 体态改善计划' },
    ],
  },
  {
    id: 'liu-yang',
    name: '刘洋',
    title: '增肌教练',
    goals: ['增肌'],
    city: '宁波',
    rating: 4.6,
    reviews: 96,
    answerCount: 430,
    experienceYears: 4,
    verified: false,
    online: false,
    avatarColor: '#F59E0B',
    intro: '专注男性增肌，帮你规划饮食与训练，少走弯路。',
    certifications: ['国家职业资格健身教练（初级）'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 68, desc: '30 分钟图文 / 语音深度答疑' },
      { name: '定制训练计划', price: 168, desc: '4 周增肌计划' },
    ],
  },
  {
    id: 'sun-yue',
    name: '孙悦',
    title: '瑜伽与柔韧教练',
    goals: ['塑形', '康复'],
    city: '杭州',
    rating: 4.8,
    reviews: 142,
    answerCount: 560,
    experienceYears: 7,
    verified: true,
    online: true,
    avatarColor: '#EC4899',
    intro: '瑜伽与柔韧训练方向，适合久坐人群改善僵硬、放松身心。',
    certifications: ['RYT-200 瑜伽教练认证', '普拉提教练认证'],
    services: [
      { name: '免费提问', price: 0, desc: '限 1 个问题，24 小时内回复' },
      { name: '单次咨询', price: 78, desc: '30 分钟图文 / 语音深度答疑' },
      { name: '定制训练计划', price: 208, desc: '4 周柔韧 / 放松计划' },
    ],
  },
];
