import { formatPrice, formatTraffic, getLowestEntryPlan, trafficInGb, type Airport, type AirportPlan } from './airports';

export interface AirportReviewMeta {
  title: string;
  description: string;
  readingMinutes: number;
  planSummary: string;
}

const titleFactories = [
  (a: Airport, p: AirportPlan | null) => `${a.name}怎么样？从${p ? `${formatPrice(p)}入门方案` : '现有公开资料'}看套餐定位`,
  (a: Airport, p: AirportPlan | null) => `${a.name}套餐观察：${p ? `${formatTraffic(p)}起步` : '现有资料'}该怎么判断？`,
  (a: Airport) => `${a.name}怎么选套餐？价格、流量与公开线路资料分析`,
  (a: Airport) => `${a.name}使用信息整理：套餐结构与适用需求解析`,
  (a: Airport, p: AirportPlan | null) => `${a.name}套餐解析：${p ? `${formatPrice(p)}与${formatTraffic(p)}` : '现有资料'}值得关注什么？`,
  (a: Airport) => `${a.name}资料评估：从套餐差异到线路与平台支持`,
  (a: Airport) => `${a.name}选择指南：现有套餐、公开能力与注意事项`,
];

export function getAirportReviewMeta(airport: Airport): AirportReviewMeta {
  const entry = getLowestEntryPlan(airport);
  const plans = airport.plans;
  const trafficRange = plans.length
    ? `${formatTraffic(plans.reduce((a, b) => trafficInGb(a) < trafficInGb(b) ? a : b))}至${formatTraffic(plans.reduce((a, b) => trafficInGb(a) > trafficInGb(b) ? a : b))}`
    : '';
  const planSummary = plans.length
    ? `目前收录 ${plans.length} 档套餐，价格从 ${formatPrice(entry)} 起，月流量覆盖 ${trafficRange}。`
    : '目前没有可展示的可靠套餐资料。';
  const english = airport.englishName ? `（${airport.englishName}）` : '';
  const title = titleFactories[(airport.rank - 1) % titleFactories.length](airport, entry);
  const description = `${airport.name}${english}当前推荐排名第 ${airport.rank}。${planSummary}本文依据统一数据整理线路、AI、流媒体与选择注意事项，未核实项目明确标注。`;
  return { title, description, readingMinutes: 6 + Math.min(plans.length, 3), planSummary };
}

export const REVIEW_ENTRIES = (airports: Airport[]) => airports
  .slice()
  .sort((a, b) => a.rank - b.rank)
  .map((airport) => ({ airport, ...getAirportReviewMeta(airport) }));
