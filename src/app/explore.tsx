import { Redirect } from 'expo-router';

// 模板遗留的示例页，重定向回首页，避免多余路由
export default function ExploreScreen() {
  return <Redirect href="/" />;
}
