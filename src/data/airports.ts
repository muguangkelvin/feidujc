export type BillingCycle = 'month' | 'year';
export type TrafficUnit = 'GB' | 'TB';
export type AirportStatus = 'listed' | 'testing' | 'verified';
export type EvidenceLevel = 'public_reference' | 'feidu_test';

export interface AirportPlan {
  name: string; price: number; billingCycle: BillingCycle; traffic: number; trafficUnit: TrafficUnit;
  line?: string; devices?: string; speed?: string; multiplier?: string; feature?: string;
  routing?: string; regions?: string; reset?: string; peakBandwidth?: string;
}
export interface RecommendationScores { experience:number; stability:number; speed:number; ai:number; streaming:number; value:number; traffic:number; recommendation:number; }
export interface TestResults { line:string|null; latencyMs:number|null; downloadMbps:number|null; uploadMbps:number|null; packetLossPercent:number|null; ai:string|null; netflix:string|null; disneyPlus:string|null; spotify:string|null; }
export interface PublicCapabilities {
  line: { display:string; protocols:string[] };
  ai: { chatgpt:boolean|null; claude:boolean|null; gemini:boolean|null };
  streaming: { netflix:boolean|null; disneyPlus:boolean|null; youtube:boolean|null; tiktok:boolean|null };
  evidenceLevel: EvidenceLevel;
}
export interface Airport {
  id: string; slug: string; name: string; englishName: string | null; aliases: string[];
  rank: number; featured: boolean; officialUrl: string; plans: AirportPlan[];
  recommendationScores: RecommendationScores | null; capabilities: PublicCapabilities; testResults: TestResults;
  recommendationScoreOverride?: number;
  serviceDetails?: { line: string; ai: string; streaming: string };
  status: AirportStatus; lastVerified: string; description: string;
}

const plans = (...items: Array<[number, BillingCycle, number, TrafficUnit]>): AirportPlan[] => items.map(([price,billingCycle,traffic,trafficUnit],i)=>({name:`套餐 ${i+1}`,price,billingCycle,traffic,trafficUnit}));
const score = (experience:number,stability:number,speed:number,ai:number,streaming:number,value:number,traffic:number,recommendation:number):RecommendationScores => ({experience,stability,speed,ai,streaming,value,traffic,recommendation});
const emptyTests:TestResults = {line:null,latencyMs:null,downloadMbps:null,uploadMbps:null,packetLossPercent:null,ai:null,netflix:null,disneyPlus:null,spotify:null};
const unknown = { recommendationScores:null, testResults:emptyTests, status:'listed' as const, lastVerified:'2026-10-06' };
const capabilities = (display:string,protocols:string[],ai:Array<keyof PublicCapabilities['ai']>,streaming:Array<keyof PublicCapabilities['streaming']>):PublicCapabilities => ({
  line:{display,protocols},
  ai:{chatgpt:null,claude:null,gemini:null,...Object.fromEntries(ai.map(key=>[key,true]))},
  streaming:{netflix:null,disneyPlus:null,youtube:null,tiktok:null,...Object.fromEntries(streaming.map(key=>[key,true]))},
  evidenceLevel:'public_reference',
});
const PUBLIC_CAPABILITIES:Record<string,PublicCapabilities> = {
  lingdong:capabilities('IPLC / VLESS',['VLESS'],['chatgpt'],['netflix','disneyPlus']),
  twilight:capabilities('专线 / BGP 优化',[],['chatgpt'],['netflix','disneyPlus']),
  flycat:capabilities('IEPL 专线',[],['chatgpt','claude'],['netflix','disneyPlus']),
  dalaoyun:capabilities('IEPL / IPLC 专线',['IEPL','IPLC'],['chatgpt'],['netflix','disneyPlus']),
  breezenet:capabilities('专线 / VLESS',['VLESS'],['chatgpt','claude'],['netflix','disneyPlus']),
  invisible:capabilities('VLESS 专线',['VLESS'],['chatgpt'],['netflix','youtube']),
  wavenet:capabilities('BGP 优化 / 专线',[],['chatgpt','claude'],['netflix','disneyPlus']),
  laddercloud:capabilities('IEPL / VLESS',['VLESS'],['chatgpt','claude'],['netflix','disneyPlus']),
  flyv:capabilities('专线',[],['chatgpt'],['netflix','disneyPlus']),
  globalcloud:capabilities('专线',[],['chatgpt'],['netflix']),
  xingdaomeng:capabilities('企业级内网专线 / VLESS',['VLESS'],['chatgpt','claude'],['netflix','disneyPlus']),
  lightspeed:capabilities('专线',[],['chatgpt'],['netflix']),
  v2cloud:capabilities('IEPL 专线',[],['chatgpt'],['netflix']),
  u1s1:capabilities('中转专线',[],['chatgpt'],['netflix']),
  jilian:capabilities('IEPL 专线',[],['chatgpt','claude','gemini'],['netflix']),
  lightyear:capabilities('IEPL / VLESS / SS',['VLESS','SS'],['chatgpt','claude','gemini'],['netflix']),
  sogo:capabilities('专线',[],['chatgpt'],['netflix']),
  yuzhou:capabilities('IPLC 专线',[],['chatgpt'],['netflix']),
  '2mao':capabilities('专线',[],['chatgpt'],['netflix']),
  '1fly':capabilities('专线',[],['chatgpt'],['netflix']),
  edgenova:capabilities('优化线路',[],['chatgpt'],['netflix']),
  trustedcloud:capabilities('优化线路',[],['chatgpt'],['netflix']),
  sujie:capabilities('优化线路',[],['chatgpt'],['netflix']),
  kuaili:capabilities('优化线路',[],['chatgpt'],['netflix']),
  wuyou:capabilities('优化线路',[],['chatgpt'],['netflix']),
  lingmao:capabilities('优化线路',[],['chatgpt'],['netflix']),
  flashleap:capabilities('优化线路',[],['chatgpt'],['netflix']),
  firefly:capabilities('优化线路',[],['chatgpt'],['netflix']),
  kuajie:capabilities('优化线路',[],['chatgpt'],['netflix']),
};
export const RECOMMENDATION_WEIGHTS:Record<keyof RecommendationScores,number> = {experience:.15,stability:.15,speed:.10,ai:.10,streaming:.10,value:.15,traffic:.10,recommendation:.15};
export function getRecommendationScore(airport:Airport):number|null { if(airport.recommendationScoreOverride!==undefined)return airport.recommendationScoreOverride; if(!airport.recommendationScores)return null; return Number((Object.entries(RECOMMENDATION_WEIGHTS) as Array<[keyof RecommendationScores,number]>).reduce((total,[key,weight])=>total+airport.recommendationScores![key]*weight,0).toFixed(1)); }

const AIRPORT_BASE: Array<Omit<Airport,'capabilities'>> = [
  {id:'lingdong',slug:'lingdong',name:'灵动云',englishName:'Lingdong Cloud',aliases:['灵动'],rank:1,featured:true,officialUrl:'https://varnexa.lingdongaff.com/#/?code=vFPRdc1J',plans:plans([20,'month',100,'GB'],[50,'month',300,'GB'],[100,'month',700,'GB']),description:'提供三档月付套餐，可按预算与月流量需求逐级比较。',...unknown,recommendationScores:score(9.7,9.6,9.5,9.6,9.5,9.7,9.3,9.8)},
  {id:'twilight',slug:'twilight',name:'暮光网络',englishName:'Twilight Network',aliases:['暮光','Twilight'],rank:2,featured:true,officialUrl:'https://varnexa.twilightaff.com/#/?code=X6iVG1Zb',plans:plans([20,'month',120,'GB'],[40,'month',240,'GB'],[100,'month',700,'GB']),description:'以 120GB 入门套餐兼顾流量与日常使用成本。',...unknown,recommendationScores:score(9.5,9.4,9.3,9.4,9.3,9.5,9.2,9.5)},
  {id:'flycat',slug:'flycat',name:'飞猫云',englishName:'FlyCat',aliases:['飞猫'],rank:7,featured:false,officialUrl:'https://flycat1.flycatvipaff.cc/#/?code=KRjsCIZV',plans:plans([84,'year',50,'GB'],[25,'month',150,'GB'],[45,'month',300,'GB']),description:'同时提供年付与月付套餐，适合重视 AI 与视频流量配置的用户。',...unknown,recommendationScores:score(9.2,9.1,9.1,9.5,9.5,9.1,9.4,9.2)},
  {id:'dalaoyun',slug:'dalaoyun',name:'大佬云',englishName:'DalaoYun',aliases:['dalaoyun'],rank:8,featured:false,officialUrl:'https://www2.dalaoyuntt.xyz/#/?code=7aX2Po8W',plans:[
    {name:'初云・入门版',price:23,billingCycle:'month',traffic:130,trafficUnit:'GB',line:'IEPL',devices:'不限设备',speed:'不限速',multiplier:'全节点 ×1 倍率',routing:'IEPL 专线直连、低延迟、智能优选路由',regions:'香港、台湾、日本、韩国、新加坡、欧洲等热门地区',reset:'每 30 天重置',feature:'适合轻度使用和新手用户，130GB/月。'},
    {name:'凌云・基础版',price:43,billingCycle:'month',traffic:300,trafficUnit:'GB',line:'IPLC',devices:'不限设备',speed:'不限速',multiplier:'全节点 ×1 倍率',routing:'全线 IPLC 专线、智能路由',regions:'香港、台湾、日本、韩国、新加坡、欧美等地区',reset:'每 30 天重置',feature:'300GB/月，适合日常浏览、办公、学习及影音需求。'},
    {name:'御云・高级版',price:73,billingCycle:'month',traffic:600,trafficUnit:'GB',line:'IPLC',devices:'不限设备',speed:'不限速',multiplier:'全节点 ×1 倍率',routing:'全线 IPLC 专线',peakBandwidth:'最高 2.5Gbps',reset:'每 30 天重置',feature:'600GB/月，适合高流量、高强度使用需求。'},
    {name:'年付活动包',price:96,billingCycle:'year',traffic:60,trafficUnit:'GB',line:'IPLC',devices:'不限设备',speed:'不限速',routing:'全 IPLC 专线、低延迟',peakBandwidth:'最高 2.5Gbps',regions:'香港×20、台湾×10、日本×10、新加坡×10、美国×10 等',reset:'每 30 天自动刷新流量',feature:'¥96/年，每月 60GB，适合轻量长期使用。'},
  ],description:'提供 130GB、300GB、600GB 月付套餐及 60GB/月年付活动包，采用 IEPL / IPLC 专线方案。',recommendationScoreOverride:9.2,serviceDetails:{line:'大佬云采用 IEPL / IPLC 专线方案，部分套餐提供智能路由及低延迟线路，全节点 ×1 倍率，晚高峰不限速。',ai:'ChatGPT 等 AI 服务',streaming:'Netflix、Disney+'},...unknown,lastVerified:'2026-10-06'},
  {id:'breezenet',slug:'breezenet',name:'微风网络',englishName:'Breezenet',aliases:['微风','微风网络 Breezenet'],rank:9,featured:false,officialUrl:'https://edp01.breezenetaff.com/#/?code=txKNNHZc',plans:plans([25,'month',200,'GB'],[55,'month',500,'GB'],[125,'month',1.2,'TB']),description:'提供从 200GB 到 1.2TB 的大流量月付套餐。',...unknown,recommendationScores:score(8.8,8.7,8.9,8.9,9.1,9.4,9.8,8.9)},
  {id:'invisible',slug:'invisible',name:'隐形人',englishName:'Invisible',aliases:[],rank:3,featured:true,officialUrl:'https://varnexa.invisibleaff.com/#/?code=CnM0SCna',plans:plans([24,'month',144,'GB'],[48,'month',360,'GB'],[105,'month',750,'GB']),description:'以 24 元和 144GB 的组合平衡预算与中等流量需求。',...unknown,recommendationScores:score(8.7,8.7,8.6,8.8,8.7,9.1,8.9,8.8)},
  {id:'wavenet',slug:'wavenet',name:'浪网',englishName:'WaveNet',aliases:['浪网 WaveNet'],rank:5,featured:true,officialUrl:'https://varnexa.wavenetaff.com/#/?code=YpiKU7ii',plans:plans([120,'month',800,'GB'],[200,'month',2,'TB'],[119,'year',80,'GB']),description:'年付 119 元套餐提供低月均成本入口，适合轻度和预算敏感用户。',...unknown,recommendationScores:score(8.7,8.5,8.5,8.4,8.3,9.3,8.2,8.6)},
  {id:'laddercloud',slug:'laddercloud',name:'梯子云',englishName:'LadderCloud',aliases:['梯子'],rank:4,featured:true,officialUrl:'https://varnexa.ladderaff.com/#/?code=k98borBb',plans:plans([25,'month',125,'GB'],[60,'month',350,'GB'],[110,'month',750,'GB']),description:'以 125GB 月付套餐覆盖基础使用与中等流量需求。',...unknown,recommendationScores:score(8.5,8.4,8.3,8.4,8.3,8.6,8.5,8.4)},
  {id:'flyv',slug:'flyv',name:'飞V',englishName:'FlyV',aliases:['飞 V','飞V FlyV'],rank:6,featured:true,officialUrl:'https://varnexa.flyvaff.com/#/?code=y439Zqry',plans:plans([25,'month',150,'GB'],[50,'month',380,'GB'],[110,'month',800,'GB']),description:'25 元提供 150GB 的基础套餐选择，综合推荐维度略低但仍有明确适用人群。',...unknown,recommendationScores:score(8.1,8.1,8.2,8.1,8.2,8.5,8.6,8.2)},
  {id:'globalcloud',slug:'globalcloud',name:'全球云',englishName:'Global Cloud',aliases:[],rank:10,featured:false,officialUrl:'https://sswdh.gcvipaff.com/#/?code=WJFuG7Wm',plans:plans([20,'month',120,'GB'],[40,'month',300,'GB'],[100,'month',700,'GB']),description:'提供三档月付套餐，月流量覆盖 120GB 至 700GB。',...unknown},
  {id:'xingdaomeng',slug:'xingdaomeng',name:'星岛梦',englishName:'Xingdao Dream',aliases:[],rank:11,featured:false,officialUrl:'https://kfccbb.xingdaomeng.com/#/?code=o2LVBz3A',plans:plans([25,'month',150,'GB'],[50,'month',300,'GB'],[70,'month',500,'GB']),description:'提供三档月付套餐，月流量覆盖 150GB 至 500GB。',...unknown},
  {id:'lightspeed',slug:'lightspeed',name:'光速云',englishName:'LightSpeed Cloud',aliases:[],rank:12,featured:false,officialUrl:'https://mdlky.gsyaff.com',plans:plans([23,'month',148,'GB'],[34,'month',238,'GB'],[68,'month',450,'GB']),description:'提供三档月付套餐，可按预算与流量需求比较。',...unknown},
  {id:'v2cloud',slug:'v2cloud',name:'唯兔云',englishName:'V2 Cloud',aliases:['V2云','唯兔云 / V2云'],rank:13,featured:false,officialUrl:'https://fast.v2yunvipaff.com/#/?code=B9Mbez3V',plans:plans([19.9,'month',150,'GB'],[29.9,'month',200,'GB'],[59.9,'month',500,'GB']),description:'亦称 V2云，提供三档月付套餐。',...unknown},
  {id:'u1s1',slug:'u1s1',name:'U1S1',englishName:'U1S1',aliases:['有一说一'],rank:14,featured:false,officialUrl:'https://pkdj7.vipaff.cc/#/?code=BgqW6VLS',plans:plans([20,'month',120,'GB'],[40,'month',300,'GB'],[100,'month',700,'GB']),description:'亦称有一说一，提供三档月付套餐。',...unknown},
  {id:'jilian',slug:'jilian',name:'极连云',englishName:'Jilian Cloud',aliases:[],rank:15,featured:false,officialUrl:'https://kdjhao.jlyvipaff.com/#/?code=lHO8G2Sy',plans:plans([18,'month',100,'GB'],[32,'month',200,'GB'],[61,'month',500,'GB']),description:'提供三档月付套餐，月流量覆盖 100GB 至 500GB。',...unknown},
  {id:'lightyear',slug:'lightyear',name:'光年梯',englishName:'Lightyear',aliases:[],rank:16,featured:false,officialUrl:'https://ggmq.gntaff.com/#/?code=1SLG97Ch',plans:plans([18,'month',110,'GB'],[34,'month',220,'GB'],[68,'month',450,'GB']),description:'提供三档月付套餐，月流量覆盖 110GB 至 450GB。',...unknown},
  {id:'sogo',slug:'sogo',name:'Sogo云',englishName:'Sogo Cloud',aliases:['Sogo'],rank:17,featured:false,officialUrl:'https://wzjc.sogoyunaff.cc/#/?code=JpsSYPPG',plans:plans([25,'month',150,'GB'],[45,'month',350,'GB'],[80,'month',550,'GB']),description:'提供三档月付套餐，月流量覆盖 150GB 至 550GB。',...unknown},
  {id:'yuzhou',slug:'yuzhou',name:'宇宙云',englishName:'YuZhou',aliases:['宇宙云 YuZhou'],rank:18,featured:false,officialUrl:'https://wzjc.yuzoucloud.cc/#/?code=MQM25nhk',plans:plans([25,'month',160,'GB'],[50,'month',300,'GB'],[100,'month',700,'GB']),description:'提供三档月付套餐，月流量覆盖 160GB 至 700GB。',...unknown},
  {id:'2mao',slug:'2mao',name:'二猫云',englishName:'2mao',aliases:['二猫云 2mao'],rank:19,featured:false,officialUrl:'https://waaa.2maoyunaff.cc/#/?code=b4qTK67Z',plans:plans([20,'month',130,'GB'],[40,'month',230,'GB'],[80,'month',430,'GB']),description:'提供三档月付套餐，月流量覆盖 130GB 至 430GB。',...unknown},
  {id:'1fly',slug:'1fly',name:'一翻云',englishName:'1fly',aliases:['一翻云 1fly'],rank:20,featured:false,officialUrl:'https://wzjc.1flyunaff.cc/#/?code=twb00vnS',plans:plans([20,'month',150,'GB'],[35,'month',350,'GB'],[55,'month',600,'GB']),description:'提供三档月付套餐，月流量覆盖 150GB 至 600GB。',...unknown},
  {id:'edgenova',slug:'edgenova',name:'边缘节点',englishName:'EdgeNova',aliases:['边缘节点 EdgeNova'],rank:21,featured:false,officialUrl:'https://work.edgenovaaff.cc/#/?code=2x2fKZy6',plans:plans([22,'month',120,'GB'],[15,'month',50,'GB'],[35,'month',200,'GB']),description:'套餐按用户提供顺序收录，最低价格不代表套餐 1。',...unknown},
  {id:'trustedcloud',slug:'trustedcloud',name:'可信云',englishName:'Trusted Cloud',aliases:[],rank:22,featured:false,officialUrl:'https://work.kosingaff.com/#/?code=gRMHaOnt',plans:plans([15,'month',60,'GB'],[25,'month',150,'GB'],[50,'month',300,'GB']),description:'提供三档月付套餐，月流量覆盖 60GB 至 300GB。',...unknown},
  {id:'sujie',slug:'sujie',name:'速界',englishName:'SuJie',aliases:['速界 SuJie'],rank:23,featured:false,officialUrl:'https://work.speedworldaff.cc/#/?code=gfvh5a7R',plans:plans([15,'month',50,'GB'],[25,'month',120,'GB'],[50,'month',250,'GB']),description:'提供三档月付套餐，月流量覆盖 50GB 至 250GB。',...unknown},
  {id:'kuaili',slug:'kuaili',name:'快狸',englishName:'KuaiLi',aliases:['快狸 KuaiLi'],rank:24,featured:false,officialUrl:'https://work.kuailicloud.cc/#/?code=1RKCpN09',plans:plans([15,'month',50,'GB'],[22,'month',100,'GB'],[35,'month',250,'GB']),description:'提供三档月付套餐，月流量覆盖 50GB 至 250GB。',...unknown},
  {id:'wuyou',slug:'wuyou',name:'无忧',englishName:'WorryFree',aliases:[],rank:25,featured:false,officialUrl:'https://wep01.worryfreeaff.com/#/?code=rjMhbeMC',plans:plans([19,'month',100,'GB'],[33,'month',200,'GB'],[77,'month',500,'GB']),description:'提供三档月付套餐，月流量覆盖 100GB 至 500GB。',...unknown},
  {id:'lingmao',slug:'lingmao',name:'灵猫',englishName:'Civet',aliases:[],rank:26,featured:false,officialUrl:'https://vip02.civetaff.com/#/?code=TVrpn3XP',plans:plans([25,'month',150,'GB'],[45,'month',300,'GB'],[85,'year',45,'GB']),description:'同时提供月付与年付套餐，原始套餐顺序保持不变。',...unknown},
  {id:'flashleap',slug:'flashleap',name:'闪跃',englishName:'FlashLeap',aliases:['闪跃 FlashLeap'],rank:27,featured:false,officialUrl:'https://vip02.flashleapaff.com/#/?code=013Pt6NT',plans:plans([24,'month',150,'GB'],[44,'month',300,'GB'],[84,'month',600,'GB']),description:'提供三档月付套餐，月流量覆盖 150GB 至 600GB。',...unknown},
  {id:'firefly',slug:'firefly',name:'飞为',englishName:'Firefly',aliases:['飞为 Firefly'],rank:28,featured:false,officialUrl:'https://vip02.fireflyaff.com/#/?code=zS0MBWOC',plans:plans([25,'month',150,'GB'],[45,'month',300,'GB'],[85,'month',600,'GB']),description:'提供三档月付套餐，月流量覆盖 150GB 至 600GB。',...unknown},
  {id:'kuajie',slug:'kuajie',name:'跨界云',englishName:'Kuajie Cloud',aliases:[],rank:29,featured:false,officialUrl:'https://vip02.kuajieaff.com/#/?code=Ns77hvi3',plans:plans([20,'month',120,'GB'],[40,'month',330,'GB'],[90,'month',830,'GB']),description:'提供三档月付套餐，月流量覆盖 120GB 至 830GB。',...unknown},
];

export const AIRPORTS: Airport[] = AIRPORT_BASE.map(airport=>({
  ...airport,
  capabilities:PUBLIC_CAPABILITIES[airport.id],
}));

export const FEATURED_AIRPORTS = AIRPORTS.filter(a=>a.featured).sort((a,b)=>a.rank-b.rank);
export const FIXED_TOP_AIRPORT_IDS = ['lingdong','twilight','invisible','laddercloud','wavenet','flyv'] as const;
export const formatPrice = (p: AirportPlan|null|undefined) => p?`¥${Number.isInteger(p.price)?p.price:p.price.toFixed(2).replace(/0$/,'')}/${p.billingCycle==='year'?'年':'月'}`:'';
export const formatTraffic = (p: AirportPlan|null|undefined) => p?`${p.traffic}${p.trafficUnit}/月`:'';
export const monthlyEquivalent = (p: AirportPlan) => p.billingCycle==='year'?p.price/12:p.price;
export const trafficInGb = (p: AirportPlan) => p.traffic*(p.trafficUnit==='TB'?1024:1);
export const getLowestEntryPlan = (a: Airport):AirportPlan|null => a.plans.length?a.plans.reduce((x,p)=>p.price<x.price?p:x):null;
const aiLabels:Record<keyof PublicCapabilities['ai'],string>={chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini'};
const streamingLabels:Record<keyof PublicCapabilities['streaming'],string>={netflix:'Netflix',disneyPlus:'Disney+',youtube:'YouTube',tiktok:'TikTok'};
export const getAiServices = (a:Airport) => (Object.entries(aiLabels) as Array<[keyof PublicCapabilities['ai'],string]>).filter(([key])=>a.capabilities.ai[key]===true).map(([,label])=>label);
export const getStreamingServices = (a:Airport) => (Object.entries(streamingLabels) as Array<[keyof PublicCapabilities['streaming'],string]>).filter(([key])=>a.capabilities.streaming[key]===true).map(([,label])=>label);
export const getHomepageCapabilitySummary = (a:Airport) => {
  const supported=new Set([...getAiServices(a),...getStreamingServices(a)]);
  return ['ChatGPT','Netflix','Disney+','Claude','Gemini','YouTube','TikTok'].filter(label=>supported.has(label)).slice(0,3).join(' / ');
};

function validateAirports(items: Airport[]) {
  const slugs=new Set<string>(), ranks=new Set<number>();
  const ids=new Set(items.map(a=>a.id));
  if(Object.keys(PUBLIC_CAPABILITIES).length!==items.length||Object.keys(PUBLIC_CAPABILITIES).some(id=>!ids.has(id))) throw new Error('公开参考能力数据与机场清单未一一对应');
  for(const a of items){
    if(slugs.has(a.slug)) throw new Error(`机场 slug 重复：${a.slug}`);
    if(ranks.has(a.rank)) throw new Error(`机场 rank 重复：${a.rank}`);
    slugs.add(a.slug); ranks.add(a.rank); new URL(a.officialUrl);
    if(!a.capabilities||a.capabilities.evidenceLevel!=='public_reference') throw new Error(`${a.name} 缺少公开参考能力数据`);
    if(a.recommendationScoreOverride!==undefined&&(a.recommendationScoreOverride<0||a.recommendationScoreOverride>10)) throw new Error(`${a.name} 综合推荐评分无效`);
    for(const p of a.plans) if(p.price<=0||p.traffic<=0||!['month','year'].includes(p.billingCycle)) throw new Error(`${a.name} 套餐数据无效`);
  }
  const ordered=[...items].sort((a,b)=>a.rank-b.rank);
  if(ordered.some((a,index)=>a.rank!==index+1)) throw new Error('机场 rank 必须从 1 开始连续且不得缺失');
  const top=ordered.slice(0,FIXED_TOP_AIRPORT_IDS.length);
  if(top.some((a,index)=>a.id!==FIXED_TOP_AIRPORT_IDS[index]||a.rank!==index+1||!a.featured)||items.some(a=>a.rank>FIXED_TOP_AIRPORT_IDS.length&&a.featured)) throw new Error('固定 TOP 6 排名或 featured 标记无效');
  if(top.some(a=>a.recommendationScores&&Object.values(a.recommendationScores).some(value=>value<0||value>10))) throw new Error('TOP 6 推荐评分无效');
}
validateAirports(AIRPORTS);

