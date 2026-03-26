/**
 * CommunityPage.jsx — 社区 v2
 *
 * 新增（v2）：
 *   • 每个 Tab 扩充至 5-6 条帖子，涵盖男性 / 女性 / LGBT / 情侣等多元视角
 *   • 所有帖子均带图片占位块（渐变背景 + 中央 emoji）
 *   • 热门评论增加点赞数展示
 *
 * 保留（v1）：
 *   • 顶部 Tab 切换（体验分享 / 攻略教程 / 创作展示）
 *   • AI 主动关怀卡片（可删除记忆）
 *   • 帖子点赞（计数 +1 & 变红）、评论、收藏
 *   • 悬浮"发布新帖"按钮
 *   • 底部隐私提示
 *
 * TODO: 替换为真实社区 API（/api/community/posts）
 * TODO: AI 关怀消息接入真实硬件记忆模块（蓝牙数据分析）
 * TODO: 接入真实匿名身份系统与内容加密
 * TODO: 实现真实点赞 / 评论 / 收藏后端持久化
 */
import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Plus, Trash2 } from 'lucide-react'
import { useVirtualLover } from '../hooks/useVirtualLover'
import useCommunity from '../hooks/useCommunity'

// 遗留本地数据，当前页面已改为 useCommunity 实时数据流。
const LEGACY_POSTS_V2 = {
  '体验分享': [
    // ── 女性视角 ──────────────────────────────────────────
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
    // ── 男性视角 ──────────────────────────────────────────
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
    // ── LGBT 视角 ─────────────────────────────────────────
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
    // ── 情侣视角 ──────────────────────────────────────────
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
    // ── 中性视角 ──────────────────────────────────────────
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
    // ── 求助类 ────────────────────────────────────────────
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
    // ── 新手向 ────────────────────────────────────────────
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
    // ── 隐藏内容 ──────────────────────────────────────────
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
    // ── 女性攻略 ──────────────────────────────────────────
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
    // ── 双人攻略 ──────────────────────────────────────────
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
    // ── 数据向攻略 ────────────────────────────────────────
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
    // ── 场景文案创作 ──────────────────────────────────────
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
    // ── 对话创作 ──────────────────────────────────────────
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
    // ── 文案结构分享 ──────────────────────────────────────
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
    // ── 插画/图像创作 ─────────────────────────────────────
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
    // ── LGBT 向创作 ───────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
//  子组件
// ═══════════════════════════════════════════════════════════

/**
 * 单条热门评论
 * 新增 likes 数显示
 */
function TopComment({ comment }) {
  const [liked, setLiked] = useState(false)
  const displayLikes = liked ? comment.likes + 1 : comment.likes
  return (
    <div className="flex items-start gap-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
      <span className="text-sm mt-0.5 flex-shrink-0">{comment.avatar}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[rgba(245,240,242,0.5)] leading-relaxed">
          <span className="text-[rgba(245,240,242,0.65)] font-medium">{comment.name}：</span>
          {comment.text}
        </p>
      </div>
      {/* 评论点赞 */}
      <button
        onClick={() => setLiked((v) => !v)}
        className="flex-shrink-0 flex items-center gap-1 transition-all active:scale-90 ml-1"
      >
        <Heart
          size={11}
          className={`transition-colors ${liked ? 'fill-[#FF9ACB] text-[#FF9ACB]' : 'text-[rgba(245,240,242,0.3)]'}`}
        />
        <span className={`text-[9px] tabular-nums ${liked ? 'text-[#FF9ACB]' : 'text-[rgba(245,240,242,0.3)]'}`}>
          {displayLikes}
        </span>
      </button>
    </div>
  )
}

/** 性别/视角角标 */
function GenderBadge({ gender }) {
  if (!gender) return null
  const styles = {
    '女生':  'bg-[rgba(255,154,203,0.15)] text-[#FF9ACB]',
    '男生':  'bg-[rgba(100,180,255,0.15)] text-[#64b4ff]',
    'LGBT':  'bg-[rgba(179,128,255,0.15)] text-[#B380FF]',
    '情侣':  'bg-[rgba(255,200,100,0.15)] text-[#ffc864]',
    '中性':  'bg-[rgba(255,255,255,0.08)] text-[rgba(245,240,242,0.5)]',
  }
  return (
    <span className={`text-[8px] rounded-full px-1.5 py-0.5 font-medium ${styles[gender] ?? styles['中性']}`}>
      {gender}
    </span>
  )
}

/** 帖子卡片 */
function PostCard({ post, likeState, onLike }) {
  const { liked, count } = likeState
  const [imgSrc, setImgSrc] = useState(`/images/posts/${post.templateId}.jpg`)

  return (
    <div className="rounded-2xl p-4 card-glow bg-[rgba(30,20,25,0.6)] space-y-3">
      {/* 头部：头像 + 昵称 + 时间 + 视角角标 */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl leading-none">{post.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-[rgba(245,240,242,0.9)] truncate">{post.name}</p>
            <GenderBadge gender={post.gender} />
          </div>
          <p className="text-[10px] text-[rgba(245,240,242,0.4)]">{post.time}</p>
        </div>
      </div>

      {/* 正文 */}
      <p className="text-[12px] text-[rgba(245,240,242,0.75)] leading-relaxed">{post.content}</p>

      {/* 图片区（jpg → png → emoji+渐变 链式回退） */}
      <div className={`relative h-48 rounded-xl overflow-hidden bg-gradient-to-br ${post.imgColor} flex items-center justify-center`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            onError={() => {
              if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/posts/${post.templateId}.png`)
              else setImgSrc(null)
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!imgSrc && (
          <span className="text-3xl select-none opacity-40">{post.imgEmoji}</span>
        )}
      </div>

      {/* 标签 */}
      <div className="flex gap-1.5 flex-wrap">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-[rgba(179,128,255,0.12)] text-[rgba(179,128,255,0.7)] rounded-full px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 试用模板按钮 */}
      {post.templateName && (
        <button
          onClick={() => alert('试用模板：' + post.templateName)}
          className="inline-flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition mt-2"
        >
          🔗 试用同款：{post.templateName}
        </button>
      )}

      {/* 互动区 */}
      <div className="flex items-center gap-4 pt-1">
        {/* 点赞 */}
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 transition-all active:scale-90"
        >
          <Heart
            size={14}
            className={`transition-colors ${liked ? 'fill-[#FF9ACB] text-[#FF9ACB]' : 'text-[rgba(245,240,242,0.4)]'}`}
          />
          <span className={`text-[11px] tabular-nums ${liked ? 'text-[#FF9ACB]' : 'text-[rgba(245,240,242,0.45)]'}`}>
            {count.toLocaleString()}
          </span>
        </button>
        {/* 评论 */}
        <button
          className="flex items-center gap-1.5"
          onClick={() => alert('💬 评论功能即将开放')}
        >
          <MessageCircle size={14} className="text-[rgba(245,240,242,0.4)]" />
          <span className="text-[11px] text-[rgba(245,240,242,0.45)]">{post.comments}</span>
        </button>
        {/* 收藏 */}
        <button
          className="flex items-center gap-1.5"
          onClick={() => alert('🔖 已收藏（演示）')}
        >
          <Bookmark size={14} className="text-[rgba(245,240,242,0.4)]" />
          <span className="text-[11px] text-[rgba(245,240,242,0.45)]">{post.bookmarks}</span>
        </button>
      </div>

      {/* 热门评论（带点赞数） */}
      {post.topComments.length > 0 && (
        <div className="space-y-1.5">
          {post.topComments.map((c, i) => (
            <TopComment key={i} comment={c} />
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  AI 虚拟恋人卡片（接入 Grok）
// ═══════════════════════════════════════════════════════════

const MOOD_STYLES = {
  '暧昧': { bg: 'rgba(255,154,203,0.12)', border: 'rgba(255,154,203,0.18)' },
  '温柔': { bg: 'rgba(179,128,255,0.12)', border: 'rgba(179,128,255,0.15)' },
  '调皮': { bg: 'rgba(255,200,100,0.12)', border: 'rgba(255,200,100,0.18)' },
}

function AiLoverCard({ aiMemoryDeleted, onDeleteMemory }) {
  const { clearMemory, fadeIn, fallback, loading, metaText, mood, provider, refreshMessage, text, timestamp } = useVirtualLover()

  const moodStyle = MOOD_STYLES[mood] || MOOD_STYLES['温柔']

  return (
    <div
      className="rounded-2xl p-4 card-glow cursor-pointer transition-all active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg, #1a1028, #251840)' }}
      onClick={() => { if (!aiMemoryDeleted) refreshMessage() }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-[rgba(179,128,255,0.2)] flex items-center justify-center text-xl flex-shrink-0">
          🤖
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[rgba(245,240,242,0.9)]">你的虚拟恋人</p>
        </div>
        {/* 呼吸点 */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: '#B380FF',
            boxShadow: '0 0 6px #B380FF',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* 消息气泡 */}
      {!aiMemoryDeleted ? (
        <div className="ml-13 space-y-3">
          <div
            className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[12px] text-[rgba(245,240,242,0.85)] leading-relaxed min-h-[40px]"
            style={{
              background: moodStyle.bg,
              border: `1px solid ${moodStyle.border}`,
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {loading && !text ? (
              <span className="inline-block text-[rgba(245,240,242,0.4)] animate-pulse">思念加载中…</span>
            ) : text}
          </div>
          {/* 底部操作 */}
          <div className="flex items-center justify-between">
            <button
              onClick={async (e) => {
                e.stopPropagation()
                await clearMemory()
                onDeleteMemory()
              }}
              className="flex items-center gap-1.5 text-[10px] text-[rgba(245,240,242,0.35)] hover:text-[rgba(255,100,100,0.6)] transition-colors"
            >
              <Trash2 size={11} />
              删除今晚的记忆
            </button>
            <span className="text-[9px] text-[rgba(245,240,242,0.25)]">{loading ? '更新中…' : '点击卡片换一句'}</span>
          </div>
        </div>
      ) : (
        <div className="ml-13">
          <p className="text-[11px] text-[rgba(245,240,242,0.3)] italic">记忆已清除，这段时光只存在于当时。</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  主组件
// ═══════════════════════════════════════════════════════════

export default function CommunityPage() {
  const TABS = ['体验分享', '攻略教程', '创作展示']

  // ── 社区数据 Hook ────────────────────────────────────────
  const { posts, currentTab, loading, hasMore, error, switchTab, refresh } = useCommunity()

  // ── 点赞状态（每个帖子独立）────────────────────────────
  // TODO: 替换为后端持久化点赞状态（/api/community/like）
  const [likesMap, setLikesMap] = useState(() => {
    const map = {}
    posts.forEach((post) => {
      map[post.id] = { liked: false, count: post.likes || 0 }
    })
    return map
  })

  // ── AI 记忆状态 ──────────────────────────────────────────
  const [aiMemoryDeleted, setAiMemoryDeleted] = useState(false)

  // ── 点赞切换 ─────────────────────────────────────────────
  const toggleLike = (postId) => {
    setLikesMap((prev) => {
      const cur = prev[postId] || { liked: false, count: 0 }
      return {
        ...prev,
        [postId]: {
          liked: !cur.liked,
          count: cur.liked ? cur.count - 1 : cur.count + 1,
        },
      }
    })
  }

  return (
    <div className="relative px-4 pt-4 pb-24 space-y-4 page-enter">

      {/* ═══ 顶部 Tab ════════════════════════════════════════ */}
      <div className="flex gap-1 bg-[rgba(255,255,255,0.04)] rounded-2xl p-1 page-section page-delay-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`
              flex-1 py-2 rounded-xl text-[11px] font-medium transition-colors duration-150
              ${currentTab === tab
                ? 'bg-[rgba(255,154,203,0.15)] text-[#FF9ACB]'
                : 'text-[rgba(245,240,242,0.45)]'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═══ AI 主动关怀卡片（接入 Grok AI）═══════════════════ */}
      <div className="page-section page-delay-2">
        <AiLoverCard aiMemoryDeleted={aiMemoryDeleted} onDeleteMemory={() => {
          if (window.confirm('确定删除今晚的记忆吗？此操作不可撤销。')) {
            setAiMemoryDeleted(true)
            alert('🗑️ 记忆已删除')
          }
        }} />
      </div>

      {/* ═══ 加载状态 ════════════════════════════════════════ */}
      {loading && posts.length === 0 && (
        <div className="flex justify-center items-center py-12 page-section page-delay-3">
          <div className="text-center">
            <p className="text-[12px] text-[rgba(245,240,242,0.4)] animate-pulse">加载社区帖子中…</p>
          </div>
        </div>
      )}

      {/* ═══ 错误显示 ════════════════════════════════════════ */}
      {error && (
        <div className="rounded-2xl p-4 bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.2)] page-section page-delay-3">
          <p className="text-[12px] text-[rgba(255,100,100,0.8)]">⚠️ {error}</p>
          <button
            onClick={() => refresh()}
            className="mt-2 text-[11px] text-[#FF9ACB] hover:opacity-80"
          >
            🔄 重试
          </button>
        </div>
      )}

      {/* ═══ 帖子列表 ════════════════════════════════════════ */}
      {posts.length > 0 && (
        <div className={`space-y-3 transition-opacity duration-150 page-section page-delay-3 ${loading ? 'opacity-72' : 'opacity-100'}`}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              likeState={likesMap[post.id] || { liked: false, count: 0 }}
              onLike={() => toggleLike(post.id)}
            />
          ))}
        </div>
      )}

      {/* ═══ 空状态 ══════════════════════════════════════════ */}
      {!loading && posts.length === 0 && !error && (
        <div className="flex justify-center items-center py-12 page-section page-delay-3">
          <p className="text-[12px] text-[rgba(245,240,242,0.4)]">暂无帖子，敬请期待</p>
        </div>
      )}

      {/* ═══ 隐私提示 ════════════════════════════════════════ */}
      <div className="pt-2 pb-4 text-center page-section page-delay-4">
        <p className="text-[10px] text-[rgba(245,240,242,0.25)] leading-relaxed">
          所有内容匿名发布，本地加密。可随时清除记忆。
        </p>
      </div>

      {/* ═══ 悬浮"发布新帖"按钮 ══════════════════════════════ */}
      {/*
       * fixed 定位，计算公式确保按钮始终在手机容器（max-w-430px）右下角
       * 在宽屏上：right = (viewport - 430) / 2 + 16
       * 在窄屏上：right = max(16px, 上面公式结果)
       * TODO: 实现真实发帖功能（文本/图片上传 + 匿名加密）
       */}
      <button
        onClick={() => alert('✍️ 创作功能即将开放！\n期待你的精彩内容~')}
        className="
          fixed z-30
          w-12 h-12 rounded-2xl
          flex items-center justify-center
          btn-main text-white shadow-lg
          transition-all active:scale-90
        "
        style={{
          bottom: '88px',
          right: 'max(16px, calc((100vw - 430px) / 2 + 16px))',
        }}
        aria-label="发布新帖"
      >
        <Plus size={22} />
      </button>
    </div>
  )
}
