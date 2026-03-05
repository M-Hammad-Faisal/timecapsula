// ── Shared template definitions ────────────────────────────────────
// Single source of truth used by WriteCapsule, Dashboard (EditFlow),
// and any future components that need template data.

export const TEMPLATES = [
  {
    id: 'cosmic',
    tier: 'free',
    scenario: '✦ For anyone',
    name: 'Cosmic Night',
    desc: 'Timeless · Dark · Mysterious',
    placeholder:
      "Write as if time doesn't exist. No one will read this until the moment you choose...",
    card: { bg: '#080c14', accent: '#e8a84c', text: '#f2e8d5', dim: '#c8b898' },
    email: {
      bg: '#080c14',
      header: 'linear-gradient(135deg,#0d1525,#111d35)',
      accent: '#e8a84c',
      text: '#f2e8d5',
      dim: '#c8b898',
      border: 'rgba(232,168,76,0.2)',
    },
  },
  {
    id: 'dawn',
    tier: 'free',
    scenario: '🌅 For hope',
    name: 'Golden Dawn',
    desc: 'Hopeful · Warm · Uplifting',
    placeholder:
      "By the time you read this, the sun will have risen many times. Here's what I want you to remember...",
    card: { bg: '#fff8e8', accent: '#c47a1a', text: '#2a1505', dim: '#8a6030' },
    email: {
      bg: '#fff8e8',
      header: 'linear-gradient(135deg,#fff8e8,#fdecc0)',
      accent: '#c47a1a',
      text: '#2a1505',
      dim: '#8a6030',
      border: 'rgba(196,122,26,0.2)',
    },
  },
  {
    id: 'midnight-letter',
    tier: 'free',
    scenario: '🌙 For yourself',
    name: 'Midnight Letter',
    desc: 'Reflective · Cool · Honest',
    placeholder: "Dear future me, right now I'm sitting here thinking about...",
    card: { bg: '#0a0f1e', accent: '#8ab4f8', text: '#e8f0ff', dim: '#a0b8d8' },
    email: {
      bg: '#0a0f1e',
      header: 'linear-gradient(135deg,#0f1729,#162040)',
      accent: '#8ab4f8',
      text: '#e8f0ff',
      dim: '#a0b8d8',
      border: 'rgba(138,180,248,0.2)',
    },
  },
  {
    id: 'first-birthday',
    tier: 'premium',
    scenario: '🎂 For a child',
    name: 'First Birthday',
    desc: 'Sweet · Gentle · Parental love',
    placeholder:
      "My darling, today you turned one. You have no idea what's happening around you, but I want you to know...",
    card: { bg: '#fff0f7', accent: '#e8679a', text: '#2a0a18', dim: '#9a4070' },
    email: {
      bg: '#fff0f7',
      header: 'linear-gradient(135deg,#fff0f7,#fdd8ea)',
      accent: '#e8679a',
      text: '#2a0a18',
      dim: '#9a4070',
      border: 'rgba(232,103,154,0.2)',
    },
  },
  {
    id: 'graduation',
    tier: 'premium',
    scenario: '🎓 For a student',
    name: 'Graduation Day',
    desc: 'Proud · Encouraging · Achievement',
    placeholder:
      "You did it. Right now, on this day, I am so incredibly proud of everything you've worked for...",
    card: { bg: '#0f1a0f', accent: '#5cb85c', text: '#e8f5e8', dim: '#7dc97d' },
    email: {
      bg: '#0f1a0f',
      header: 'linear-gradient(135deg,#0f1a0f,#1a2e1a)',
      accent: '#5cb85c',
      text: '#e8f5e8',
      dim: '#7dc97d',
      border: 'rgba(92,184,92,0.2)',
    },
  },
  {
    id: 'wedding',
    tier: 'premium',
    scenario: '💍 For a partner',
    name: 'Wedding Vows',
    desc: 'Romantic · Intimate · Eternal',
    placeholder:
      "On our wedding day, here's everything I couldn't fit into my vows. The things I wanted to say but...",
    card: { bg: '#1a0f0a', accent: '#c8916a', text: '#f5ede8', dim: '#a07060' },
    email: {
      bg: '#1a0f0a',
      header: 'linear-gradient(135deg,#1a0f0a,#2e1a10)',
      accent: '#c8916a',
      text: '#f5ede8',
      dim: '#a07060',
      border: 'rgba(200,145,106,0.2)',
    },
  },
  {
    id: 'startup',
    tier: 'premium',
    scenario: '🚀 For a founder',
    name: 'Day One',
    desc: 'Ambitious · Raw · Entrepreneurial',
    placeholder:
      "Today I'm starting something that might fail. But here's why I'm doing it anyway, and what I believe...",
    card: { bg: '#080c18', accent: '#7c6ef5', text: '#e8e8ff', dim: '#9090cc' },
    email: {
      bg: '#080c18',
      header: 'linear-gradient(135deg,#0c1028,#141830)',
      accent: '#7c6ef5',
      text: '#e8e8ff',
      dim: '#9090cc',
      border: 'rgba(124,110,245,0.2)',
    },
  },
  {
    id: 'grief',
    tier: 'premium',
    scenario: '🕊️ After a loss',
    name: 'In Loving Memory',
    desc: 'Tender · Healing · Comforting',
    placeholder:
      "I know this year has been hard. I'm writing this now because I want you to know, even from across time, that...",
    card: { bg: '#0f0f18', accent: '#a8b4e8', text: '#e8eaf5', dim: '#8898cc' },
    email: {
      bg: '#0f0f18',
      header: 'linear-gradient(135deg,#0f0f20,#18182e)',
      accent: '#a8b4e8',
      text: '#e8eaf5',
      dim: '#8898cc',
      border: 'rgba(168,180,232,0.2)',
    },
  },
  {
    id: 'retirement',
    tier: 'premium',
    scenario: '🌿 For retirement',
    name: 'Golden Years',
    desc: 'Reflective · Grateful · Wise',
    placeholder:
      "Today was my last day. Forty years of work, and now it's done. Here's everything I learned and never said...",
    card: { bg: '#1a1500', accent: '#e8c84c', text: '#f8f0d5', dim: '#c0a870' },
    email: {
      bg: '#1a1500',
      header: 'linear-gradient(135deg,#1a1500,#2a2000)',
      accent: '#e8c84c',
      text: '#f8f0d5',
      dim: '#c0a870',
      border: 'rgba(232,200,76,0.2)',
    },
  },
  {
    id: 'new-year',
    tier: 'premium',
    scenario: '🎊 New Year',
    name: 'Dear January',
    desc: 'Hopeful · Resolute · Fresh start',
    placeholder:
      "It's the start of a new year. Here's everything I want to remember about who I am right now...",
    card: { bg: '#05101e', accent: '#4ad4f5', text: '#e0f8ff', dim: '#80c8e0' },
    email: {
      bg: '#05101e',
      header: 'linear-gradient(135deg,#05101e,#0a1a2e)',
      accent: '#4ad4f5',
      text: '#e0f8ff',
      dim: '#80c8e0',
      border: 'rgba(74,212,245,0.2)',
    },
  },
  {
    id: 'apology',
    tier: 'premium',
    scenario: '🤝 To make peace',
    name: 'Unsent Words',
    desc: 'Vulnerable · Honest · Healing',
    placeholder:
      "There's something I've never said to you. By the time you read this, I hope enough time has passed to...",
    card: { bg: '#180a0a', accent: '#e87878', text: '#fff0f0', dim: '#c08080' },
    email: {
      bg: '#180a0a',
      header: 'linear-gradient(135deg,#180a0a,#280f0f)',
      accent: '#e87878',
      text: '#fff0f0',
      dim: '#c08080',
      border: 'rgba(232,120,120,0.2)',
    },
  },
  {
    id: 'milestone',
    tier: 'premium',
    scenario: '🏆 For a milestone',
    name: 'The Summit',
    desc: 'Triumphant · Proud · Celebratory',
    placeholder:
      "Right now I'm standing at the foot of something huge. By the time you read this, I will have...",
    card: { bg: '#0f0a00', accent: '#ffa040', text: '#fff5e0', dim: '#c08040' },
    email: {
      bg: '#0f0a00',
      header: 'linear-gradient(135deg,#0f0a00,#201500)',
      accent: '#ffa040',
      text: '#fff5e0',
      dim: '#c08040',
      border: 'rgba(255,160,64,0.2)',
    },
  },
  {
    id: 'friendship',
    tier: 'premium',
    scenario: '👫 For a best friend',
    name: 'Old Friends',
    desc: 'Warm · Nostalgic · Playful',
    placeholder:
      "Remember when we used to talk every single day? I'm writing this because I want you to know...",
    card: { bg: '#0a1808', accent: '#88d068', text: '#f0ffe8', dim: '#80b860' },
    email: {
      bg: '#0a1808',
      header: 'linear-gradient(135deg,#0a1808,#152510)',
      accent: '#88d068',
      text: '#f0ffe8',
      dim: '#80b860',
      border: 'rgba(136,208,104,0.2)',
    },
  },
  {
    id: 'diagnosis',
    tier: 'premium',
    scenario: '💙 Through illness',
    name: 'Brave Words',
    desc: 'Courageous · Raw · Deeply human',
    placeholder:
      "Today I got news that changed everything. I'm writing this now because I want someone I love to know...",
    card: { bg: '#08101e', accent: '#60a8e8', text: '#e0f0ff', dim: '#7090c0' },
    email: {
      bg: '#08101e',
      header: 'linear-gradient(135deg,#08101e,#101828)',
      accent: '#60a8e8',
      text: '#e0f0ff',
      dim: '#7090c0',
      border: 'rgba(96,168,232,0.2)',
    },
  },
  {
    id: 'parchment',
    tier: 'premium',
    scenario: '📜 Classic letter',
    name: 'Vintage Parchment',
    desc: 'Aged · Literary · Timeless',
    placeholder:
      'I write to you from a world you may barely remember. The clocks ticked differently then...',
    card: { bg: '#f5e8c8', accent: '#8b4513', text: '#2a1505', dim: '#7a5028' },
    email: {
      bg: '#f5e8c8',
      header: 'linear-gradient(135deg,#f5e8c8,#ead8a8)',
      accent: '#8b4513',
      text: '#2a1505',
      dim: '#7a5028',
      border: 'rgba(139,69,19,0.2)',
    },
  },
]

/**
 * IDs of templates available on the free tier.
 * Derived from TEMPLATES — no need to maintain separately.
 * @type {string[]}
 */
export const FREE_IDS = TEMPLATES.filter(t => t.tier === 'free').map(t => t.id)
