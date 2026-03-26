/**
 * 场景数据 — 统一数据源
 * HomePage 互动选择 & 场景氛围共用
 * TODO: 替换为 /api/scenes 的真实数据
 */
export const SCENES = [
  {
    id: 'office',
    name: '办公室',
    emoji: '🏢',
    overlayRgb: '255, 180, 80',
    ambiance: {
      idle: '格子间的灯光昏黄，键盘声渐渐停了…',
      warm: '加班的气息里，暗流在涌动…',
      hot:  '夜深了，窗外的城市还在喧嚣，这里只剩彼此…',
    },
  },
  {
    id: 'dorm',
    name: '宿舍',
    emoji: '🛏️',
    overlayRgb: '200, 80, 200',
    ambiance: {
      idle: '风扇嗡嗡作响，空气里弥漫着熟悉的气息…',
      warm: '被子的温度越来越高，呼吸也乱了…',
      hot:  '只有你们两个人，时间好像停住了…',
    },
  },
  {
    id: 'park',
    name: '公园',
    emoji: '🌿',
    overlayRgb: '100, 190, 100',
    ambiance: {
      idle: '落叶轻飘，夕阳把一切都染得暖橙色…',
      warm: '风带走了你的话，留下的只有心跳…',
      hot:  '天色暗下来了，你们还没有离开…',
    },
  },
  {
    id: 'balcony',
    name: '夜晚阳台',
    emoji: '🌃',
    overlayRgb: '80, 120, 255',
    ambiance: {
      idle: '夜风微凉，月光洒在你的脸上…',
      warm: '星星都在看着你们，什么都藏不住…',
      hot:  '城市的噪音消失了，只听得到彼此的呼吸…',
    },
  },
]
