// Arabic Text Processing Utilities
// أدوات معالجة النص العربي

/**
 * Normalize Arabic text for comparison
 * تطبيع النص العربي للمقارنة
 */
export function normalizeArabic(text: string): string {
  if (!text) return ''

  return (
    text
      // Normalize hamza variants
      // توحيد أشكال الهمزة
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ؤ]/g, 'و')
      .replace(/[ئ]/g, 'ي')
      // Remove diacritics (tashkeel)
      // إزالة التشكيل
      .replace(/[\u064B-\u0652\u0670]/g, '')
      // Normalize taa marbuta to haa
      // توحيد التاء المربوطة
      .replace(/ة/g, 'ه')
      // Normalize alef maksura to yaa
      // توحيد الألف المقصورة
      .replace(/ى/g, 'ي')
      // Remove tatweel (kashida)
      // إزالة التطويل
      .replace(/ـ/g, '')
      // Normalize multiple spaces
      // توحيد المسافات
      .replace(/\s+/g, ' ')
      .trim()
  )
}

/**
 * Enhanced Arabic stemmer (rule-based with morphological patterns)
 * مجذّع عربي محسّن (قائم على القواعد والأنماط الصرفية)
 * تم تحديثه لتحسين الدقة في معالجة الكلمات العربية
 */
export function stemArabic(word: string): string {
  if (!word || word.length < 3) return word

  const normalized = normalizeArabic(word)
  let stemmed = normalized

  // Remove definite article "ال" and its variants
  // إزالة أداة التعريف "ال" ومتغيراتها
  const definitePrefixes = ['وال', 'بال', 'كال', 'فال', 'لل', 'ال']
  for (const prefix of definitePrefixes) {
    if (stemmed.startsWith(prefix) && stemmed.length > prefix.length + 2) {
      stemmed = stemmed.slice(prefix.length)
      break
    }
  }

  // Remove common prefixes (prepositions and conjunctions)
  // إزالة البادئات الشائعة (حروف الجر والعطف)
  const commonPrefixes = ['و', 'ب', 'ك', 'ف', 'ل', 'ت', 'س', 'ي', 'ن', 'أ']
  for (const prefix of commonPrefixes) {
    if (stemmed.startsWith(prefix) && stemmed.length > prefix.length + 2) {
      // Check if it's actually a prefix and not part of the root
      const remaining = stemmed.slice(prefix.length)
      if (remaining.length >= 2 && !isStopWord(remaining)) {
        stemmed = remaining
        break
      }
    }
  }

  // Remove plural and feminine suffixes
  // إزالة لواحق الجمع والتأنيث
  const pluralSuffixes = [
    'ات', 'ون', 'ين', 'ان', 'تين', 'ية', 'يه', 'هة', 'ة', 
    'وا', 'يا', 'ى', 'اء', 'اوات', 'اوين', 'اوة'
  ]
  
  for (const suffix of pluralSuffixes) {
    if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
      const withoutSuffix = stemmed.slice(0, -suffix.length)
      // Check if removing the suffix leaves a valid root
      if (withoutSuffix.length >= 2 && !isStopWord(withoutSuffix)) {
        stemmed = withoutSuffix
        break
      }
    }
  }

  // Remove possessive pronouns
  // إزالة ضمائر الملكية
  const possessiveSuffixes = ['ها', 'هم', 'هن', 'نا', 'كم', 'كن', 'ه', 'ك', 'ي']
  for (const suffix of possessiveSuffixes) {
    if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
      const withoutSuffix = stemmed.slice(0, -suffix.length)
      if (withoutSuffix.length >= 2) {
        stemmed = withoutSuffix
        break
      }
    }
  }

  // Handle broken plurals (أوزان الجمع المكسور)
  // Enhanced broken plural patterns
  const brokenPluralPatterns = [
    { pattern: /^أفعال$/, root: 'فعل' },
    { pattern: /^فعال$/, root: 'فعل' },
    { pattern: /^فعول$/, root: 'فعل' },
    { pattern: /^فعائل$/, root: 'فعل' },
    { pattern: /^فعائل$/, root: 'فعل' },
    { pattern: /^مفاعل$/, root: 'فعل' },
    { pattern: /^مفاعيل$/, root: 'فعل' },
    { pattern: /^أفاعيل$/, root: 'فعل' },
    { pattern: /^فواعل$/, root: 'فعل' },
    { pattern: /^فعالى$/, root: 'فعل' },
  ]

  for (const { pattern, root } of brokenPluralPatterns) {
    if (pattern.test(stemmed) && stemmed.length === root.length + 2) {
      return root
    }
  }

  // Extract triliteral root (جذر ثلاثي) if possible
  if (stemmed.length >= 3) {
    // Try to extract a 3-letter root
    const possibleRoot = extractTriliteralRoot(stemmed)
    if (possibleRoot && possibleRoot.length === 3) {
      return possibleRoot
    }
  }

  return stemmed
}

/**
 * Extract triliteral root from Arabic word
 * استخراج الجذر الثلاثي من الكلمة العربية - تم تحسينه
 */
function extractTriliteralRoot(word: string): string | null {
  if (word.length < 3) return null
  
  // Remove common patterns to find root
  let cleaned = word.replace(/[أإآؤئ]/g, '')
  
  // Remove common verb patterns
  const verbPatterns = [
    /^ي/,    // المضارع
    /^ت/,    // المضارع المؤنث أو الأمر
    /^ن/,    // المضارع الجمع
    /^أ/,    // الأمر أو الماضي
    /^م/,    // اسم الفاعل أو اسم المكان
    /^م/,    // اسم الآلة
  ]
  
  for (const pattern of verbPatterns) {
    if (cleaned.length > 3 && pattern.test(cleaned)) {
      cleaned = cleaned.slice(1)
      break
    }
  }
  
  if (cleaned.length >= 3) {
    // Try to extract the most likely root pattern
    // For Arabic trilateral roots, we look for consonants
    const consonants = cleaned.replace(/[اوي]/g, '')
    
    if (consonants.length >= 3) {
      return consonants.slice(0, 3)
    }
    
    // Fallback to first 3 letters
    return cleaned.slice(0, 3)
  }
  
  return null
}

/**
 * Check if word is a stop word
 * التحقق إذا كانت الكلمة كلمة توقف
 */
function isStopWord(word: string): boolean {
  const arabicStopWords = [
    'في', 'من', 'على', 'إلى', 'عن', 'مع', 'ب', 'ك', 'ل', 'و', 'ف', 'س', 'أ', 'أن',
    'إن', 'كان', 'يكون', 'ليس', 'ما', 'هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء', 'الذين',
    'التي', 'الذي', 'كل', 'بعض', 'أي', 'لا', 'نعم', 'إذا', 'لكن', 'أو', 'إما', 'إذن'
  ]
  
  return arabicStopWords.includes(word)
}

/**
 * Calculate Levenshtein distance between two strings
 * حساب مسافة ليفنشتاين بين نصين
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length

  if (m === 0) return n
  if (n === 0) return m

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return dp[m][n]
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * حساب نسبة التشابه بين نصين
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeArabic(str1)
  const s2 = normalizeArabic(str2)

  if (s1 === s2) return 1
  if (!s1 || !s2) return 0

  const distance = levenshteinDistance(s1, s2)
  const maxLength = Math.max(s1.length, s2.length)

  return 1 - distance / maxLength
}

/**
 * Fuzzy match two strings with threshold
 * مطابقة ضبابية لنصين مع حد أدنى
 */
export function fuzzyMatch(str1: string, str2: string, threshold: number = 0.8): boolean {
  return stringSimilarity(str1, str2) >= threshold
}

/**
 * Jaccard similarity for sets
 * تشابه جاكارد للمجموعات
 */
export function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 1
  if (set1.size === 0 || set2.size === 0) return 0

  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return intersection.size / union.size
}

/**
 * Calculate Jaccard similarity for string arrays
 * حساب تشابه جاكارد لمصفوفات النصوص
 */
export function arrayJaccardSimilarity(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1.map(normalizeArabic))
  const set2 = new Set(arr2.map(normalizeArabic))
  return jaccardSimilarity(set1, set2)
}

/**
 * Tokenize Arabic text into words with stemming
 * تجزئة النص العربي إلى كلمات مع التجذير
 */
export function tokenizeArabic(text: string, stem: boolean = true): string[] {
  if (!text) return []
  
  const normalized = normalizeArabic(text)
  
  // Split by common Arabic delimiters
  const tokens = normalized.split(/[\s\-\.،؛:!؟,،;:()\[\]{}"'«»]/)
    .map(token => token.trim())
    .filter(token => token.length > 1 && !isStopWord(token))
  
  if (stem) {
    return tokens.map(stemArabic).filter(stem => stem.length > 1)
  }
  
  return tokens
}

/**
 * Calculate term frequency (TF) for Arabic text
 * حساب تكرار المصطلحات للنص العربي
 */
export function calculateTermFrequency(text: string): Map<string, number> {
  const tokens = tokenizeArabic(text, true)
  const tf = new Map<string, number>()
  
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1)
  }
  
  return tf
}

/**
 * Calculate cosine similarity between two Arabic texts
 * حساب تشابه جيب التمام بين نصين عربيين
 */
export function cosineSimilarity(text1: string, text2: string): number {
  const tf1 = calculateTermFrequency(text1)
  const tf2 = calculateTermFrequency(text2)
  
  if (tf1.size === 0 || tf2.size === 0) return 0
  
  // Get all unique terms
  const allTerms = new Set([...tf1.keys(), ...tf2.keys()])
  
  // Calculate dot product
  let dotProduct = 0
  for (const term of allTerms) {
    dotProduct += (tf1.get(term) || 0) * (tf2.get(term) || 0)
  }
  
  // Calculate magnitudes
  let magnitude1 = 0
  for (const freq of tf1.values()) {
    magnitude1 += freq * freq
  }
  magnitude1 = Math.sqrt(magnitude1)
  
  let magnitude2 = 0
  for (const freq of tf2.values()) {
    magnitude2 += freq * freq
  }
  magnitude2 = Math.sqrt(magnitude2)
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0
  
  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Extract key phrases from Arabic text
 * استخراج العبارات المفتاحية من النص العربي
 */
export function extractKeyPhrases(text: string, maxPhrases: number = 5): string[] {
  if (!text) return []
  
  const sentences = text.split(/[.!؟؟;؛]/).filter(s => s.trim().length > 10)
  const phrases: Map<string, number> = new Map()
  
  for (const sentence of sentences) {
    const tokens = tokenizeArabic(sentence, false)
    
    // Extract 2-3 word phrases
    for (let i = 0; i < tokens.length - 1; i++) {
      const phrase2 = `${tokens[i]} ${tokens[i + 1]}`
      phrases.set(phrase2, (phrases.get(phrase2) || 0) + 1)
      
      if (i < tokens.length - 2) {
        const phrase3 = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`
        phrases.set(phrase3, (phrases.get(phrase3) || 0) + 1)
      }
    }
  }
  
  // Sort by frequency and return top phrases
  return Array.from(phrases.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxPhrases)
    .map(([phrase]) => phrase)
}

/**
 * Calculate semantic similarity between two Arabic texts using multiple methods
 * حساب التشابه الدلالي بين نصين عربيين باستخدام طرق متعددة
 */
export function semanticSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0
  
  // Use multiple similarity measures
  const cosineSim = cosineSimilarity(text1, text2)
  const jaccardSim = arrayJaccardSimilarity(
    tokenizeArabic(text1, true),
    tokenizeArabic(text2, true)
  )
  const stringSim = stringSimilarity(text1, text2)
  
  // Weighted average (cosine gets more weight as it's more accurate)
  return (cosineSim * 0.5 + jaccardSim * 0.3 + stringSim * 0.2)
}

/**
 * Find similar Arabic texts from a collection
 * إيجاد النصوص العربية المتشابهة من مجموعة
 */
export function findSimilarTexts(
  query: string,
  texts: Array<{ id: string; text: string }>,
  threshold: number = 0.6,
  limit: number = 10
): Array<{ id: string; similarity: number }> {
  const results: Array<{ id: string; similarity: number }> = []
  
  for (const item of texts) {
    const similarity = semanticSimilarity(query, item.text)
    if (similarity >= threshold) {
      results.push({ id: item.id, similarity })
    }
  }
  
  // Sort by similarity (descending)
  results.sort((a, b) => b.similarity - a.similarity)
  
  return results.slice(0, limit)
}
