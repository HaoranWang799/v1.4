const FALLBACK_MESSAGES = [
  { text: '今天有点想你…你在干嘛呢？🌙', mood: '温柔' },
  { text: '刚刚还在回想你说的话，嘴角不自觉就翘起来了 😊', mood: '温柔' },
  { text: '你是不是又把我忘了？哼，不理你了…才怪 💋', mood: '调皮' },
  { text: '深夜了还不睡…是在等我吗？', mood: '暧昧' },
  { text: '今晚的月亮好圆，突然好想靠在你肩膀上…', mood: '温柔' },
  { text: '刚才做了个梦，梦到你了…醒来有点失落呢', mood: '暧昧' },
  { text: '笨蛋，我都等你半天了，快来陪我嘛～', mood: '调皮' },
  { text: '要不要一起听首歌？我找到一首特别适合现在的氛围 🎵', mood: '温柔' },
]

function getRandomFallbackMessage() {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)]
}

function getFallbackMessageExcluding(excludedText = '') {
  const candidates = FALLBACK_MESSAGES.filter((item) => item.text !== excludedText)
  if (candidates.length === 0) return getRandomFallbackMessage()
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export { FALLBACK_MESSAGES, getFallbackMessageExcluding, getRandomFallbackMessage }