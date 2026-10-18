// 预留的数据接口层
// 当前直接返回本地模拟数据；未来接入真实后端时，只需把这里的实现
// 替换为 fetch('/api/coaches') 等真实请求，页面无需改动。

import { COACHES, type Coach } from './coaches';

export type CoachFilters = {
  goal?: string;
  city?: string;
};

export async function fetchCoaches(filters: CoachFilters = {}): Promise<Coach[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));
  let list = COACHES;
  if (filters.city && filters.city !== '全部') {
    list = list.filter((c) => c.city === filters.city);
  }
  if (filters.goal && filters.goal !== '全部') {
    list = list.filter((c) => c.goals.includes(filters.goal));
  }
  return list;
}

export async function fetchCoachById(id: string): Promise<Coach | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return COACHES.find((c) => c.id === id);
}
