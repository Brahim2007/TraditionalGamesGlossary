import React, { useState } from 'react';
import { Search, MapPin, Users, BookOpen, X, Award, Heart, ArrowLeft, Globe, LayoutGrid, Image as ImageIcon, Book, UserCheck, Smile, FileText, Megaphone, Landmark, Info, HandMetal, Target, Wrench, Sunset, SlidersHorizontal, Check, Activity, Brain, Anchor, ScrollText, Trophy, Menu, Tag, Twitter, Facebook, Instagram, Linkedin, Shuffle, Sparkles, ChevronRight, ArrowRight, Camera, ZoomIn } from 'lucide-react';

// --- BookWo / Green System Design Tokens ---
// Primary Brand: #061D14 (Deepest Green), #134232 (Deep Green), #245542 (Green)
// Accent: #AB9F80 (Gold/Tan), #C9B892 (Light Gold)
// Neutral: #F6F6F6 (Bg), #FFFFFF (Surface)

// --- أيقونات التصنيفات ---
const CATEGORY_ICONS = {
  "ألعاب حركية": Activity,
  "ألعاب ذهنية": Brain,
  "تراث خليجي": Award,
  "ألعاب بحرية": Anchor,
  "تراث عراقي": ScrollText,
  "ألعاب طريفة": Smile,
  "الكل": LayoutGrid,
  "ألعاب شعبية": Users
};

// --- نموذج البيانات (Data Model) ---
const gamesData = [
  {
    id: 6,
    name: "الركض بالحاجبين المرفوعين",
    localNames: ["سباق المبهّتين", "لعبة العيون الكبار"],
    country: "دولة قطر",
    geoCoordinates: { x: 115, y: 90 }, 
    region: "الفرجان القديمة (الدوحة، الوكرة، الخور)",
    heritageField: "الألعاب الشعبية - الممارسات الاجتماعية والطقوس",
    
    ageGroup: "9 - 12 سنة (الطفولة المتوسطة)",
    practitioners: "مختلط (ذكور وإناث)",
    players: "3 - 10 لاعبين (جماعية)",
    type: "فكاهة / حركية",
    
    ageGroupDescription: "في هذا العمر، يمتلك الأطفال القدرة على التحكم المستقل في عضلات الوجه.",
    practitionersDescription: "لعبة تعتمد على الطرافة والسرعة، مقبولة من الجنسين.",
    playersDescription: "يمكن أن تبدأ من 3 أطفال وتصل إلى 10 أو أكثر.",

    tools: ["لا يوجد (الجسد فقط)"],
    environment: "السكيك (الأزقة) أو الحوي (فناء المنزل)",
    timing: "النهار (العصر)",
    
    description: "لعبة 'الركض بالحاجبين المرفوعين' هي تمرين في 'فصل الحواس'. الطبيعة البشرية تميل إلى تقطيب الجبين عند الركض السريع، وهذه اللعبة تكسر هذه الفطرة بطلب الركض مع رفع الحاجبين.\n\nيخلق هذا التناقض مشهداً كوميدياً: أجساد تركض بجدية وتنافس، ووجوه جامدة تبدو وكأنها مصدومة. التحدي الحقيقي ليس في سرعة القدمين، بل في مقاومة الرغبة في 'الرمش' أو 'التقطيب' أو الضحك، لأن الضحك يؤدي تلقائياً لاسترخاء عضلات الوجه وسقوط الحاجبين.",
    rules: [
      "خط البداية: يصطف المتسابقون عند خط الانطلاق.",
      "وضع الاستعداد: رفع الحواجب لأقصى حد.",
      "الانطلاق: الركض بسرعة دون إنزال الحاجبين.",
      "الشرط الجزائي: من يخفض حاجبيه يُستبعد.",
      "الفوز: من يقطع خط النهاية أولاً بحواجب مرفوعة."
    ],
    winLossSystem: "الفوز: يعتمد على السرعة والتحكم العضلي.\nالخسارة: بسبب الضحك.",
    startEnd: "البدء: بالقرعة.\nالانتهاء: بوصول أول متسابق.",
    
    oralTradition: "صيحات: 'نزلت! نزلت!'، 'ارفع عينك!'",
    socialContext: "1. ضبط النفس.\n2. الذكاء العاطفي.\n3. الترفيه الجماعي.",
    
    media: { 
      type: "image", 
      url: "https://d12eu00glpdtk2.cloudfront.net/public/images/local/photo5915934180699648891.jpg",
      caption: "صورة توضيحية للعبة" 
    },
    referencesList: ["سلسلة الألعاب الشعبية القطرية - كتارا."],
    references: "سلسلة الألعاب الشعبية القطرية.",
    tags: ["تراث خليجي", "ألعاب طريفة", "ألعاب حركية"] 
  },
  {
    id: 5,
    name: "الهالوسة (المنقلة)",
    localNames: ["الأيلة", "الحويلس", "أم السبع"],
    country: "دولة قطر",
    geoCoordinates: { x: 110, y: 100 }, 
    region: "الجزيرة العربية والشام وأفريقيا",
    heritageField: "الألعاب الذهنية",
    
    ageGroup: "الأطفال والبالغين",
    players: "2 لاعبين",
    practitioners: "الذكور (غالباً)",
    type: "ذهنية / استراتيجية",

    tools: ["حفر في الرمل (كون)", "حصى (صبان)"],
    environment: "رمال الشاطئ والمجالس",
    timing: "نهاراً أو ليلاً",
    
    description: "لعبة حسابية استراتيجية عريقة تعتمد على نقل الحصى أو الصبان بين الحفر بنظام دقيق. ارتبطت قديماً بحياة الغواصين لقتل الوقت.",
    rules: ["توزيع الحصى بالتساوي.", "نقل الحصى عكس عقارب الساعة.", "نظام التتابع والأكل."],
    
    media: { 
      type: "image", 
      url: "https://images.unsplash.com/photo-1611195955636-f3830fbac00c?auto=format&fit=crop&q=80&w=800",
      caption: "صورة توضيحية للعبة" 
    },
    references: "الألعاب الشعبية في قطر.",
    tags: ["تراث خليجي", "ألعاب ذهنية", "ألعاب بحرية"] 
  },
  {
    id: 1,
    name: "التيلة",
    localNames: ["الكرات الزجاجية", "المصاقيل", "البرجون"],
    country: "الإمارات العربية المتحدة",
    geoCoordinates: { x: 120, y: 90 }, 
    region: "الخليج والعراق ومعظم الدول العربية",
    heritageField: "الألعاب الحركية",
    
    ageGroup: "7 - 15 سنة (ذكور)",
    players: "2 - 6 لاعبين",
    practitioners: "الذكور",
    type: "حركية / دقة",

    tools: ["كرات زجاجية (تيل)", "حفر (كون)"],
    environment: "الساحات الرملية",
    timing: "النهار",
    
    description: "لعبة تعتمد على دقة التصويب بكرات زجاجية ملونة لإدخالها في حفر مخصصة أو ضرب تيلة الخصم.",
    rules: ["تجهيز الحفر.", "رمي التيلة.", "صيد تيلة الخصم."],
    
    media: { 
      type: "image", 
      url: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=800",
      caption: "صورة توضيحية للعبة" 
    },
    references: "كتاب الألعاب الشعبية في الإمارات.",
    tags: ["تراث خليجي", "ألعاب حركية"] 
  },
  {
    id: 2,
    name: "الحالوسة (الشامية)",
    localNames: ["المنقلة", "أعطي"],
    country: "العراق",
    geoCoordinates: { x: 100, y: 100 }, 
    region: "بلاد الشام والعراق",
    heritageField: "الألعاب الذهنية",
    
    ageGroup: "12 سنة فما فوق",
    players: "لاعبان اثنان",
    type: "ذهنية / استراتيجية",

    tools: ["لوح خشبي", "حصى/بذور"],
    environment: "المجالس والمقاهي",
    timing: "ليلاً",
    
    description: "لعبة استراتيجية حسابية عريقة تتكون من صفين من الحفر.",
    rules: ["توزيع الحصى.", "نقل الحصى.", "تجميع أكبر عدد."],
    
    media: { 
      type: "image", 
      url: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=800",
      caption: "صورة توضيحية للعبة" 
    },
    references: "التراث الشعبي في بلاد الشام.",
    tags: ["تراث عراقي", "ألعاب ذهنية"] 
  },
  {
    id: 3,
    name: "التوّاقيل",
    localNames: ["الدعابل", "الطمّـة"],
    country: "العراق",
    geoCoordinates: { x: 120, y: 100 }, 
    region: "بغداد والمحافظات الجنوبية",
    heritageField: "الألعاب الشعبية",
    
    ageGroup: "8 - 14 سنة (ذكور)",
    players: "فرق (4-8)",
    type: "شعبية / حركية",

    tools: ["عصا صغيرة", "قطعة خشبية (تاق)"],
    environment: "الساحات المفتوحة",
    timing: "الربيع والصيف",
    
    description: "لعبة تشبه البيسبول تعتمد على ضرب قطعة خشبية صغيرة بالعصا لإيصالها لأبعد مسافة.",
    rules: ["وضع التاق.", "الضرب بالعصا.", "احتساب المسافة."],
    
    media: { 
      type: "image", 
      url: "https://images.unsplash.com/photo-1533240763637-2350e932b704?auto=format&fit=crop&q=80&w=800",
      caption: "صورة توضيحية للعبة" 
    },
    references: "موسوعة الفلكلور العراقي.",
    tags: ["تراث عراقي", "ألعاب حركية"] 
  },
  {
    id: 4,
    name: "الشَّبْحَة",
    localNames: ["بنجو", "نط الحبل"],
    country: "الكويت",
    geoCoordinates: { x: 100, y: 90 }, 
    region: "منطقة الخليج العربي",
    heritageField: "ألعاب البنات",
    
    ageGroup: "6 - 12 سنة (إناث)",
    players: "3 لاعبات",
    type: "حركية / لياقة",

    tools: ["حبل مطاطي"],
    environment: "فناء المنزل/المدرسة",
    timing: "العصر",
    
    description: "لعبة حركية إيقاعية للبنات تعتمد على القفز داخل وخارج حبل مطاطي.",
    rules: ["تثبيت الحبل.", "القفز المتسلسل.", "زيادة الارتفاع."],
    
    media: { 
      type: "image", 
      url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
      caption: "صورة توضيحية للعبة" 
    },
    references: "الألعاب الشعبية الكويتية.",
    tags: ["تراث خليجي", "ألعاب حركية"] 
  }
];

// --- مكون خريطة الفيكتور ---
const VectorRegionMap = ({ x, y, label }) => {
  const getMapPath = (name) => {
    if (name.includes("قطر")) return "M100,190 C95,170 90,150 85,130 C80,110 85,90 95,80 C100,75 110,75 115,80 C125,90 130,110 125,130 C120,150 115,170 115,190 L100,190 Z"; 
    if (name.includes("الإمارات")) return "M40,120 L60,115 L80,110 L120,100 C140,90 160,80 170,90 L160,120 L140,140 L100,145 L60,140 Z";
    if (name.includes("العراق")) return "M80,160 L60,120 L50,80 L70,50 L110,40 L140,60 L130,110 L100,160 Z";
    if (name.includes("الكويت")) return "M90,110 L100,95 L115,95 L125,105 L115,120 L100,120 Z";
    return "M60 20 L60 40 L40 50 L30 80 L20 90 L20 120 L40 140 L60 160 L120 170 L160 160 L180 140 L170 110 L150 90 L140 60 L120 40 L100 30 Z";
  };
  const pathD = getMapPath(label);
  return (
    <div className="w-full h-full bg-[#fcfcfc] relative overflow-hidden group border border-gray-100 rounded-xl">
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#2d4a3e_1px,transparent_1px)] [background-size:12px_12px]"></div>
      <svg viewBox="0 0 200 200" className="w-full h-full text-gray-300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#2d4a3e" floodOpacity="0.1" />
          </filter>
        </defs>
        <path d={pathD} className="fill-white stroke-[#4a7b6f] stroke-[1.5] transition-all duration-500 hover:fill-[#f8f6f3]" style={{ filter: "url(#shadow)" }} />
        <g className="animate-in fade-in zoom-in duration-500">
           <circle cx={x} cy={y} r="12" className="fill-[#d4a574]/20 animate-ping" />
           <circle cx={x} cy={y} r="5" className="fill-[#d4a574] stroke-white stroke-2" />
           <circle cx={x} cy={y} r="2" className="fill-amber-600" />
        </g>
      </svg>
    </div>
  );
};

export default function TraditionalGamesGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); 
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [filterCountry, setFilterCountry] = useState("الكل");
  const [filterType, setFilterType] = useState("الكل");

  const categories = [
    { id: "الكل", label: "الكل", icon: LayoutGrid },
    { id: "ألعاب حركية", label: "ألعاب حركية", icon: Activity },
    { id: "ألعاب ذهنية", label: "ألعاب ذهنية", icon: Brain },
    { id: "تراث خليجي", label: "تراث خليجي", icon: Award },
    { id: "ألعاب بحرية", label: "ألعاب بحرية", icon: Anchor },
    { id: "تراث عراقي", label: "تراث عراقي", icon: ScrollText },
    { id: "ألعاب طريفة", label: "ألعاب طريفة", icon: Smile },
  ];

  const countries = ["الكل", ...Array.from(new Set(gamesData.map(g => g.country)))];
  const types = ["الكل", "ألعاب حركية", "ألعاب ذهنية", "ألعاب طريفة", "ألعاب بحرية", "شعبية"];

  const homeFilteredGames = gamesData.filter(game => {
    const matchesSearch = game.name.includes(searchTerm) || game.localNames.some(n => n.includes(searchTerm));
    const matchesCategory = selectedCategory === "الكل" || game.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const galleryFilteredGames = gamesData.filter(game => {
    const matchesSearch = game.name.includes(searchTerm) || game.localNames.some(n => n.includes(searchTerm));
    const matchesCountry = filterCountry === "الكل" || game.country === filterCountry;
    const matchesType = filterType === "الكل" || game.tags.includes(filterType);
    return matchesSearch && matchesCountry && matchesType;
  });

  const featuredGame = gamesData[0];

  const handleRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    setSelectedGame(gamesData[randomIndex]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-16">
               <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdfcfa] text-[#d4a574] text-sm font-bold rounded-full border border-[#d4a574]/20 mb-6">
                  <ScrollText className="w-4 h-4" />
                  قصتنا وهويتنا
               </span>
               <h2 className="text-4xl font-bold text-[#2d4a3e] mb-6 leading-tight">عن مشروع مسرد الألعاب التراثية</h2>
               <p className="text-xl text-[#3a2a1f]/70 font-light leading-relaxed max-w-2xl mx-auto">
                 مبادرة عربية رقمية تهدف إلى بناء أرشيف حي ومفتوح للألعاب الشعبية، ليكون جسراً يربط الماضي بالمستقبل.
               </p>
             </div>
             <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-[#fdfcfa] p-8 rounded-xl border border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                   <Target className="w-10 h-10 text-[#d4a574] mb-6 relative z-10" />
                   <h3 className="text-2xl font-bold text-[#2d4a3e] mb-4 relative z-10">الرؤية والرسالة</h3>
                   <p className="text-[#3a2a1f]/80 leading-relaxed relative z-10">
                     نسعى لتوثيق التراث غير المادي للمنطقة العربية، ليس فقط كحركات وقواعد لعب، بل كسياق اجتماعي وثقافي يعكس قيم المجتمعات وتطورها عبر الزمن.
                   </p>
                </div>
                <div className="bg-[#fdfcfa] p-8 rounded-xl border border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                   <ShieldCheck className="w-10 h-10 text-[#4a7b6f] mb-6 relative z-10" />
                   <h3 className="text-2xl font-bold text-[#2d4a3e] mb-4 relative z-10">المنهجية العلمية</h3>
                   <p className="text-[#3a2a1f]/80 leading-relaxed relative z-10">
                     نعتمد في توثيقنا على المصادر المكتوبة الموثوقة والروايات الشفوية من كبار السن، مع الحرص على تدقيق المسميات المحلية واختلافاتها الجغرافية.
                   </p>
                </div>
             </div>
          </div>
        );

      case 'gallery':
        return (
          <>
            <div className="bg-[#2d4a3e] text-[#f8f6f3] py-20 px-6 relative overflow-hidden mb-12">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="max-w-7xl mx-auto relative z-10 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">الأرشيف الرقمي الشامل</h1>
                  <p className="text-[#f8f6f3]/80 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                     استكشف المجموعة الكاملة للألعاب الشعبية، واستخدم أدوات التصفية الدقيقة للوصول إلى تراث منطقتك.
                  </p>
               </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-4 pb-24">
               <div className="flex flex-col lg:flex-row gap-12">
                  <aside className="lg:w-1/4 space-y-8">
                     <div className="bg-[#fdfcfa] p-6 rounded-xl border border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-28">
                        <div className="flex items-center justify-between text-[#2d4a3e] border-b border-[#e5e7eb] pb-4 mb-6">
                           <div className="flex items-center gap-2">
                              <SlidersHorizontal className="w-5 h-5" />
                              <h3 className="font-bold text-lg">تصفية النتائج</h3>
                           </div>
                           {(filterCountry !== "الكل" || filterType !== "الكل" || searchTerm) && (
                              <button 
                                 onClick={() => {setFilterCountry("الكل"); setFilterType("الكل"); setSearchTerm("")}}
                                 className="text-xs text-[#d4a574] font-medium hover:underline"
                              >
                                 إعادة تعيين
                              </button>
                           )}
                        </div>
                        <div className="relative mb-8">
                           <input
                              type="text"
                              className="block w-full h-12 pr-10 pl-4 rounded-lg bg-white border border-[#e5e7eb] text-sm focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574] transition-all shadow-sm text-[#3a2a1f]"
                              placeholder="بحث سريع..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                           />
                           <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-[#6b7280]" />
                        </div>
                        <div className="mb-8">
                           <h4 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-4">الدولة</h4>
                           <div className="space-y-1">
                              {countries.map((c) => (
                                 <label key={c} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${filterCountry === c ? 'bg-[#2d4a3e]/5 text-[#2d4a3e] font-bold' : 'text-[#3a2a1f]/80 hover:bg-[#f8f6f3]'}`}>
                                    <div className="flex items-center gap-3">
                                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filterCountry === c ? 'border-[#d4a574] bg-[#d4a574]' : 'border-[#6b7280]/40'}`}>
                                          {filterCountry === c && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                       </div>
                                       <span className="text-sm">{c}</span>
                                    </div>
                                    <input type="radio" name="country" className="hidden" checked={filterCountry === c} onChange={() => setFilterCountry(c)} />
                                 </label>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-[#6b7280] uppercase tracking-wider mb-4">نوع اللعبة</h4>
                           <div className="flex flex-wrap gap-2">
                              {types.map((t) => (
                                 <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                       ${filterType === t 
                                          ? 'bg-[#2d4a3e] text-white border-[#2d4a3e]' 
                                          : 'bg-white text-[#3a2a1f]/70 border-[#e5e7eb] hover:border-[#d4a574] hover:text-[#d4a574]'}`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </aside>

                  <div className="lg:w-3/4">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#2d4a3e] flex items-center gap-2">
                           <LayoutGrid className="w-5 h-5 text-[#4a7b6f]" />
                           النتائج
                        </h2>
                        <span className="text-sm font-medium text-[#4a7b6f] bg-[#fdfcfa] px-4 py-1.5 rounded-full border border-[#e5e7eb]">{galleryFilteredGames.length} لعبة</span>
                     </div>
                     {galleryFilteredGames.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {galleryFilteredGames.map((game) => (
                              <div 
                                 key={game.id}
                                 onClick={() => setSelectedGame(game)}
                                 className="group bg-[#fdfcfa] rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
                              >
                                 <div className="relative h-64 w-full overflow-hidden bg-[#2d4a3e]/10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d4a3e]/80 to-transparent z-10 opacity-70 transition-opacity"></div>
                                    <img 
                                       src={game.media?.url || "/api/placeholder/400/300"} 
                                       alt={game.name}
                                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                       onError={(e) => {
                                          e.target.src = "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800"; 
                                       }}
                                    />
                                    <div className="absolute bottom-0 right-0 left-0 p-6 z-20">
                                       <div className="flex items-center gap-2 mb-2">
                                          <span className="bg-[#d4a574] text-[#3a2a1f] text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                             {game.type.split('/')[0]}
                                          </span>
                                       </div>
                                       <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{game.name}</h3>
                                       <div className="flex items-center gap-1 text-xs text-[#F6F6F6]/90 font-medium">
                                          <MapPin className="w-3.5 h-3.5" />
                                          <span>{game.country}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-sm text-[#3a2a1f]/70 line-clamp-2 leading-relaxed mb-6 flex-grow">
                                       {game.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
                                       <div className="flex gap-2 text-xs text-[#6b7280]">
                                          <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {game.players.split(' ')[0]}</span>
                                          <span className="w-px h-3 bg-[#e5e7eb] mx-1"></span>
                                          <span>{game.ageGroup.split(' ')[0]}</span>
                                       </div>
                                       <span className="text-xs font-bold text-[#2d4a3e] group-hover:text-[#d4a574] transition-colors flex items-center gap-1">
                                          عرض التفاصيل <ArrowLeft className="w-3 h-3" />
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="bg-[#fdfcfa] rounded-xl border-2 border-dashed border-[#e5e7eb] p-16 text-center">
                           <Search className="w-16 h-16 text-[#d4a574]/50 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-[#2d4a3e]">لا توجد نتائج مطابقة</h3>
                           <p className="text-[#3a2a1f]/60 mt-2 mb-8 max-w-md mx-auto">لم نتمكن من العثور على ألعاب تطابق معايير البحث الحالية.</p>
                           <button 
                              onClick={() => {setFilterCountry("الكل"); setFilterType("الكل"); setSearchTerm("")}}
                              className="px-6 py-3 bg-[#2d4a3e] text-white rounded-lg text-sm font-bold hover:bg-[#2d4a3e]/90 transition-colors shadow-lg shadow-[#2d4a3e]/20"
                           >
                              عرض جميع الألعاب
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </main>
          </>
        );

      case 'home':
      default:
        return (
          <>
            <div className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto border-b border-[#e5e7eb]">
              <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
                  <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                      <div className="relative group cursor-pointer" onClick={() => setSelectedGame(featuredGame)}>
                          <div className="absolute inset-0 bg-[#2d4a3e] rounded-[24px] rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-300"></div>
                          <div className="bg-[#fdfcfa] border border-[#e5e7eb] p-8 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] relative overflow-hidden">
                             <div className="absolute top-0 left-0 bg-[#d4a574] text-[#3a2a1f] text-xs font-bold px-4 py-2 rounded-br-2xl z-10">لعبة مميزة</div>
                             <div className="h-64 w-full rounded-[18px] overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors"></div>
                                <img 
                                   src={featuredGame.media.url} 
                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                   alt={featuredGame.name}
                                />
                             </div>
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                   <h3 className="text-3xl font-bold text-[#2d4a3e] mb-2">{featuredGame.name}</h3>
                                   <p className="text-sm text-[#4a7b6f] flex items-center gap-1 font-medium">
                                      <MapPin className="w-4 h-4" /> {featuredGame.country}
                                   </p>
                                </div>
                                <div className="p-3 bg-[#f8f6f3] rounded-full group-hover:bg-[#2d4a3e] group-hover:text-white transition-colors duration-300">
                                   <ArrowLeft className="w-6 h-6" />
                                </div>
                             </div>
                             <p className="text-[#3a2a1f]/70 leading-relaxed mb-6 line-clamp-3 text-lg">
                                {featuredGame.description}
                             </p>
                             <div className="flex gap-2">
                                {featuredGame.tags.map((tag) => (
                                  <span key={tag} className="text-xs bg-[#2d4a3e]/5 px-3 py-1 rounded-full border border-[#2d4a3e]/10 text-[#2d4a3e] font-medium">#{tag}</span>
                                ))}
                             </div>
                          </div>
                      </div>
                  </div>
                  <div className="w-full lg:w-1/2 text-center lg:text-right space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d4a574]/10 text-[#2d4a3e] text-xs font-bold rounded-full mb-6">
                          <Sparkles className="w-3 h-3 text-[#d4a574]" />
                          <span>الأرشيف الرقمي المفتوح</span>
                      </div>
                      <h1 className="text-5xl md:text-7xl font-bold text-[#2d4a3e] leading-tight mb-6">
                          ذاكرة <span className="text-[#d4a574]">الألعاب الشعبية</span>
                      </h1>
                      <p className="text-xl text-[#3a2a1f]/70 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                          منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي، لتبقى جسراً للأجيال القادمة.
                      </p>
                    </div>
                    <div className="bg-[#fdfcfa] p-2 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#e5e7eb] flex gap-2 w-full max-w-lg mx-auto lg:mx-0 relative z-20">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder="ابحث عن لعبة، دولة، أو مهارة..." 
                            className="w-full h-14 pr-12 pl-4 rounded-xl bg-transparent text-base focus:outline-none text-[#3a2a1f] placeholder-[#6b7280]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Search className="absolute right-4 top-4 text-[#d4a574] w-6 h-6" />
                        </div>
                        <button 
                           onClick={handleRandomGame}
                           className="bg-[#2d4a3e] text-white p-4 rounded-xl hover:bg-[#2d4a3e]/90 transition-colors tooltip"
                           title="اكتشف لعبة عشوائية"
                        >
                           <Shuffle className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-[#4a7b6f] font-medium">
                        <span className="flex items-center gap-2"><Book className="w-5 h-5" /> {gamesData.length} لعبة موثقة</span>
                        <span className="flex items-center gap-2"><Globe className="w-5 h-5" /> 4 أقاليم جغرافية</span>
                    </div>
                  </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#2d4a3e]">تصفح حسب التصنيف</h2>
                  <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('gallery')}} className="text-sm text-[#4a7b6f] flex items-center gap-1 hover:text-[#2d4a3e] hover:gap-2 transition-all font-medium">عرض الكل <ArrowLeft className="w-4 h-4"/></a>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {categories.map((cat) => {
                     const Icon = cat.icon;
                     const isSelected = selectedCategory === cat.id;
                     return (
                        <button
                           key={cat.id}
                           onClick={() => setSelectedCategory(cat.id)}
                           className={`min-w-[150px] p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-4 snap-start
                              ${isSelected 
                                 ? 'bg-[#2d4a3e] text-white border-[#2d4a3e] shadow-lg transform scale-105' 
                                 : 'bg-[#fdfcfa] text-[#6b7280] border-[#e5e7eb] hover:border-[#d4a574] hover:bg-white'}`}
                        >
                           <Icon className={`w-8 h-8 ${isSelected ? 'text-[#d4a574]' : 'text-[#4a7b6f]'}`} />
                           <span className="text-sm font-bold">{cat.label}</span>
                        </button>
                     )
                  })}
               </div>
            </div>

            <main id="games" className="max-w-7xl mx-auto px-6 pb-24">
              <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 bg-[#d4a574]/20 text-[#d4a574] rounded-full flex items-center justify-center">
                     <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-[#2d4a3e]">أحدث الإضافات</h2>
                     <p className="text-sm text-[#6b7280]">{homeFilteredGames.length} نتيجة مطابقة</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homeFilteredGames.length > 0 ? (
                  homeFilteredGames.map((game) => (
                    <div 
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="group bg-[#fdfcfa] rounded-xl border border-[#e5e7eb] p-1 cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="p-8 h-full flex flex-col bg-[#fdfcfa] rounded-[20px]">
                         <div className="h-48 w-full rounded-[16px] overflow-hidden mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#061D14]/80 to-transparent z-10 opacity-70 transition-opacity"></div>
                            <img 
                               src={game.media?.url || "/api/placeholder/400/300"} 
                               alt={game.name}
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                               onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800"; 
                               }}
                            />
                             <div className="absolute bottom-3 right-3 z-20">
                               <span className="bg-[#FFFFFF]/90 backdrop-blur text-[#201F1E] text-[10px] font-bold px-2 py-1 rounded-[999px] shadow-sm">
                                  {game.type.split('/')[0]}
                               </span>
                            </div>
                         </div>
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-bold text-[#2d4a3e] mb-2">{game.name}</h3>
                          <div className="w-10 h-10 rounded-full bg-[#f8f6f3] flex items-center justify-center group-hover:bg-[#d4a574] group-hover:text-[#3a2a1f] transition-colors duration-300">
                              <ArrowLeft className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#4a7b6f] text-xs mb-6 font-medium">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span>{game.country}</span>
                        </div>
                        <p className="text-sm text-[#3a2a1f]/70 mb-8 leading-relaxed line-clamp-3 font-light">
                          {game.description}
                        </p>
                        <div className="mt-auto pt-6 border-t border-dashed border-[#e5e7eb] flex flex-wrap gap-2">
                          {game.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] text-[#6b7280] bg-[#f8f6f3] px-2.5 py-1 rounded-md border border-[#e5e7eb]">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="col-span-full py-32 text-center bg-[#f8f6f3] rounded-3xl border border-dashed border-[#e5e7eb]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Search className="w-8 h-8 text-[#d4a574]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d4a3e]">لم نعثر على نتائج</h3>
                    <button onClick={() => {setSearchTerm(""); setSelectedCategory("الكل")}} className="mt-6 text-[#d4a574] font-bold text-sm hover:underline">
                        إعادة تعيين البحث
                    </button>
                  </div>
                )}
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@200;300;400;500;600;700&display=swap');
          body {
            font-family: "IBM Plex Sans Arabic", "IBM Plex Sans Arabic Fallback", sans-serif;
            background-color: #FAFAFA;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}
      </style>
      
      <div dir="rtl" className="min-h-screen text-slate-900 selection:bg-amber-100 selection:text-amber-900 relative bg-[#FDFDFD]">
        
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
               <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-300">
                  <LayoutGrid className="w-6 h-6" />
               </div>
               <div>
                  <span className="font-bold text-lg tracking-tight block leading-none">مسرد الألعاب</span>
                  <span className="text-[10px] text-gray-400 font-medium">الأرشيف الرقمي</span>
               </div>
            </div>
            
            <div className="hidden md:flex gap-1 p-1 bg-gray-100/80 rounded-full">
               <button onClick={() => setActiveTab('home')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}>الرئيسية</button>
               <button onClick={() => setActiveTab('gallery')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'gallery' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}>الألعاب التراثية العربية</button>
               <button onClick={() => setActiveTab('about')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}>عن المشروع</button>
            </div>
          </div>
        </header>

        {renderContent()}

        {selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-[#061D14]/80 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setSelectedGame(null)}
            ></div>
            
            <div className="bg-[#FFFFFF] w-full max-w-6xl max-h-[95vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in-95 duration-300 border border-[#FFFFFF]/20">
              
              <button 
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 left-4 z-20 p-2 bg-[#FFFFFF]/80 backdrop-blur rounded-full md:hidden border border-[#E3E6E5] shadow-sm text-[#201F1E]"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>

              <div className="w-full md:w-[320px] bg-[#f8f6f3] border-l border-[#E3E6E5] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar shrink-0">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-900 rounded-3xl shadow-lg relative overflow-hidden text-white group">
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                           <Globe className="w-4 h-4" />
                           الدولة
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{selectedGame.country}</h3>
                     </div>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                           <MapPin className="w-4 h-4" />
                           الإقليم
                        </div>
                        <p className="text-sm font-semibold text-[#201F1E] leading-relaxed">
                           {selectedGame.region || "غير محدد"}
                        </p>
                     </div>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><UserCheck className="w-5 h-5"/></div>
                        <div>
                           <p className="text-[10px] text-[#7B8A86] font-bold uppercase tracking-wider mb-0.5">الفئة العمرية</p>
                           <p className="text-sm font-semibold text-[#201F1E]">{selectedGame.ageGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#d4a574]/10 text-[#d4a574] rounded-xl"><Users className="w-5 h-5"/></div>
                        <div>
                           <p className="text-[10px] text-[#7B8A86] font-bold uppercase tracking-wider mb-0.5">عدد اللاعبين</p>
                           <p className="text-sm font-semibold text-[#201F1E]">{selectedGame.players}</p>
                        </div>
                      </div>
                      {selectedGame.practitioners && (
                        <div className="flex items-start gap-4">
                           <div className="p-2 bg-[#4a7b6f]/10 text-[#4a7b6f] rounded-xl"><Smile className="w-5 h-5"/></div>
                           <div>
                              <p className="text-[10px] text-[#7B8A86] font-bold uppercase tracking-wider mb-0.5">نوع الممارسين</p>
                              <p className="text-sm font-semibold text-[#201F1E]">{selectedGame.practitioners}</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-8 md:p-12 relative">
                 <div className="mb-8 border-b border-[#E3E6E5] pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#061D14] mb-4 tracking-tight">{selectedGame.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                       {selectedGame.localNames.map((n) => (
                          <span key={n} className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">{n}</span>
                       ))}
                    </div>
                    {selectedGame.heritageField && (
                       <div className="inline-flex items-center gap-2 text-sm font-medium text-[#d4a574] bg-[#FDFCFA] px-4 py-2 rounded-xl border border-[#d4a574]/30">
                          <Landmark className="w-4 h-4" />
                          <span>{selectedGame.heritageField}</span>
                       </div>
                    )}
                 </div>

                 {selectedGame.media && (
                    <div className="mb-12">
                       <h3 className="text-xl font-bold text-[#061D14] mb-4 flex items-center gap-2">
                          <Camera className="w-6 h-6 text-[#AB9F80]" />
                          صورة توضيحية للعبة
                       </h3>
                       <div className="rounded-3xl overflow-hidden shadow-md border border-[#E3E6E5] relative group">
                           <div 
                              className="aspect-video bg-[#F6F6F6] w-full relative overflow-hidden cursor-zoom-in"
                              onClick={() => setIsImageZoomed(true)}
                           >
                               <img 
                                   src={selectedGame.media.url} 
                                   alt={selectedGame.name}
                                   className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                   onError={(e) => {
                                       e.target.src = "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800";
                                   }}
                               />
                               <div className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn className="w-5 h-5" />
                               </div>
                           </div>
                           {selectedGame.media.caption ? (
                               <div className="bg-[#FFFFFF]/95 backdrop-blur px-6 py-3 rounded-b-2xl text-sm font-medium text-[#201F1E] border border-t-0 border-[#E3E6E5]">
                                   {selectedGame.media.caption}
                               </div>
                           ) : null}
                        </div>
                    </div>
                 )}

                 <section className="mb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <Info className="w-6 h-6 text-indigo-500" /> الوصف الموسع
                    </h3>
                    <div className="prose prose-lg text-slate-600 leading-loose max-w-none text-right">
                       <p className="whitespace-pre-wrap">{selectedGame.description}</p>
                    </div>
                 </section>

                 {(selectedGame.ageGroupDescription || selectedGame.practitionersDescription || selectedGame.playersDescription) && (
                    <section className="mb-12">
                       <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <HandMetal className="w-6 h-6 text-purple-500" /> تفاصيل الممارسة والمشاركين
                       </h3>
                       <div className="grid gap-6">
                          {selectedGame.ageGroupDescription && (
                             <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100">
                                <p className="text-xs font-bold text-purple-700 uppercase mb-2 flex items-center gap-2">
                                   <UserCheck className="w-4 h-4" /> الفئة العمرية (تفاصيل)
                                </p>
                                <p className="text-slate-700 leading-relaxed">{selectedGame.ageGroupDescription}</p>
                             </div>
                          )}
                          {selectedGame.practitionersDescription && (
                             <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
                                   <Smile className="w-4 h-4" /> نوع الممارسين (تفاصيل)
                                </p>
                                <p className="text-slate-700 leading-relaxed">{selectedGame.practitionersDescription}</p>
                             </div>
                          )}
                          {selectedGame.playersDescription && (
                             <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
                                <p className="text-xs font-bold text-orange-700 uppercase mb-2 flex items-center gap-2">
                                   <Users className="w-4 h-4" /> عدد اللاعبين (تفاصيل)
                                </p>
                                <p className="text-slate-700 leading-relaxed">{selectedGame.playersDescription}</p>
                             </div>
                          )}
                       </div>
                    </section>
                 )}

                 <section className="mb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <Target className="w-6 h-6 text-rose-500" /> بيئة وأدوات اللعب
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-rose-200 transition-colors">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider flex items-center gap-2">
                             <Wrench className="w-4 h-4" /> الأدوات والمستلزمات
                          </p>
                          <ul className="space-y-2">
                             {selectedGame.tools.map((t, i) => (
                                <li key={i} className="text-sm font-medium text-slate-800 flex items-start gap-2">
                                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0"></span>
                                   {t}
                                </li>
                             ))}
                          </ul>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-colors">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider flex items-center gap-2">
                             <Sunset className="w-4 h-4" /> بيئة الممارسة والزمان
                          </p>
                          <div className="space-y-3">
                             <div>
                                <p className="text-xs text-slate-500 mb-1">المكان</p>
                                <p className="text-sm font-bold text-slate-800">{selectedGame.environment}</p>
                             </div>
                             <div>
                                <p className="text-xs text-slate-500 mb-1">الوقت</p>
                                <p className="text-sm font-bold text-slate-800">{selectedGame.timing || selectedGame.seasonalityLocation}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="mb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <BookOpen className="w-6 h-6 text-emerald-500" /> القواعد
                    </h3>
                    <div className="grid gap-4">
                       {selectedGame.rules.map((rule, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                                {i + 1}
                             </div>
                             <p className="text-slate-600 leading-relaxed pt-1 whitespace-pre-wrap">{rule}</p>
                          </div>
                       ))}
                    </div>
                    {(selectedGame.winLossSystem || selectedGame.startEnd) && (
                      <div className="grid md:grid-cols-2 gap-6 mt-8">
                         {selectedGame.winLossSystem && (
                            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100 shadow-sm group hover:shadow-md transition-shadow">
                               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400"></div>
                               <div className="flex items-center gap-3 mb-4 text-amber-800">
                                  <div className="p-2 bg-white rounded-full shadow-sm">
                                     <Trophy className="w-5 h-5 text-amber-500" />
                                  </div>
                                  <h4 className="font-bold text-sm uppercase tracking-wider">نظام الفوز والخسارة</h4>
                               </div>
                               <div className="text-sm text-slate-700 leading-7 font-medium whitespace-pre-line pl-2 border-l-2 border-amber-200/60">
                                  {selectedGame.winLossSystem}
                               </div>
                            </div>
                         )}

                         {selectedGame.startEnd && (
                            <div className="relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-400"></div>
                               <div className="flex items-center gap-3 mb-4 text-slate-700">
                                  <div className="p-2 bg-slate-50 rounded-full border border-slate-100">
                                     <Activity className="w-5 h-5 text-slate-500" />
                                  </div>
                                  <h4 className="font-bold text-sm uppercase tracking-wider">آلية البدء والانتهاء</h4>
                               </div>
                               <div className="text-sm text-slate-600 leading-7 whitespace-pre-line pl-2 border-l-2 border-slate-200">
                                  {selectedGame.startEnd}
                               </div>
                            </div>
                         )}
                      </div>
                   )}
                 </section>

                 <section className="mb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <Heart className="w-6 h-6 text-red-500" /> الموروث الشفهي والاجتماعي
                    </h3>
                    <div className="bg-slate-900 text-slate-300 p-8 rounded-[32px] relative overflow-hidden mb-6">
                       <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                          <Heart className="w-64 h-64" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">السياق الاجتماعي (Social Function)</p>
                          <p className="text-base text-white leading-loose whitespace-pre-wrap font-light">{selectedGame.socialContext}</p>
                       </div>
                    </div>
                    {selectedGame.oralTradition && (
                       <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 relative">
                          <div className="absolute -top-3 right-8 bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                             أهازيج ومصطلحات
                          </div>
                          <p className="text-lg text-amber-900 leading-relaxed font-medium italic text-center px-4 pt-2 whitespace-pre-wrap">
                             "{selectedGame.oralTradition}"
                          </p>
                       </div>
                    )}
                 </section>

                 <section>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <Book className="w-6 h-6 text-slate-400" /> المصادر والمراجع
                    </h3>
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                       <ul className="grid gap-3">
                          {selectedGame.referencesList ? (
                             selectedGame.referencesList.map((ref, i) => (
                                <li key={i} className="text-sm text-slate-600 flex gap-3 items-start">
                                   <span className="mt-2 w-1.5 h-1.5 bg-slate-300 rounded-full flex-shrink-0"></span>
                                   <span className="leading-relaxed">{ref}</span>
                                </li>
                             ))
                          ) : (
                             <li className="text-sm text-slate-600 leading-relaxed">{selectedGame.references}</li>
                          )}
                       </ul>
                    </div>
                 </section>

              </div>
            </div>
          </div>
        )}

      {isImageZoomed && selectedGame && (
          <div 
             className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300" 
             onClick={() => setIsImageZoomed(false)}
          >
             <img 
                src={selectedGame.media.url} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                alt={selectedGame.name}
             />
             <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-8 h-8" />
             </button>
          </div>
      )}

      <footer className="bg-[#061D14] text-[#F6F6F6] py-16 mt-auto border-t border-[#134232]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="font-bold text-lg">مسرد توثيقي</span>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                أول منصة رقمية شاملة تهدف إلى جمع وتوثيق الألعاب الشعبية.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            <p>© 2026 مسرد توثيقي للألعاب التراثية العربية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}