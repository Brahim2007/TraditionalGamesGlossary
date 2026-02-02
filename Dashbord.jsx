import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Users, BookOpen, X, Award, Heart, ArrowLeft, Globe, 
  LayoutGrid, Image as ImageIcon, Book, UserCheck, Smile, FileText, 
  Megaphone, Landmark, Info, HandMetal, Target, Wrench, Sunset, 
  SlidersHorizontal, Check, Activity, Brain, Anchor, ScrollText, Trophy, 
  Menu, Tag, Twitter, Facebook, Instagram, Linkedin, Shuffle, Sparkles, 
  ChevronRight, ArrowRight, Camera, BarChart3, Plus, Clock, CheckCircle2, 
  AlertCircle, Save, UploadCloud, Trash2, Home, FileInput, Wand2, HelpCircle, Table as TableIcon
} from 'lucide-react';

// --- BookWo / Green System Design Tokens ---
// Primary Brand: #061D14 (Deepest Green), #134232 (Deep Green), #245542 (Green)
// Accent: #AB9F80 (Gold/Tan), #C9B892 (Light Gold)
// Neutral: #F6F6F6 (Bg), #FFFFFF (Surface)

// --- Mock Data ---
const gamesData = [
  {
    id: 6,
    name: "الركض بالحاجبين المرفوعين",
    localNames: ["سباق المبهّتين", "لعبة العيون الكبار"],
    country: "دولة قطر",
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
    environment: "السكيك (الأزقة) أو الحوي",
    timing: "النهار (العصر)",
    description: "لعبة 'الركض بالحاجبين المرفوعين' هي تمرين في 'فصل الحواس'. الطبيعة البشرية تميل إلى تقطيب الجبين عند الركض السريع، وهذه اللعبة تكسر هذه الفطرة بطلب الركض مع رفع الحاجبين.",
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
      caption: "أطفال يمارسون اللعبة في أحد الفرجان"
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
    },
    references: "الألعاب الشعبية في قطر.",
    tags: ["تراث خليجي", "ألعاب ذهنية", "ألعاب بحرية"] 
  },
  {
    id: 1,
    name: "التيلة",
    localNames: ["الكرات الزجاجية", "المصاقيل", "البرجون"],
    country: "الإمارات العربية المتحدة",
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
    },
    references: "كتاب الألعاب الشعبية في الإمارات.",
    tags: ["تراث خليجي", "ألعاب حركية"] 
  }
];

export default function TraditionalGamesGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); 
  
  // Dashboard & Form States
  const [dashboardStats, setDashboardStats] = useState({
    totalGames: 142,
    pendingReview: 8,
    contributors: 34,
    viewsThisMonth: "12.5K"
  });
  
  const [formStep, setFormStep] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false); // State for Template Modal
  const [importText, setImportText] = useState("");
  
  // Full State for Controlled Inputs
  const [newGameData, setNewGameData] = useState({
    name: "",
    country: "",
    region: "",
    heritageField: "",
    localNames: "",
    tags: "",
    description: "",
    ageGroup: "",
    ageGroupDetails: "",
    practitioners: "",
    practitionersDetails: "",
    players: "",
    playersDetails: "",
    tools: "",
    environment: "",
    timing: "",
    rules: ["", "", ""],
    winLoss: "",
    startEnd: "",
    socialContext: "",
    oralTradition: "",
    references: ""
  });

  // Template Data (Game: Running with Raised Eyebrows)
  const templateData = [
    { field: "اسم اللعبة", value: "الركض بالحاجبين المرفوعين" },
    { field: "المسميات المحلية", value: "سباق المبهّتين، لعبة العيون الكبار" },
    { field: "الدولة", value: "دولة قطر" },
    { field: "الإقليم", value: "الفرجان القديمة (الدوحة، الوكرة، الخور) - الأحياء الحضرية والسكيك" },
    { field: "مجال التراث", value: "الألعاب الشعبية - الممارسات الاجتماعية والطقوس (ألعاب التحكم النفسي-الحركي)" },
    { field: "نوع اللعبة", value: "فكاهة / حركية / سباق معوقات جسدية" },
    { field: "تاجات التصنيف", value: "#تراث_خليجي، #ألعاب_طريفة، #ألعاب_حركية، #دولة_قطر" },
    { field: "الفئة العمرية", value: "9 - 12 سنة (الطفولة المتوسطة)" },
    { field: "وصف الفئة العمرية", value: "العمر الذي يمتلك فيه الطفل القدرة على 'فصل الحواس' والتحكم المستقل في عضلات الوجه مع تقبل الفكاهة." },
    { field: "الممارسون", value: "مختلط (ذكور وإناث)" },
    { field: "وصف الممارسين", value: "لعبة مقبولة اجتماعياً للجنسين؛ تُلعب في 'الحوي' للفتيات وفي 'السكيك' للأولاد." },
    { field: "عدد اللاعبين", value: "3 - 10 لاعبين (سباق جماعي)" },
    { field: "وصف اللاعبين", value: "يبدأ من 3 أطفال، والعدد الكبير يزيد من صعوبة اللعبة بسبب 'عدوى الضحك'." },
    { field: "الأدوات", value: "لا يوجد (الجسد فقط - التركيز على عضلات الوجه والجبهة)" },
    { field: "المكان", value: "السكيك (الأزقة) أو الحوي (فناء المنزل)؛ بشرط أن تكون الأرضية مستوية." },
    { field: "الوقت", value: "النهار (العصر)؛ لضمان وضوح الرؤية للحكم والمراقبين." },
    { field: "الوصف الموسع", value: "تمرين في 'فصل الحواس' يكسر الفطرة البشرية التي تميل لتقطيب الجبين عند الركض. يركض الطفل بأقصى سرعة مع الحفاظ على وضعية 'الدهشة القصوى'، مما يخلق مشهداً كوميدياً يجمع بين جدية الجسد وذهول الوجه." },
    { field: "قواعد اللعب", value: "يصطف المتسابقون عند خط البداية.\nوضع الاستعداد: رفع الحواجب لأقصى حد وتثبيتها قبل الانطلاق.\nالركض بسرعة قصوى دون إنزال الحاجبين.\nالمراقبة: من يخفض حاجبيه يُستبعد فوراً أو يتوقف لإعادة رفعهما.\nالفوز لمن يصل خط النهاية أولاً وحواجبه مرفوعة." },
    { field: "نظام الفوز والخسارة", value: "الفوز: يعتمد على السرعة والتحكم العضلي (لقب صاحب العيون القوية).\nالخسارة: غالباً ما تحدث بسبب الضحك الذي يؤدي لارتخاء العضلات." },
    { field: "آلية البدء والانتهاء", value: "البدء: بالقرعة وتفتيش 'جاهزية الوجوه'.\nالانتهاء: بوصول أول متسابق أو استسلام الجميع من الضحك." },
    { field: "الموروث الشفهي", value: "صيحات تشويش مثل: 'نزلت! نزلت!'، 'ارفع عينك!'، 'شوف وراك!' (لإرغام اللاعب على فقدان التركيز)." },
    { field: "السياق الاجتماعي", value: "1. ضبط النفس (Self-Control) والرزانة.\n2. الذكاء العاطفي وفصل الجهد البدني عن التعبير الوجهي.\n3. الترفيه الجماعي وكسر الجليد." },
    { field: "المراجع", value: "1. سلسلة الألعاب الشعبية القطرية - كتارا.\n2. التراث الشعبي في قطر - مركز التراث الشعبي لدول الخليج العربية.\n3. توثيق ميداني - سوق واقف." }
  ];

  // --- Parser Logic (Smart Import) ---
  const handleSmartImport = () => {
    if (!importText.trim()) return;

    // Normalize text and split by newlines
    const lines = importText.split(/\r?\n/);
    const mappedData = { ...newGameData };
    
    // Country Normalization Map (Updated to cover more variations)
    const countryMap = {
        "السعودية": "المملكة العربية السعودية",
        "قطر": "دولة قطر",
        "الإمارات": "الإمارات العربية المتحدة",
        "الامارات": "الإمارات العربية المتحدة", // Without Hamza
        "الكويت": "دولة الكويت",
        "عمان": "سلطنة عمان",
        "عُمان": "سلطنة عمان",
        "البحرين": "مملكة البحرين",
        "الأردن": "المملكة الأردنية الهاشمية",
        "الاردن": "المملكة الأردنية الهاشمية", // Without Hamza
        "مصر": "جمهورية مصر العربية",
        "اليمن": "الجمهورية اليمنية",
        "العراق": "جمهورية العراق",
        "تونس": "الجمهورية التونسية",
        "الجزائر": "الجمهورية الجزائرية",
        "المغرب": "المملكة المغربية",
        "السودان": "جمهورية السودان",
        "ليبيا": "دولة ليبيا",
        "فلسطين": "دولة فلسطين",
        "لبنان": "الجمهورية اللبنانية",
        "سوريا": "الجمهورية العربية السورية",
        "موريتانيا": "الجمهورية الإسلامية الموريتانية",
        "جيبوتي": "جمهورية جيبوتي",
        "جزر القمر": "جزر القمر",
        "القمر": "جزر القمر",
        "الصومال": "جمهورية الصومال"
    };

    // Mapping configuration
    const fieldMappings = [
      { key: 'name', patterns: ['اسم اللعبة', 'الاسم الرسمي', 'اسم اللعبة الرسمي'] },
      { key: 'localNames', patterns: ['المسميات المحلية', 'بديلة', 'أسماء أخرى'] },
      { key: 'country', patterns: ['الدولة'] },
      { key: 'region', patterns: ['الإقليم', 'نطاق الانتشار'] },
      { key: 'heritageField', patterns: ['مجال التراث'] },
      { key: 'tags', patterns: ['تاجات التصنيف', 'الوسوم', 'نوع اللعبة'] }, 
      
      { key: 'description', patterns: ['الوصف الموسع', 'شرح اللعبة', 'نبذة'] },
      
      { key: 'ageGroup', patterns: ['الفئة العمرية'] }, 
      { key: 'ageGroupDetails', patterns: ['وصف الفئة العمرية', 'الفئة العمرية (تفاصيل)'] },
      
      { key: 'practitioners', patterns: ['الممارسون', 'نوع الممارسين'] },
      { key: 'practitionersDetails', patterns: ['وصف الممارسين', 'نوع الممارسين (تفاصيل)'] },
      
      { key: 'players', patterns: ['عدد اللاعبين'] },
      { key: 'playersDetails', patterns: ['وصف اللاعبين', 'عدد اللاعبين (تفاصيل)'] },
      
      { key: 'tools', patterns: ['الأدوات', 'الأدوات والمستلزمات'] },
      { key: 'environment', patterns: ['بيئة الممارسة', 'المكان'] },
      { key: 'timing', patterns: ['التوقيت', 'الزمان', 'الوقت'] },
      
      { key: 'rules', patterns: ['قواعد اللعب', 'طريقة اللعب'] },
      
      { key: 'winLoss', patterns: ['نظام الفوز والخسارة', 'الفوز والخسارة'] },
      { key: 'startEnd', patterns: ['آلية البدء والانتهاء', 'البدء والانتهاء'] },
      
      { key: 'oralTradition', patterns: ['الموروث الشفهي', 'أهازيج', 'أهازيج ومصطلحات'] },
      { key: 'socialContext', patterns: ['السياق الاجتماعي', 'القيم الاجتماعية'] },
      
      { key: 'references', patterns: ['المراجع', 'المصادر والمراجع', 'المصادر', 'قائمة المراجع'] },
    ];

    let currentKey = null;

    const matchLineToKey = (line) => {
      for (const mapping of fieldMappings) {
        for (const pattern of mapping.patterns) {
          const regex = new RegExp(`^[\\-•*]?\\s*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\(.*?\\))?\\s*[:\\-–\\/\\t,،]*\\s*`, 'i');
          if (regex.test(line)) {
            return { key: mapping.key, content: line.replace(regex, '').trim() };
          }
        }
      }
      return null;
    };

    let rulesBuffer = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const match = matchLineToKey(trimmed);

      if (match) {
        currentKey = match.key;
        if (currentKey === 'rules') {
           rulesBuffer = []; 
           if (match.content) rulesBuffer.push(match.content);
        } else if (currentKey === 'country') {
           // Normalize Country Name logic
           const rawCountry = match.content;
           const matchedCountryKey = Object.keys(countryMap).find(k => rawCountry.includes(k));
           mappedData[currentKey] = matchedCountryKey ? countryMap[matchedCountryKey] : rawCountry;
        } else {
           mappedData[currentKey] = match.content;
        }
      } else if (currentKey) {
        if (currentKey === 'rules') {
           rulesBuffer.push(trimmed);
        } else {
           mappedData[currentKey] += (mappedData[currentKey] ? "\n" : "") + trimmed;
        }
      }
    });

    if (rulesBuffer.length > 0) {
       // Filter empty lines and strip leading numbers (e.g., "1. ", "2- ", "• ") to avoid duplication in UI
       mappedData.rules = rulesBuffer
         .filter(r => r.trim().length > 0)
         .map(r => r.replace(/^(\d+[\.\-\)\s]+|[•\-\*])\s*/, '').trim());
    }

    setNewGameData(mappedData);
    setShowImportModal(false);
    setImportText(""); 
    alert("تم تحليل النص وتعبئة الحقول بنجاح!");
  };

  const categories = [
    { id: "الكل", label: "الكل", icon: LayoutGrid },
    { id: "ألعاب حركية", label: "ألعاب حركية", icon: Activity },
    { id: "ألعاب ذهنية", label: "ألعاب ذهنية", icon: Brain },
    { id: "تراث خليجي", label: "تراث خليجي", icon: Award },
    { id: "ألعاب بحرية", label: "ألعاب بحرية", icon: Anchor },
    { id: "تراث عراقي", label: "تراث عراقي", icon: ScrollText },
    { id: "ألعاب طريفة", label: "ألعاب طريفة", icon: Smile },
  ];

  const filteredGames = gamesData.filter(game => {
    const matchesSearch = game.name.includes(searchTerm) || game.localNames.some(n => n.includes(searchTerm));
    const matchesCategory = selectedCategory === "الكل" || game.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    setSelectedGame(gamesData[randomIndex]);
  };

  // --- Renderers ---

  const DashboardCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
            +{trend}% <Activity className="w-3 h-3" />
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-[#061D14] mb-1">{value}</h3>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
    </div>
  );

  const StepIndicator = ({ step, currentStep, icon: Icon, label }) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;
    
    return (
      <div className={`flex flex-col items-center gap-2 relative z-10 w-24`}>
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
          ${isActive ? 'bg-[#AB9F80] border-[#AB9F80] text-[#061D14] scale-110 shadow-lg' : 
            isCompleted ? 'bg-[#061D14] border-[#061D14] text-white' : 'bg-white border-gray-200 text-gray-400'}`}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-[#061D14]' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
    );
  };

  const FormSection = ({ title, children }) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold text-[#061D14] mb-6 pb-4 border-b border-gray-100">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-[#061D14] mb-2">لوحة التحكم</h2>
          <p className="text-gray-500">مرحباً بك، لديك <span className="text-[#AB9F80] font-bold">3 مهام</span> تتطلب الانتباه اليوم.</p>
        </div>
        <button 
          onClick={() => setActiveTab('add-game')}
          className="bg-[#061D14] text-white px-6 py-3 rounded-xl hover:bg-[#134232] transition-colors flex items-center gap-2 shadow-lg shadow-[#061D14]/20"
        >
          <Plus className="w-5 h-5" /> إضافة لعبة جديدة
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard 
          title="إجمالي الألعاب الموثقة" 
          value={dashboardStats.totalGames} 
          icon={BookOpen} 
          colorClass="bg-blue-50 text-blue-600"
          trend="12"
        />
        <DashboardCard 
          title="بانتظار المراجعة" 
          value={dashboardStats.pendingReview} 
          icon={Clock} 
          colorClass="bg-amber-50 text-amber-600"
        />
        <DashboardCard 
          title="المساهمين النشطين" 
          value={dashboardStats.contributors} 
          icon={Users} 
          colorClass="bg-purple-50 text-purple-600"
          trend="5"
        />
        <DashboardCard 
          title="زيارات هذا الشهر" 
          value={dashboardStats.viewsThisMonth} 
          icon={Activity} 
          colorClass="bg-emerald-50 text-emerald-600"
          trend="18"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#061D14] text-lg">آخر الإضافات والنشاطات</h3>
            <button className="text-sm text-[#AB9F80] font-bold hover:underline">عرض الكل</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#f8f6f3] text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">اسم اللعبة</th>
                  <th className="px-6 py-4">الدولة</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: "لعبة الصقلة", country: "عمان", status: "published", date: "منذ ساعتين" },
                  { name: "سباق القوارب", country: "البحرين", status: "pending", date: "منذ 5 ساعات" },
                  { name: "طاق طاق طاقية", country: "السعودية", status: "published", date: "أمس" },
                  { name: "العنبر", country: "الكويت", status: "review", date: "أمس" },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#fcfcfc] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#061D14]">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.country}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${item.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 
                          item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.status === 'published' ? 'منشور' : item.status === 'pending' ? 'قيد المراجعة' : 'تحت التدقيق'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{item.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-[#AB9F80] transition-colors"><SlidersHorizontal className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="bg-[#061D14] text-white p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 p-8 opacity-10">
              <Award className="w-32 h-32" />
            </div>
            <h3 className="font-bold text-lg mb-4 relative z-10">توثيق التراث مسؤولية</h3>
            <p className="text-gray-300 text-sm mb-6 relative z-10 leading-relaxed">
              تأكد من دقة المعلومات ومراجعة المصادر قبل اعتماد نشر أي لعبة جديدة للحفاظ على مصداقية المسرد.
            </p>
            <button className="w-full py-3 bg-[#AB9F80] text-[#061D14] font-bold rounded-xl hover:bg-[#C9B892] transition-colors relative z-10">
              دليل التوثيق العلمي
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#061D14] mb-4">توزيع المحتوى جغرافياً</h3>
            <div className="space-y-4">
               {[
                 { label: "دول الخليج", val: 65 },
                 { label: "بلاد الشام", val: 20 },
                 { label: "المغرب العربي", val: 10 },
                 { label: "وادي النيل", val: 5 },
               ].map((region, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                     <span>{region.label}</span>
                     <span>{region.val}%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-[#061D14] rounded-full" 
                        style={{ width: `${region.val}%`, opacity: 1 - (i * 0.2) }}
                     ></div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddGameForm = () => (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
       
       {/* Template Modal */}
       {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)}>
           <div className="bg-white w-full max-w-4xl rounded-2xl p-0 shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
               <div className="p-6 border-b border-gray-100 bg-[#f8f6f3] flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-[#061D14] flex items-center gap-2">
                        <TableIcon className="w-5 h-5 text-[#AB9F80]" /> الجدول النموذجي للبيانات
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">استخدم هذه الحقول والصيغ لضمان استيراد دقيق للمعلومات.</p>
                  </div>
                  <button onClick={() => setShowTemplateModal(false)}><X className="w-6 h-6 text-gray-400 hover:text-[#061D14]"/></button>
               </div>
               
               <div className="overflow-y-auto p-0">
                  <table className="w-full text-right border-collapse">
                     <thead className="bg-[#061D14] text-white text-sm font-bold sticky top-0 z-10">
                        <tr>
                           <th className="px-6 py-4 w-1/4 border-l border-[#245542]">اسم الحقل (للاستيراد)</th>
                           <th className="px-6 py-4 w-3/4">مثال (الركض بالحاجبين)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-sm">
                        {templateData.map((row, idx) => (
                           <tr key={idx} className="hover:bg-[#f8f6f3]">
                              <td className="px-6 py-4 font-bold text-[#061D14] bg-gray-50 border-l border-gray-100 align-top select-all">{row.field}</td>
                              <td className="px-6 py-4 text-gray-600 leading-relaxed align-top whitespace-pre-wrap">{row.value}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                  نصيحة: يمكنك نسخ العمود الأول واستخدامه كقالب لملء بيانات لعبتك الخاصة.
               </div>
           </div>
        </div>
       )}

       {/* Import Modal */}
       {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
           <div className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow-2xl border border-gray-200" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#061D14] flex items-center gap-2">
                     <Wand2 className="w-5 h-5 text-[#AB9F80]" /> استيراد ذكي للنص
                  </h3>
                  <button onClick={() => setShowImportModal(false)}><X className="w-5 h-5 text-gray-400"/></button>
               </div>
               <p className="text-sm text-gray-500 mb-4">
                  قم بنسخ ولصق تفاصيل اللعبة هنا (مثل: "اسم اللعبة: ..."). سيقوم النظام بالتعرف على الحقول وتعبئتها تلقائياً.
               </p>
               <textarea 
                  className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none text-sm leading-loose mb-6 font-mono"
                  placeholder={`مثال:\nاسم اللعبة: الركض بالحاجبين\nالدولة: قطر\nعدد اللاعبين: 4`}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
               ></textarea>
               <div className="flex justify-end gap-4">
                  <button onClick={() => setShowImportModal(false)} className="px-6 py-2 text-gray-500 hover:text-gray-700">إلغاء</button>
                  <button 
                     onClick={handleSmartImport}
                     className="px-6 py-2 bg-[#061D14] text-white rounded-xl hover:bg-[#134232] transition-colors font-bold"
                  >
                     تحليل واستيراد البيانات
                  </button>
               </div>
           </div>
        </div>
       )}

       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowRight className="w-6 h-6 text-gray-500" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-[#061D14]">إضافة لعبة جديدة</h2>
              <p className="text-gray-500 text-sm">يرجى تعبئة الحقول بدقة لضمان جودة الأرشفة.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => setShowTemplateModal(true)}
               className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:border-[#AB9F80] hover:text-[#061D14] transition-colors"
             >
                <TableIcon className="w-4 h-4" /> الجدول النموذجي
             </button>
             <button 
               onClick={() => setShowImportModal(true)}
               className="px-4 py-2 bg-[#AB9F80]/10 text-[#061D14] border border-[#AB9F80] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#AB9F80] transition-colors"
             >
                <Wand2 className="w-4 h-4" /> استيراد من نص
             </button>
          </div>
       </div>

       {/* Stepper */}
       <div className="relative flex justify-between max-w-2xl mx-auto mb-12">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
          <div 
            className="absolute top-5 right-0 h-0.5 bg-[#061D14] -z-0 transition-all duration-500" 
            style={{ width: `${((formStep - 1) / 3) * 100}%` }}
          ></div>
          <StepIndicator step={1} currentStep={formStep} icon={FileText} label="البيانات الأساسية" />
          <StepIndicator step={2} currentStep={formStep} icon={Users} label="المشاركون والبيئة" />
          <StepIndicator step={3} currentStep={formStep} icon={Target} label="آلية اللعب" />
          <StepIndicator step={4} currentStep={formStep} icon={ImageIcon} label="الوسائط والمجتمع" />
       </div>

       <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {formStep === 1 && (
              <FormSection title="البيانات التعريفية">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">اسم اللعبة الرسمي</label>
                       <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] focus:ring-1 focus:ring-[#AB9F80] outline-none transition-all" 
                        placeholder="مثال: الركض بالحاجبين المرفوعين" 
                        value={newGameData.name}
                        onChange={(e) => setNewGameData({...newGameData, name: e.target.value})}
                       />
                       <p className="text-xs text-gray-400 mt-1">الاسم الأكثر شيوعاً وتداولاً في المراجع المعتمدة (بدون ألقاب).</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">الدولة</label>
                       <select 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none"
                        value={newGameData.country}
                        onChange={(e) => setNewGameData({...newGameData, country: e.target.value})}
                       >
                          <option value="">اختر الدولة...</option>
                          <option value="المملكة الأردنية الهاشمية">المملكة الأردنية الهاشمية</option>
                          <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                          <option value="مملكة البحرين">مملكة البحرين</option>
                          <option value="الجمهورية التونسية">الجمهورية التونسية</option>
                          <option value="الجمهورية الجزائرية">الجمهورية الجزائرية</option>
                          <option value="جمهورية جيبوتي">جمهورية جيبوتي</option>
                          <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                          <option value="جمهورية السودان">جمهورية السودان</option>
                          <option value="الجمهورية العربية السورية">الجمهورية العربية السورية</option>
                          <option value="جمهورية الصومال">جمهورية الصومال</option>
                          <option value="جمهورية العراق">جمهورية العراق</option>
                          <option value="سلطنة عمان">سلطنة عمان</option>
                          <option value="دولة فلسطين">دولة فلسطين</option>
                          <option value="دولة قطر">دولة قطر</option>
                          <option value="جزر القمر">جزر القمر</option>
                          <option value="دولة الكويت">دولة الكويت</option>
                          <option value="الجمهورية اللبنانية">الجمهورية اللبنانية</option>
                          <option value="دولة ليبيا">دولة ليبيا</option>
                          <option value="جمهورية مصر العربية">جمهورية مصر العربية</option>
                          <option value="المملكة المغربية">المملكة المغربية</option>
                          <option value="الجمهورية الإسلامية الموريتانية">الجمهورية الإسلامية الموريتانية</option>
                          <option value="الجمهورية اليمنية">الجمهورية اليمنية</option>
                       </select>
                       <p className="text-xs text-gray-400 mt-1">الدولة التي تم توثيق اللعبة فيها (أو منشأها الأصلي).</p>
                    </div>
                    <div className="col-span-full space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">الإقليم / نطاق الانتشار</label>
                       <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none" 
                        placeholder="مثال: الفرجان القديمة (الدوحة، الوكرة، الخور)" 
                        value={newGameData.region}
                        onChange={(e) => setNewGameData({...newGameData, region: e.target.value})}
                       />
                       <p className="text-xs text-gray-400 mt-1">المدينة، الحي، أو المنطقة الجغرافية المحددة (مثل: نجد، الحجاز، الساحل).</p>
                    </div>
                    <div className="col-span-full space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">مجال التراث</label>
                       <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none" 
                        placeholder="مثال: الألعاب الشعبية - الممارسات الاجتماعية والطقوس" 
                        value={newGameData.heritageField}
                        onChange={(e) => setNewGameData({...newGameData, heritageField: e.target.value})}
                       />
                       <p className="text-xs text-gray-400 mt-1">تصنيف اليونسكو أو التصنيف المحلي المعتمد (فنون أداء، طقوس، إلخ).</p>
                    </div>
                    <div className="col-span-full space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">المسميات المحلية / البديلة</label>
                       <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none" 
                        placeholder="افصل بين المسميات بفاصلة..." 
                        value={newGameData.localNames}
                        onChange={(e) => setNewGameData({...newGameData, localNames: e.target.value})}
                       />
                       <p className="text-xs text-gray-400 mt-1">أي أسماء أخرى تُعرف بها اللعبة في مناطق أو لهجات مختلفة.</p>
                    </div>
                    <div className="col-span-full space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">تاجات التصنيف</label>
                       <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#AB9F80] outline-none" 
                        placeholder="افصل بين التاجات بفاصلة..." 
                        value={newGameData.tags}
                        onChange={(e) => setNewGameData({...newGameData, tags: e.target.value})}
                       />
                       <p className="text-xs text-gray-400 mt-1">كلمات مفتاحية للبحث (مثل: #حركية، #ذكور، #صيفية).</p>
                    </div>
                    <div className="col-span-full space-y-2">
                       <label className="text-sm font-bold text-[#061D14]">الوصف الموسع</label>
                       <textarea 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 focus:border-[#AB9F80] outline-none resize-none" 
                        placeholder="شرح مفصل لطبيعة اللعبة وفكرتها..."
                        value={newGameData.description}
                        onChange={(e) => setNewGameData({...newGameData, description: e.target.value})}
                       ></textarea>
                       <p className="text-xs text-gray-400 mt-1">شرح شامل لفكرة اللعبة، الهدف منها، وطبيعتها العامة.</p>
                    </div>
                 </div>
              </FormSection>
            )}

            {formStep === 2 && (
              <FormSection title="تفاصيل المشاركين وبيئة اللعب">
                <div className="space-y-6">
                    {/* Age Group */}
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">الفئة العمرية</label>
                           <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl" 
                            placeholder="مثال: 9 - 12 سنة (الطفولة المتوسطة)" 
                            value={newGameData.ageGroup}
                            onChange={(e) => setNewGameData({...newGameData, ageGroup: e.target.value})}
                           />
                           <p className="text-xs text-gray-400 mt-1">النطاق العمري المناسب (أطفال، يافعين، بالغين).</p>
                        </div>
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">تفاصيل الفئة العمرية</label>
                           <textarea 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl h-[50px] resize-none" 
                            placeholder="شرح لسبب ملائمة هذه الفئة..."
                            value={newGameData.ageGroupDetails}
                            onChange={(e) => setNewGameData({...newGameData, ageGroupDetails: e.target.value})}
                           ></textarea>
                           <p className="text-xs text-gray-400 mt-1">توضيح المهارات المطلوبة لهذه الفئة.</p>
                        </div>
                    </div>

                    {/* Practitioners */}
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">نوع الممارسين</label>
                           <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl" 
                            placeholder="مثال: مختلط (ذكور وإناث)" 
                            value={newGameData.practitioners}
                            onChange={(e) => setNewGameData({...newGameData, practitioners: e.target.value})}
                           />
                           <p className="text-xs text-gray-400 mt-1">ذكور، إناث، أو مختلط.</p>
                        </div>
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">تفاصيل نوع الممارسين</label>
                           <textarea 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl h-[50px] resize-none" 
                            placeholder="توضيح حول جنس اللاعبين..."
                            value={newGameData.practitionersDetails}
                            onChange={(e) => setNewGameData({...newGameData, practitionersDetails: e.target.value})}
                           ></textarea>
                           <p className="text-xs text-gray-400 mt-1">أي ملاحظات اجتماعية حول الممارسة.</p>
                        </div>
                    </div>

                    {/* Players Count */}
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">عدد اللاعبين</label>
                           <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl" 
                            placeholder="مثال: 3 - 10 لاعبين (جماعية)" 
                            value={newGameData.players}
                            onChange={(e) => setNewGameData({...newGameData, players: e.target.value})}
                           />
                           <p className="text-xs text-gray-400 mt-1">فردية، ثنائية، أو جماعية (مع العدد).</p>
                        </div>
                        <div className="col-span-full md:col-span-1 space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">تفاصيل عدد اللاعبين</label>
                           <textarea 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl h-[50px] resize-none" 
                            placeholder="الحد الأدنى والأقصى..."
                            value={newGameData.playersDetails}
                            onChange={(e) => setNewGameData({...newGameData, playersDetails: e.target.value})}
                           ></textarea>
                           <p className="text-xs text-gray-400 mt-1">تقسيم الفرق وتوزيع الأدوار.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Environment & Tools */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-[#061D14]">الأدوات والمستلزمات</label>
                           <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" 
                            placeholder="أضف الأدوات مفصولة بفاصلة..." 
                            value={newGameData.tools}
                            onChange={(e) => setNewGameData({...newGameData, tools: e.target.value})}
                           />
                           <p className="text-xs text-gray-400 mt-1">الأدوات المادية المطلوبة (عصا، حجارة، حبل، أو 'لا يوجد').</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-sm font-bold text-[#061D14]">المكان</label>
                              <input 
                                type="text" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" 
                                placeholder="مثال: السكيك (الأزقة) أو الحوي" 
                                value={newGameData.environment}
                                onChange={(e) => setNewGameData({...newGameData, environment: e.target.value})}
                              />
                              <p className="text-xs text-gray-400 mt-1">البيئة المثالية للعب (رملية، ساحة، داخل المنزل).</p>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-bold text-[#061D14]">الوقت</label>
                              <input 
                                type="text" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" 
                                placeholder="مثال: النهار (العصر)" 
                                value={newGameData.timing}
                                onChange={(e) => setNewGameData({...newGameData, timing: e.target.value})}
                              />
                              <p className="text-xs text-gray-400 mt-1">الزمان المفضل (نهار، ليل، موسم معين).</p>
                           </div>
                        </div>
                    </div>
                </div>
              </FormSection>
            )}

            {formStep === 3 && (
               <FormSection title="القواعد وآلية اللعب">
                 <div className="space-y-6">
                    {/* Rules */}
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-[#061D14]">القواعد وطريقة اللعب (خطوات متسلسلة)</label>
                         <button 
                            className="text-xs text-[#AB9F80] font-bold hover:underline"
                            onClick={() => setNewGameData({...newGameData, rules: [...newGameData.rules, ""]})}
                         >
                            + إضافة خطوة
                         </button>
                       </div>
                       {newGameData.rules.map((rule, i) => (
                         <div key={i} className="flex gap-3">
                            <span className="w-8 h-8 flex-shrink-0 bg-[#061D14]/5 text-[#061D14] rounded-lg flex items-center justify-center font-bold text-sm">{i+1}</span>
                            <textarea 
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none h-12" 
                                value={rule}
                                onChange={(e) => {
                                    const updatedRules = [...newGameData.rules];
                                    updatedRules[i] = e.target.value;
                                    setNewGameData({...newGameData, rules: updatedRules});
                                }}
                            />
                         </div>
                       ))}
                       <p className="text-xs text-gray-400 mt-1">الخطوات المتسلسلة لطريقة اللعب من البداية للنهاية.</p>
                    </div>

                    {/* Mechanisms */}
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-[#061D14]">نظام الفوز والخسارة</label>
                          <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none" 
                            placeholder="الفوز: ... الخسارة: ..."
                            value={newGameData.winLoss}
                            onChange={(e) => setNewGameData({...newGameData, winLoss: e.target.value})}
                          ></textarea>
                          <p className="text-xs text-gray-400 mt-1">كيف يتم تحديد الفائز والخاسر.</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-[#061D14]">آلية البدء والانتهاء</label>
                          <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none" 
                            placeholder="البدء: ... الانتهاء: ..."
                            value={newGameData.startEnd}
                            onChange={(e) => setNewGameData({...newGameData, startEnd: e.target.value})}
                          ></textarea>
                          <p className="text-xs text-gray-400 mt-1">طريقة إجراء القرعة وكيف تنتهي اللعبة.</p>
                       </div>
                    </div>
                 </div>
               </FormSection>
            )}

            {formStep === 4 && (
               <FormSection title="الموروث الشفهي والوسائط">
                  <div className="space-y-6">
                     
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-[#061D14]">السياق الاجتماعي (Social Function)</label>
                        <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:border-[#AB9F80] outline-none" 
                            placeholder="مثال: ضبط النفس، الذكاء العاطفي..."
                            value={newGameData.socialContext}
                            onChange={(e) => setNewGameData({...newGameData, socialContext: e.target.value})}
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-1">القيم التربوية، الاجتماعية، أو النفسية التي تعززها اللعبة.</p>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-[#061D14]">أهازيج ومصطلحات</label>
                        <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-20 focus:border-[#AB9F80] outline-none" 
                            placeholder="اكتب الصيحات أو الأغاني المرافقة..."
                            value={newGameData.oralTradition}
                            onChange={(e) => setNewGameData({...newGameData, oralTradition: e.target.value})}
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-1">الأهازيج، الأناشيد، أو العبارات التي تقال أثناء اللعب.</p>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-[#061D14]">المصادر والمراجع</label>
                        <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-20 focus:border-[#AB9F80] outline-none" 
                            placeholder="مثال: سلسلة الألعاب الشعبية القطرية - كتارا"
                            value={newGameData.references}
                            onChange={(e) => setNewGameData({...newGameData, references: e.target.value})}
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-1">الكتب، الدراسات، أو الرواة الذين تم الاستناد إليهم.</p>
                     </div>

                     <div className="border-t border-gray-200 my-4"></div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-[#061D14] mb-2 block">صورة توضيحية للعبة</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#AB9F80] hover:bg-gray-50 transition-colors cursor-pointer group">
                           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#AB9F80]/20 group-hover:text-[#AB9F80] text-gray-400 transition-colors">
                              <UploadCloud className="w-8 h-8" />
                           </div>
                           <h4 className="font-bold text-[#061D14]">ارفع صور اللعبة هنا</h4>
                           <p className="text-sm text-gray-500 mt-2">أو اسحب وأفلت الملفات (JPG, PNG)</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">يفضل صور عالية الدقة توضح طريقة اللعب.</p>
                     </div>

                     <div className="flex items-center gap-2 mt-6">
                        <input type="checkbox" id="certify" className="w-4 h-4 text-[#061D14] rounded focus:ring-[#AB9F80]" />
                        <label htmlFor="certify" className="text-sm text-gray-600">أقر بصحة البيانات المدخلة ومسؤوليتي عن دقة التوثيق.</label>
                     </div>
                  </div>
               </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
               {formStep > 1 ? (
                  <button 
                     onClick={() => setFormStep(prev => prev - 1)}
                     className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                     السابق
                  </button>
               ) : <div></div>}
               
               {formStep < 4 ? (
                  <button 
                     onClick={() => setFormStep(prev => prev + 1)}
                     className="px-8 py-3 rounded-xl bg-[#061D14] text-white font-bold hover:bg-[#134232] transition-colors flex items-center gap-2"
                  >
                     التالي <ArrowLeft className="w-4 h-4" />
                  </button>
               ) : (
                  <button 
                     className="px-8 py-3 rounded-xl bg-[#AB9F80] text-[#061D14] font-bold hover:bg-[#C9B892] transition-colors flex items-center gap-2 shadow-lg shadow-[#AB9F80]/20"
                     onClick={() => {
                        alert("تم إرسال اللعبة للمراجعة بنجاح!");
                        setActiveTab('dashboard');
                        setFormStep(1);
                     }}
                  >
                     <Save className="w-4 h-4" /> حفظ وإرسال
                  </button>
               )}
            </div>

          </div>

          {/* Sidebar Guidelines */}
          <div className="hidden lg:block space-y-6 sticky top-24">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-[#061D14] mb-4 flex items-center gap-2">
                   <Brain className="w-5 h-5 text-[#AB9F80]" /> نصائح التوثيق
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                   <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> تأكد من كتابة الاسم المحلي الشائع بدقة.</li>
                   <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> صف قواعد اللعبة بتسلسل منطقي.</li>
                   <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> الصور عالية الجودة تزيد من قيمة التوثيق.</li>
                </ul>
             </div>

             <div className="bg-[#f8f6f3] p-6 rounded-2xl border border-[#e5e7eb]">
                <h4 className="font-bold text-[#061D14] mb-2 text-sm">حالة المسودة</h4>
                <p className="text-xs text-gray-500 mb-4">يتم حفظ التغييرات تلقائياً</p>
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                   <Check className="w-3 h-3" /> تم الحفظ: منذ دقيقة
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}