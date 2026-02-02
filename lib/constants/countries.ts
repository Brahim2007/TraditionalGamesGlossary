// Arab Countries Data
// Used for country selection and normalization

export interface Country {
  id: string
  name: string
  isoCode: string
  region: string
}

export const ARAB_COUNTRIES: Country[] = [
  { id: 'qa', name: 'دولة قطر', isoCode: 'QA', region: 'الخليج' },
  { id: 'ae', name: 'الإمارات العربية المتحدة', isoCode: 'AE', region: 'الخليج' },
  { id: 'sa', name: 'المملكة العربية السعودية', isoCode: 'SA', region: 'الخليج' },
  { id: 'kw', name: 'دولة الكويت', isoCode: 'KW', region: 'الخليج' },
  { id: 'bh', name: 'مملكة البحرين', isoCode: 'BH', region: 'الخليج' },
  { id: 'om', name: 'سلطنة عمان', isoCode: 'OM', region: 'الخليج' },
  { id: 'ye', name: 'الجمهورية اليمنية', isoCode: 'YE', region: 'الخليج' },
  { id: 'iq', name: 'جمهورية العراق', isoCode: 'IQ', region: 'بلاد الشام' },
  { id: 'sy', name: 'الجمهورية العربية السورية', isoCode: 'SY', region: 'بلاد الشام' },
  { id: 'jo', name: 'المملكة الأردنية الهاشمية', isoCode: 'JO', region: 'بلاد الشام' },
  { id: 'lb', name: 'الجمهورية اللبنانية', isoCode: 'LB', region: 'بلاد الشام' },
  { id: 'ps', name: 'دولة فلسطين', isoCode: 'PS', region: 'بلاد الشام' },
  { id: 'eg', name: 'جمهورية مصر العربية', isoCode: 'EG', region: 'وادي النيل' },
  { id: 'sd', name: 'جمهورية السودان', isoCode: 'SD', region: 'وادي النيل' },
  { id: 'dz', name: 'الجمهورية الجزائرية', isoCode: 'DZ', region: 'المغرب العربي' },
  { id: 'ma', name: 'المملكة المغربية', isoCode: 'MA', region: 'المغرب العربي' },
  { id: 'tn', name: 'الجمهورية التونسية', isoCode: 'TN', region: 'المغرب العربي' },
  { id: 'ly', name: 'دولة ليبيا', isoCode: 'LY', region: 'المغرب العربي' },
  { id: 'mr', name: 'الجمهورية الإسلامية الموريتانية', isoCode: 'MR', region: 'المغرب العربي' },
  { id: 'so', name: 'جمهورية الصومال', isoCode: 'SO', region: 'القرن الأفريقي' },
  { id: 'dj', name: 'جمهورية جيبوتي', isoCode: 'DJ', region: 'القرن الأفريقي' },
  { id: 'km', name: 'جزر القمر', isoCode: 'KM', region: 'المحيط الهندي' },
]

export const ARAB_REGIONS = [
  'الخليج',
  'بلاد الشام',
  'وادي النيل',
  'المغرب العربي',
  'القرن الأفريقي',
  'المحيط الهندي',
] as const

export type ArabRegion = (typeof ARAB_REGIONS)[number]
