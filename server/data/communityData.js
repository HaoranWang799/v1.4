/**
 * 社区 Mock 数据 - 完整的社区帖子库
 * 按 Tab 分类存储，支持分页查询
 */

const COMMUNITY_POSTS = {
  '体验分享': [
    {
      id: 1, templateId: 'boss', templateName: '冷感女上司·深夜版',
      avatar: '💋', name: '小野猫', time: '1小时前',
      gender: '女生',
      content: '剧本开头那一句话直接让我脸红心跳 >///<  她的声线带着那种克制的暧昧，整个人陷进去出不来了…被窝里偷偷听，听完又重听，根本停不下来。那种酥麻的感觉久久不散，这款真的要封神！',
      imgColor: 'from-[#2a1030] to-[#1a0d22]', imgEmoji: '💋',
      likes: 892, comments: 64, bookmarks: 178,
      tags: ['#今夜体验', '#女生向', '#好评如潮'],
      topComments: [
        { avatar: '🦊', name: '夜行狐', text: '同感！那个声线我真的绷不住了哈哈哈', likes: 34 },
        { avatar: '🌈', name: '彩虹下的他', text: '羞耻感正是精髓所在！', likes: 18 },
      ],
    },
    {
      id: 2, templateId: 'junior', templateName: '温柔学妹·宿舍私语',
      avatar: '🏋️', name: '硬汉柔情', time: '3小时前',
      gender: '男生',
      content: '强劲模式开启那一刻，兄弟我直接升天了，温度涨到 80 整个人酥到动不了…配上学妹那个声线，比真人还真人。当时躺着一动不动，脑子已经空了。悔恨没早点买，强推给所有还在犹豫的兄弟们 💪',
      imgColor: 'from-[#1a1530] to-[#0f0d20]', imgEmoji: '🏋️',
      likes: 1247, comments: 89, bookmarks: 312,
      tags: ['#今夜体验', '#男生向', '#新人必看'],
      topComments: [
        { avatar: '🐯', name: '隐藏剧情猎人', text: '兄弟我也是这样入坑的！一入侯门深似海', likes: 67 },
        { avatar: '🐼', name: '熊猫不睡觉', text: '强劲版直接起飞，下次试极限版', likes: 29 },
      ],
    },
    {
      id: 3, templateId: 'rb1', templateName: '彩虹之约·校园初恋',
      avatar: '🌈', name: '彩虹下的他', time: '5小时前',
      gender: 'LGBT',
      content: '和男友一起试了彩虹专区，太棒了！双人联动剧本在两个设备上同步震动，连接的瞬间我俩都笑出来了，笑完又觉得很感动…异地党福音，隔着屏幕也能感受到彼此 🌈',
      imgColor: 'from-[#1a1040] to-[#0d0d30]', imgEmoji: '🌈',
      likes: 2134, comments: 156, bookmarks: 489,
      tags: ['#今夜体验', '#LGBT', '#彩虹专区', '#异地恋'],
      topComments: [
        { avatar: '💋', name: '小野猫', text: '异地党直接泪目，这功能太暖了', likes: 112 },
        { avatar: '✏️', name: '写字的人', text: '双人联动是真的做到了情感连接！', likes: 78 },
      ],
    },
    {
      id: 4, templateId: 'h3', templateName: '阳台邂逅·月夜情话',
      avatar: '💑', name: '甜蜜小两口', time: '昨天',
      gender: '情侣',
      content: '和老公一起体验了双人剧本，互相控制对方的设备，刚开始一直在笑根本进不了状态哈哈哈…后来慢慢沉浸进去，感情好像又升温了不少。推荐所有情侣试试，是很新鲜的共同体验！',
      imgColor: 'from-[#2a1520] to-[#1a0d18]', imgEmoji: '💑',
      likes: 3458, comments: 203, bookmarks: 765,
      tags: ['#今夜体验', '#情侣向', '#双人互动'],
      topComments: [
        { avatar: '🏋️', name: '硬汉柔情', text: '这个必须安利给我对象！', likes: 145 },
        { avatar: '🌈', name: '彩虹下的他', text: '哈哈哈笑场那段太真实了，我俩也是', likes: 98 },
      ],
    },
    {
      id: 5, templateId: 'neighbor', templateName: '阳台·神秘邻居',
      avatar: '🦊', name: '夜行狐', time: '昨天',
      gender: '中性',
      content: '深夜阳台配神秘邻居，温度涨到 100 那一刻整个人升天了…那段低沉的开场白让我心跳乱了节拍，之后他说的每一句话都像在贴着耳朵讲。城市灯光的氛围感绝了，简直就是我私人幻想的具象化！',
      imgColor: 'from-[#12102a] to-[#0d0b1e]', imgEmoji: '🌃',
      likes: 518, comments: 32, bookmarks: 87,
      tags: ['#今夜体验', '#神秘邻居', '#场景推荐'],
      topComments: [
        { avatar: '💋', name: '小野猫', text: '神秘邻居的亲密语句简直了…', likes: 45 },
        { avatar: '🎨', name: '创作家Mia', text: '阳台场景的灯光设计是真的用心', likes: 22 },
      ],
    },
    {
      id: 6, templateId: 'teacher', templateName: '知性女老师·放学后',
      avatar: '🐼', name: '熊猫不睡觉', time: '前天',
      gender: '中性',
      content: '知性女老师新出了一段隐藏对话，内容不敢说，反正让我耳根都红透了…温度 80-90 之间触发过一次就再也没复现，连续三晚了 QAQ 求大神告诉我触发条件，那段台词太要命了，必须再听一遍！',
      imgColor: 'from-[#1a1520] to-[#120f18]', imgEmoji: '🔍',
      likes: 123, comments: 56, bookmarks: 22,
      tags: ['#私房秘籍求助', '#知性女老师', '#我的幻想'],
      topComments: [
        { avatar: '🦁', name: '攻略达人', text: '语音按钮 + 主按钮交替触发，亲测有效！', likes: 31 },
        { avatar: '🐯', name: '隐藏剧情猎人', text: '还要保持温度在 82 以上，太低不触发', likes: 19 },
      ],
    },
  ],

  '攻略教程': [
    {
      id: 7, templateId: 'junior', templateName: '温柔学妹·宿舍私语',
      avatar: '🦁', name: '攻略达人', time: '2小时前',
      content: '【新手必看】温度快速提升攻略：先选"宿舍"场景 + 温柔学妹，先点 2 次主按钮，再用语音按钮，比纯点击快 3 倍！亲测有效，收藏备用。评论区有各角色详细适配表。',
      imgColor: 'from-[#0f2a1a] to-[#0a1a10]', imgEmoji: '📋',
      likes: 892, comments: 67, bookmarks: 234,
      tags: ['#私房秘籍', '#新手向', '#温度提升'],
      topComments: [
        { avatar: '🦊', name: '夜行狐', text: '照着做了，真的快了好多！感谢大佬', likes: 58 },
        { avatar: '🌈', name: '彩虹糖果', text: '已收藏，下次按图索骥', likes: 34 },
      ],
    },
    {
      id: 8, templateId: 'neighbor', templateName: '深夜阳台·神秘邻居',
      avatar: '🐯', name: '隐藏剧情猎人', time: '1天前',
      content: '已解锁全部 4 个角色的隐藏结局！触发条件：温度在 60-80 之间，连续使用语音按钮 5 次，不点主按钮。不同角色的隐藏台词各有千秋，神秘邻居那条让我直接破防，详情见评论区👇',
      imgColor: 'from-[#2a1020] to-[#1a0d16]', imgEmoji: '🗝️',
      likes: 1205, comments: 134, bookmarks: 567,
      tags: ['#私房秘籍', '#隐藏内容', '#全角色'],
      topComments: [
        { avatar: '🐼', name: '熊猫不睡觉', text: '谢谢大神！女老师那条我终于解锁了！', likes: 89 },
        { avatar: '🦋', name: '蝴蝶效应', text: '神秘邻居的隐藏台词真的破防了', likes: 67 },
      ],
    },
    {
      id: 9, templateId: 'boss', templateName: '冷感女上司·深夜版',
      avatar: '🦋', name: '蝴蝶效应', time: '2天前',
      content: '冷感女上司触发亲密语句条件整理完毕～配合"办公室"场景有加成效果。主按钮点 5 次后切换语音，命中率最高达 87%。附：不同星期触发概率有差异，周五命中率最高（笑）',
      imgColor: 'from-[#251030] to-[#180d20]', imgEmoji: '💼',
      likes: 445, comments: 28, bookmarks: 189,
      tags: ['#私房秘籍', '#冷感女上司', '#命中率'],
      topComments: [
        { avatar: '💋', name: '小野猫', text: '感谢整理！书签了！周五专程去试', likes: 42 },
        { avatar: '🦁', name: '攻略达人', text: '周五概率差异是真的，有趣的发现', likes: 27 },
      ],
    },
    {
      id: 10, templateId: 'h3', templateName: '阳台邂逅·月夜情话',
      avatar: '💑', name: '甜蜜小两口', time: '3天前',
      content: '【情侣双人攻略】两台设备同时在线时，有专属的"共鸣"加成！一方达到高温时另一方震动频率自动提升。诀窍是保持两人节奏一致，可以语音通话同步操作，体验完全不同！',
      imgColor: 'from-[#2a1818] to-[#1a0f10]', imgEmoji: '🔗',
      likes: 2876, comments: 198, bookmarks: 934,
      tags: ['#私房秘籍', '#双人联动', '#情侣向'],
      topComments: [
        { avatar: '🌈', name: '彩虹下的他', text: '共鸣加成！这个机制我之前完全没注意到', likes: 134 },
        { avatar: '🏋️', name: '硬汉柔情', text: '拉着对象试了，确实不一样！', likes: 98 },
      ],
    },
    {
      id: 11, templateId: 'junior', templateName: '温柔学妹·宿舍私语',
      avatar: '📊', name: '数据控小明', time: '4天前',
      content: '做了个统计：体验过 20+ 次后发现，早上 8-10 点和晚上 10-12 点温度上升速率最快，可能跟服务器负载有关。另外男性角色的语音响应延迟普遍比女性角色低 0.3s，有点在意哈哈',
      imgColor: 'from-[#102530] to-[#0a1820]', imgEmoji: '📊',
      likes: 678, comments: 45, bookmarks: 267,
      tags: ['#私房秘籍', '#数据分析', '#硬核向'],
      topComments: [
        { avatar: '🐯', name: '隐藏剧情猎人', text: '服务器时段这个观察很有价值！', likes: 56 },
        { avatar: '🦁', name: '攻略达人', text: '延迟差异这个我要去验证一下', likes: 38 },
      ],
    },
  ],

  '创作展示': [
    {
      id: 12, templateId: 'neighbor', templateName: '神秘邻居·月夜偶遇',
      avatar: '🎨', name: '创作家Mia', time: '1小时前',
      content: '自制了一个"星空海边"场景文案，氛围感参考了冬日夜晚+潮声+微风的感觉，角色设定是"沉默的灯塔守望者"。如果官方能上架就好了…先分享给大家，欢迎二创和改编！',
      imgColor: 'from-[#101825] to-[#080d18]', imgEmoji: '🌊',
      likes: 678, comments: 89, bookmarks: 123,
      tags: ['#我的幻想', '#同人场景', '#星空海边'],
      topComments: [
        { avatar: '✏️', name: '写字的人', text: '氛围感绝了！"沉默的灯塔守望者"这个角色设定太戳我了', likes: 67 },
        { avatar: '🦁', name: '攻略达人', text: '建议官方直接采纳，质量完全够了', likes: 45 },
      ],
    },
    {
      id: 13, templateId: 'neighbor', templateName: '深夜阳台·神秘邻居',
      avatar: '✏️', name: '写字的人', time: '6小时前',
      content: '给神秘邻居写了一段扩展对话，尽量模仿了官方语气风格——克制、暧昧、留白。大家来评评看～有没有违和感？完全没信心哈哈，真心求反馈！附全文在评论区。',
      imgColor: 'from-[#201028] to-[#150b1e]', imgEmoji: '✍️',
      likes: 345, comments: 45, bookmarks: 78,
      tags: ['#我的幻想', '#对话创作', '#神秘邻居'],
      topComments: [
        { avatar: '🎨', name: '创作家Mia', text: '完全感觉不出来！留白处理太妙了', likes: 38 },
        { avatar: '🦋', name: '蝴蝶效应', text: '第三句台词直接拿捏了，官方同款味道', likes: 29 },
      ],
    },
    {
      id: 14, templateId: 'junior', templateName: '温柔学妹·宿舍私语',
      avatar: '🌈', name: '彩虹糖果', time: '1天前',
      content: '整理了一套"渐进式互动"的文案搭配方案，从 IDLE → ACTIVE → AFTER_RESPONSE 三阶段过渡感极其丝滑。核心逻辑是情绪递进，不能跳层。大家可以参考这个结构做二创～',
      imgColor: 'from-[#1a2a10] to-[#0f1a08]', imgEmoji: '📐',
      likes: 234, comments: 19, bookmarks: 156,
      tags: ['#我的幻想', '#文案结构', '#方法论'],
      topComments: [
        { avatar: '🐯', name: '隐藏剧情猎人', text: '好用！情绪递进这个逻辑我直接拿去用了', likes: 34 },
        { avatar: '✏️', name: '写字的人', text: '"不能跳层"说得太对了，跳层感觉很出戏', likes: 21 },
      ],
    },
    {
      id: 15, templateId: 'boss', templateName: '冷感女上司·深夜版',
      avatar: '🖼️', name: '插画师Leo', time: '2天前',
      content: '画了一组"角色·心境"的概念插图，用色彩温度来表达不同状态：冷色调=神秘邻居的疏离感，暖玫瑰色=温柔学妹的温存感。画风偏朦胧，欢迎大家参考用于二创封面～',
      imgColor: 'from-[#2a1535] to-[#1a0d28]', imgEmoji: '🖼️',
      likes: 1567, comments: 112, bookmarks: 445,
      tags: ['#我的幻想', '#插画', '#角色设计'],
      topComments: [
        { avatar: '🎨', name: '创作家Mia', text: '色彩和角色气质的对应太准了！', likes: 89 },
        { avatar: '🌈', name: '彩虹糖果', text: '朦胧感处理得很有美感，求完整版！', likes: 67 },
      ],
    },
    {
      id: 16, templateId: 'rb4', templateName: '郁金香庭院·雨后',
      avatar: '🌈', name: '彩虹下的他', time: '3天前',
      content: '写了一个"男性 × 男性"的双人剧本文案，角色设定是"青梅竹马·多年后重逢"。官方彩虹专区目前同类内容还较少，希望能填补空白～欢迎同好取用，注明来源就好！',
      imgColor: 'from-[#1a1040] to-[#0d0d28]', imgEmoji: '🌈',
      likes: 3212, comments: 267, bookmarks: 891,
      tags: ['#我的幻想', '#LGBT', '#剧本创作', '#彩虹专区'],
      topComments: [
        { avatar: '💋', name: '小野猫', text: '青梅竹马重逢这个设定直接击中！期待正文！', likes: 178 },
        { avatar: '✏️', name: '写字的人', text: '这类内容太少了，感谢填补！写得很细腻', likes: 134 },
      ],
    },
  ],
}

/**
 * 获取指定 Tab 的帖子（支持分页）
 * @param {string} tab - 标签名称
 * @param {number} page - 页码（从 1 开始）
 * @param {number} limit - 每页条数（默认 5）
 * @returns {{ posts: Array, hasMore: boolean, total: number }}
 */
function getPostsByTab(tab = '体验分享', page = 1, limit = 5) {
  const allPosts = COMMUNITY_POSTS[tab] || []
  const total = allPosts.length
  const startIndex = (page - 1) * limit
  const posts = allPosts.slice(startIndex, startIndex + limit)

  return {
    posts,
    tab,
    page,
    limit,
    total,
    hasMore: startIndex + limit < total,
    _source: 'mock'
  }
}

export {
  COMMUNITY_POSTS,
  getPostsByTab
}
