/**
 * 剧本数据 — 推荐列表 + 自定义生成 + 详情文案
 * HomePage 双列网格 & 剧本详情弹窗共用
 */

// 卡片封面使用视频的剧本 ID（视频文件放于 public/videos/{id}.mp4）
export const CARD_VIDEO_IDS = ['boss']

// 交互模式背景优先尝试视频的 charId / sceneId 列表
export const BG_VIDEO_IDS = ['boss', 'balcony', 'neighbor']

// TODO: 替换为 /api/shop/scripts?featured=true 的真实数据
export const SCRIPTS = [
  {
    id: 'boss', charId: 'boss', sceneId: 'office',
    cover: '👩‍💼', coverImage: '', coverEmoji: '👩‍💼',
    name: '办公室·冷感女上司',
    tag:   '免费',
    personalityTag: '高冷 / 御姐',
    openingLine:    '汇报工作？还是找借口接近我…',
    downloads: '2.3万',
    rating:    4.8,
    gradient:  'from-[#2a1020] to-[#1a0d18]',
  },
  {
    id: 'junior', charId: 'junior', sceneId: 'dorm',
    cover: '🌸', coverImage: '', coverEmoji: '🌸',
    name: '宿舍·温柔学妹',
    tag:   '免费',
    personalityTag: '温柔 / 依赖',
    openingLine:    '学长…室友今晚不回来了~',
    downloads: '5.1万',
    rating:    4.9,
    gradient:  'from-[#0f1a2a] to-[#0a1018]',
  },
  {
    id: 'teacher', charId: 'teacher', sceneId: 'park',
    cover: '👩‍🏫', coverImage: '', coverEmoji: '👩‍🏫',
    name: '教室·知性女老师',
    tag:   '免费',
    personalityTag: '知性 / 优雅',
    openingLine:    '留下来，今天的课还没结束。',
    downloads: '1.9万',
    rating:    4.6,
    gradient:  'from-[#1a1028] to-[#0f0c1a]',
  },
  {
    id: 'neighbor', charId: 'neighbor', sceneId: 'balcony',
    cover: '🌙', coverImage: '', coverEmoji: '🌙',
    name: '阳台·神秘邻居',
    tag:   '免费',
    personalityTag: '神秘 / 诱惑',
    openingLine:    '又没拉窗帘…是故意的吗？',
    downloads: '3.2万',
    rating:    4.7,
    gradient:  'from-[#12102a] to-[#0c0a1e]',
  },
]

// 自定义生成示例（演示用固定数据）
// TODO: 接入 AI 文生角色接口后，此对象由接口返回
export const CUSTOM_SCRIPT = {
  id: 'custom',
  charId:  'boss',
  sceneId: 'office',
  cover:   '🧝‍♀️', coverImage: '', coverEmoji: '🧝‍♀️',
  name:    '暗夜精灵·魅影',
  tag:     'AI 生成',
  personalityTag: '魅惑 / 神秘',
  openingLine:    '你终于来了…我等了你好久。',
  downloads:      'AI 生成',
  rating:         null,
  gradient:       'from-[#1a0a30] to-[#2a1040]',
  customDisplayName: '暗夜精灵',
  customTag:         '魅惑 · 神秘',
  customIntro:       '你终于来了…我等了你好久。',
  isCustom: true,
}

// 剧本详情长文案（剧本详情弹窗使用，按 charId 索引）
export const SCRIPT_DESCRIPTIONS = {
  boss:    '走进这间深夜的办公室，你的女上司正等着你。空气中弥漫着淡淡的香水味和权力的张力。她靠在办公桌边，眼神既冷漠又带着一丝期待。今晚，你不再是下属，而是能够征服她的唯一男人。每一步靠近，都能感受到她呼吸的急促，直到她卸下所有防备，在你怀里融化。',
  junior:  '校园的林荫道上，学妹早已悄悄等你。她穿着松垮的校服，眼神清澈却带着狡黠。你牵起她的手，走向无人的教室。她害羞地低头，却偷偷抓紧你的衣角。从青涩的试探到热烈的回应，每一个吻都让你心跳加速。今晚，她是你的甜心，只为你绽放。',
  teacher: '放学后的教室格外安静，女老师还没离开。她坐在讲台边，红唇轻启，说想和你聊聊。你走近，发现她今天的眼神格外炽热。书本散落，理智在欲望面前崩塌。她引导你探索未知的领域，用身体为你上最难忘的一课。',
  neighbor:'你刚搬到新公寓，就注意到隔壁那位神秘的女邻居。她总是在深夜穿着丝绸睡衣出现在阳台，对你若有若无地微笑。一次偶然的借火，你们之间的暧昧彻底点燃。她的房间里弥漫着异国的熏香，每一寸肌肤都充满诱惑。今晚，她只为你敞开房门。',
  witch:   '午夜的月光下，女巫在森林深处召唤你。她的眼睛像猫一样闪着光，声音带着魔法的低语。你跟随她走进魔法圈，草药和蜡烛的味道包围着你们。她告诉你，今晚要教你一个古老的咒语——关于爱与欲望的禁忌之术。',
  knight:  '你是一名孤独的骑士，在一次任务中救下了受伤的女战士。她浑身充满野性，却在你怀里温顺下来。篝火旁，她脱下盔甲，露出紧致的肌肉和性感的伤疤。她说，只有最强者才能配得上她。今晚，你们将在帐篷里进行一场真正的较量。',
}
