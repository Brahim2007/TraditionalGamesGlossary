'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Eye,
  Trash2,
  AlertCircle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { bulkImportGames, parseArabicText } from '@/lib/actions/import'

interface ParsedGame {
  index: number
  name: string
  country: string
  fields: number
  hasImage: boolean
  hasRules: boolean
  hasReferences: boolean
  raw: string
}

interface ImportResult {
  index: number
  name: string
  success: boolean
  gameId?: string
  error?: string
}

const sampleText = `اسم اللعبة\tلعبة الخومس
المسميات المحلية\tاللقّاف، قراقب، إيلا
الدولة\tالجزائر
مجال التراث\tألعاب الطفولة التقليدية
نوع اللعبة\tمهارة يدوية / لعبة تركيز
الفئة العمرية\t6 - 14 سنة
الممارسون\tالإناث بشكل أساسي
عدد اللاعبين\t1 - 4 لاعبين
الأدوات\t5 حصى صغيرة ملساء بحجم حبة الجوز
المكان\tعتبات البيوت، ساحات المدارس
الوقت\tأوقات الفراغ
الوصف الموسع\tلعبة تراثية عريقة تعتمد على خفة اليد والتوافق البصري الحركي الدقيق. تقوم فلسفتها على مبدأ التحكم في المتناثرات حيث يجب على اللاعبة رمي حجر واحد في الهواء والتقاط مجموعة حجارة أخرى من الأرض بسرعة خاطفة.
قواعد اللعب\tتتكون اللعبة من مراحل متدرجة تبدأ بمرحلة الآحاد.تنتقل إلى مرحلة الثنائي ثم الثلاثي ثم الرابع.تختتم بمرحلة الميزان أو الكف.يشترط السرعة الخاطفة في الالتقاط.يجب عدم إسقاط الحجر القيادي أثناء الطيران.
نظام الفوز والخسارة\tالفوز: إتمام جميع المراحل بنجاح. الخسارة: سقوط الحجر الطائر.
رابط الصورة\thttps://example.com/khoums.jpg
المراجع\tBelamri, R. (1986). L'oiseau du grenadier.
---
اسم اللعبة\tالوشرة
الدولة\tالجزائر
...`

export default function BulkImportPage() {
  const router = useRouter()
  const [inputText, setInputText] = useState('')
  const [parsedGames, setParsedGames] = useState<ParsedGame[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [step, setStep] = useState<'input' | 'preview' | 'results'>('input')

  // Parse the text to preview games
  const handleParse = async () => {
    if (!inputText.trim()) return
    setIsParsing(true)

    try {
      const sections = inputText.split(/\n\s*---\s*\n/).filter(s => s.trim().length > 0)
      const games: ParsedGame[] = []

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const result = await parseArabicText(section)

        if (result.success && result.data) {
          const d = result.data
          let fieldCount = 0
          Object.values(d).forEach(v => {
            if (v && (typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) && v.length > 0)) {
              fieldCount++
            }
          })

          games.push({
            index: i + 1,
            name: d.name || `لعبة ${i + 1}`,
            country: d.country || 'غير محدد',
            fields: fieldCount,
            hasImage: !!(d.imageUrl),
            hasRules: !!(d.rules && d.rules.length > 0),
            hasReferences: !!(d.references),
            raw: section,
          })
        } else {
          games.push({
            index: i + 1,
            name: `لعبة ${i + 1} (خطأ في التحليل)`,
            country: 'غير محدد',
            fields: 0,
            hasImage: false,
            hasRules: false,
            hasReferences: false,
            raw: section,
          })
        }
      }

      setParsedGames(games)
      setStep('preview')
    } catch {
      alert('حدث خطأ أثناء تحليل النص')
    } finally {
      setIsParsing(false)
    }
  }

  // Import all games
  const handleImport = async () => {
    setIsImporting(true)
    setImportResults([])

    try {
      const result = await bulkImportGames(inputText, '')
      setImportResults(result.results)
      setStep('results')
    } catch (error: any) {
      alert('حدث خطأ أثناء الاستيراد: ' + error.message)
    } finally {
      setIsImporting(false)
    }
  }

  const removeGame = (index: number) => {
    const sections = inputText.split(/\n\s*---\s*\n/).filter(s => s.trim().length > 0)
    sections.splice(index, 1)
    setInputText(sections.join('\n---\n'))
    setParsedGames(prev => prev.filter((_, i) => i !== index).map((g, i) => ({ ...g, index: i + 1 })))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deepest">استيراد جماعي للألعاب</h1>
          <p className="text-gray-600 mt-1">استيراد عدة ألعاب دفعة واحدة من نص منسق</p>
        </div>
        <Link href="/dashboard/games">
          <Button variant="outline">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للألعاب
          </Button>
        </Link>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4">
        {[
          { id: 'input', label: 'إدخال البيانات', icon: FileText },
          { id: 'preview', label: 'معاينة', icon: Eye },
          { id: 'results', label: 'النتائج', icon: CheckCircle },
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <div className="h-px w-12 bg-gray-300" />}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              step === s.id
                ? 'bg-brand text-white'
                : step === 'results' || (step === 'preview' && i === 0)
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              <s.icon className="h-4 w-4" />
              {s.label}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Input */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-brand" />
              أدخل بيانات الألعاب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-blue-800">صيغة الإدخال:</p>
                  <ul className="list-disc list-inside text-blue-700 mt-1 space-y-1">
                    <li>كل حقل في سطر منفصل بصيغة: <code className="bg-blue-100 px-1 rounded">اسم الحقل[Tab]القيمة</code></li>
                    <li>افصل بين كل لعبة وأخرى بسطر يحتوي <code className="bg-blue-100 px-1 rounded">---</code></li>
                    <li>الحقول المطلوبة: اسم اللعبة، الدولة، الوصف الموسع، قواعد اللعب</li>
                    <li>لإضافة صورة: استخدم حقل <code className="bg-blue-100 px-1 rounded">رابط الصورة</code></li>
                  </ul>
                </div>
              </div>
            </div>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="الصق بيانات الألعاب هنا..."
              className="min-h-[400px] font-mono text-sm leading-relaxed"
              dir="rtl"
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {inputText.trim() ? (
                  <>
                    {inputText.split(/\n\s*---\s*\n/).filter(s => s.trim().length > 0).length} لعبة محتملة
                  </>
                ) : (
                  'لم يتم إدخال بيانات بعد'
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setInputText(sampleText)}
                  disabled={isParsing}
                >
                  عرض مثال
                </Button>
                <Button
                  onClick={handleParse}
                  disabled={!inputText.trim() || isParsing}
                >
                  {isParsing ? (
                    <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري التحليل...</>
                  ) : (
                    <><Eye className="h-4 w-4 ml-2" /> تحليل ومعاينة</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-brand" />
                معاينة الألعاب ({parsedGames.length} لعبة)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedGames.map((game, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-brand/10 rounded-full text-brand font-bold text-sm">
                        {game.index}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-deepest">{game.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span>🌍 {game.country}</span>
                          <span>📋 {game.fields} حقل</span>
                          {game.hasImage && <span>🖼️ صورة</span>}
                          {game.hasRules && <span>📜 قواعد</span>}
                          {game.hasReferences && <span>📚 مراجع</span>}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGame(i)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {parsedGames.some(g => g.fields === 0) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-700">
                    بعض الألعاب لم يتم تحليلها بشكل صحيح. تحقق من صيغة الإدخال.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep('input')}>
              <ArrowRight className="h-4 w-4 ml-2" />
              تعديل البيانات
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || parsedGames.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isImporting ? (
                <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري الاستيراد...</>
              ) : (
                <><Upload className="h-4 w-4 ml-2" /> استيراد {parsedGames.length} لعبة</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-2 border-gray-200">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-brand-deepest">{importResults.length}</div>
                <div className="text-sm text-gray-500 mt-1">إجمالي</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">{importResults.filter(r => r.success).length}</div>
                <div className="text-sm text-green-600 mt-1">ناجح</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">{importResults.filter(r => !r.success).length}</div>
                <div className="text-sm text-red-600 mt-1">فاشل</div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تفاصيل الاستيراد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {importResults.map((result, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <span className="font-medium">{result.name}</span>
                        {result.error && (
                          <p className="text-sm text-red-600 mt-0.5">{result.error}</p>
                        )}
                      </div>
                    </div>
                    {result.success && result.gameId && (
                      <Link href={`/games/${result.gameId}`}>
                        <Button variant="ghost" size="sm">عرض</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => {
              setStep('input')
              setInputText('')
              setParsedGames([])
              setImportResults([])
            }}>
              استيراد ألعاب أخرى
            </Button>
            <Link href="/dashboard/games">
              <Button>
                <ArrowRight className="h-4 w-4 ml-2" />
                الذهاب لقائمة الألعاب
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
