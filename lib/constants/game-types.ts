// Game Classification Types
// Based on reference JSX files and UNESCO heritage classifications

export const GAME_TYPES = [
  { id: 'movement', label: 'ألعاب حركية', icon: 'Activity' },
  { id: 'mental', label: 'ألعاب ذهنية', icon: 'Brain' },
  { id: 'funny', label: 'ألعاب طريفة', icon: 'Smile' },
  { id: 'maritime', label: 'ألعاب بحرية', icon: 'Anchor' },
  { id: 'popular', label: 'ألعاب شعبية', icon: 'Users' },
] as const

export const HERITAGE_FIELDS = [
  {
    id: 'social-practices',
    name: 'الألعاب الشعبية - الممارسات الاجتماعية والطقوس',
    category: 'الممارسات الاجتماعية والطقوس والمناسبات الاحتفالية',
  },
  {
    id: 'mental-games',
    name: 'الألعاب الذهنية',
    category: 'المعارف والممارسات المتعلقة بالطبيعة والكون',
  },
  {
    id: 'movement-games',
    name: 'الألعاب الحركية',
    category: 'الفنون الأدائية',
  },
  {
    id: 'girls-games',
    name: 'ألعاب البنات',
    category: 'الممارسات الاجتماعية والطقوس',
  },
  {
    id: 'maritime-games',
    name: 'الألعاب البحرية',
    category: 'المعارف والممارسات المتعلقة بالطبيعة والكون',
  },
  {
    id: 'funny-games',
    name: 'الألعاب الطريفة/الفكاهية',
    category: 'الفنون الأدائية',
  },
] as const

export const AGE_GROUPS = [
  '3 - 6 سنوات (الطفولة المبكرة)',
  '6 - 9 سنوات (الطفولة المتوسطة)',
  '9 - 12 سنة (الطفولة المتأخرة)',
  '12 - 18 سنة (المراهقة)',
  'الشباب والبالغين',
  'جميع الأعمار',
] as const

export const PRACTITIONER_TYPES = [
  'ذكور',
  'إناث',
  'مختلط (ذكور وإناث)',
] as const

export const PLAYER_COUNTS = [
  'فردية',
  'لاعبان اثنان',
  '2 - 4 لاعبين',
  '3 - 6 لاعبين',
  '4 - 8 لاعبين',
  '6 - 10 لاعبين',
  '10+ لاعبين (جماعية كبيرة)',
] as const

export const CATEGORY_ICONS = {
  'ألعاب حركية': 'Activity',
  'ألعاب ذهنية': 'Brain',
  'تراث خليجي': 'Award',
  'ألعاب بحرية': 'Anchor',
  'تراث عراقي': 'ScrollText',
  'ألعاب طريفة': 'Smile',
  'الكل': 'LayoutGrid',
  'ألعاب شعبية': 'Users',
} as const

export const TAGS = [
  { id: 'khaleeji', name: 'تراث خليجي', category: 'جغرافي' },
  { id: 'iraqi', name: 'تراث عراقي', category: 'جغرافي' },
  { id: 'shami', name: 'تراث شامي', category: 'جغرافي' },
  { id: 'maghrebi', name: 'تراث مغاربي', category: 'جغرافي' },
  { id: 'movement', name: 'ألعاب حركية', category: 'نوعي' },
  { id: 'mental', name: 'ألعاب ذهنية', category: 'نوعي' },
  { id: 'funny', name: 'ألعاب طريفة', category: 'نوعي' },
  { id: 'maritime', name: 'ألعاب بحرية', category: 'نوعي' },
  { id: 'popular', name: 'ألعاب شعبية', category: 'تراثي' },
  { id: 'children', name: 'ألعاب الأطفال', category: 'ديموغرافي' },
  { id: 'males', name: 'ألعاب الذكور', category: 'ديموغرافي' },
  { id: 'females', name: 'ألعاب الإناث', category: 'ديموغرافي' },
  { id: 'mixed', name: 'ألعاب مختلطة', category: 'ديموغرافي' },
  { id: 'group', name: 'ألعاب جماعية', category: 'نوعي' },
  { id: 'pair', name: 'ألعاب ثنائية', category: 'نوعي' },
] as const
