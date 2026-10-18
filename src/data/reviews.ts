// 教练学员评价数据 + 类型

export type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
};

export const REVIEWS: Record<string, Review[]> = {
  'chen-wei': [
    {
      id: 'cw1',
      author: '张同学',
      rating: 5,
      content: '跟着陈教练练了 3 个月，深蹲硬拉动作纠正到位，力量涨了不少，很专业！',
      date: '2026-09',
    },
    {
      id: 'cw2',
      author: '阿强',
      rating: 4.5,
      content: '计划给得很细致，饮食也一并指导，减脂效果明显。',
      date: '2026-08',
    },
    {
      id: 'cw3',
      author: 'Lily',
      rating: 5,
      content: '耐心又专业，新手完全能跟上。',
      date: '2026-08',
    },
  ],
  'li-ting': [
    {
      id: 'lt1',
      author: '小美',
      rating: 5,
      content: '体态调整很有效，练了一个月明显感觉站姿变好了。',
      date: '2026-09',
    },
    {
      id: 'lt2',
      author: '阿May',
      rating: 4.5,
      content: '针对女生的训练计划很实用，不会过度疲劳。',
      date: '2026-08',
    },
  ],
  'wang-hao': [
    {
      id: 'wh1',
      author: '跑步的人',
      rating: 4.5,
      content: '减脂冲刺很有效果，教练风格务实，不整虚的。',
      date: '2026-08',
    },
    {
      id: 'wh2',
      author: 'Kevin',
      rating: 5,
      content: '体能提升明显，每次训练都有针对性。',
      date: '2026-07',
    },
  ],
  'zhao-min': [
    {
      id: 'zm1',
      author: '久坐患者',
      rating: 5,
      content: '肩颈问题改善很大，赵老师给的康复动作安全又有效。',
      date: '2026-09',
    },
    {
      id: 'zm2',
      author: '王先生',
      rating: 5,
      content: '评估很专业，讲解清楚，强烈推荐给有体态问题的朋友。',
      date: '2026-08',
    },
    {
      id: 'zm3',
      author: '小林',
      rating: 4.5,
      content: '康复训练循序渐进，效果看得见。',
      date: '2026-07',
    },
  ],
  'liu-yang': [
    {
      id: 'ly1',
      author: '小刚',
      rating: 4.5,
      content: '增肌计划很落地，练了两个月维度涨了一圈。',
      date: '2026-08',
    },
  ],
  'sun-yue': [
    {
      id: 'sy1',
      author: '瑜伽小白',
      rating: 5,
      content: '孙老师超温柔，柔韧训练一点也不痛苦，僵硬改善很多。',
      date: '2026-09',
    },
    {
      id: 'sy2',
      author: '露露',
      rating: 4.5,
      content: '课程节奏舒服，练完很放松。',
      date: '2026-08',
    },
  ],
};
