// Seed data for Traditional Games Glossary
// Extracted from existing JSX files: TraditionalGamesGlossaryHOME.jsx and Dashbord.jsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed process for Traditional Games Glossary...')

  // Clear existing data (in development only) - Keep users!
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data (keeping users)...')
    // Delete in correct order to respect foreign key constraints
    // Keep Contributors - only delete games and related data
    await prisma.systemLog.deleteMany()
    await prisma.reviewLog.deleteMany()
    await prisma.gameSimilarity.deleteMany()
    await prisma.gameConcept.deleteMany()
    await prisma.gameTag.deleteMany()
    await prisma.media.deleteMany()
    await prisma.reference.deleteMany()
    await prisma.game.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.heritageField.deleteMany()
    await prisma.country.deleteMany()
    // Note: Contributors are kept to preserve user accounts
  }

  // ==================== COUNTRIES ====================
  console.log('🗺️  Seeding countries...')
  
  const countries = await prisma.country.createMany({
    data: [
      {
        name: 'دولة قطر',
        isoCode: 'QA',
        region: 'الخليج',
        description: 'دولة عربية تقع في شرق شبه الجزيرة العربية في جنوب غرب آسيا'
      },
      {
        name: 'الإمارات العربية المتحدة',
        isoCode: 'AE',
        region: 'الخليج',
        description: 'دولة اتحادية تقع في شرق شبه الجزيرة العربية في جنوب غرب آسيا'
      },
      {
        name: 'جمهورية العراق',
        isoCode: 'IQ',
        region: 'بلاد الشام',
        description: 'دولة عربية تقع في غرب آسيا'
      },
      {
        name: 'دولة الكويت',
        isoCode: 'KW',
        region: 'الخليج',
        description: 'دولة عربية تقع في الشرق الأوسط في جنوب غرب آسيا'
      },
      {
        name: 'المملكة العربية السعودية',
        isoCode: 'SA',
        region: 'الخليج',
        description: 'أكبر دولة في الشرق الأوسط وتقع في جنوب غرب آسيا'
      },
      {
        name: 'سلطنة عمان',
        isoCode: 'OM',
        region: 'الخليج',
        description: 'دولة عربية تقع في غرب آسيا'
      },
      {
        name: 'مملكة البحرين',
        isoCode: 'BH',
        region: 'الخليج',
        description: 'دولة عربية تقع في الخليج العربي'
      },
      {
        name: 'الجمهورية العربية السورية',
        isoCode: 'SY',
        region: 'بلاد الشام',
        description: 'دولة عربية تقع في غرب آسيا'
      },
      {
        name: 'المملكة الأردنية الهاشمية',
        isoCode: 'JO',
        region: 'بلاد الشام',
        description: 'دولة عربية تقع في جنوب غرب آسيا'
      },
      {
        name: 'جمهورية مصر العربية',
        isoCode: 'EG',
        region: 'وادي النيل',
        description: 'دولة عربية تقع في الركن الشمالي الشرقي من أفريقيا'
      },
      {
        name: 'الجمهورية الجزائرية',
        isoCode: 'DZ',
        region: 'المغرب العربي',
        description: 'أكبر دولة عربية وإفريقية من حيث المساحة'
      },
      {
        name: 'المملكة المغربية',
        isoCode: 'MA',
        region: 'المغرب العربي',
        description: 'دولة عربية تقع في أقصى غرب شمال أفريقيا'
      },
      {
        name: 'الجمهورية التونسية',
        isoCode: 'TN',
        region: 'المغرب العربي',
        description: 'دولة عربية تقع في شمال أفريقيا'
      },
      {
        name: 'الجمهورية اللبنانية',
        isoCode: 'LB',
        region: 'بلاد الشام',
        description: 'دولة عربية تقع في غرب آسيا'
      },
      {
        name: 'دولة فلسطين',
        isoCode: 'PS',
        region: 'بلاد الشام',
        description: 'دولة عربية تقع في غرب آسيا'
      },
      {
        name: 'الجمهورية اليمنية',
        isoCode: 'YE',
        region: 'الخليج',
        description: 'دولة عربية تقع في جنوب غرب آسيا'
      },
      {
        name: 'جمهورية السودان',
        isoCode: 'SD',
        region: 'وادي النيل',
        description: 'دولة عربية تقع في شمال شرق أفريقيا'
      },
      {
        name: 'دولة ليبيا',
        isoCode: 'LY',
        region: 'المغرب العربي',
        description: 'دولة عربية تقع في شمال أفريقيا'
      },
      {
        name: 'الجمهورية الإسلامية الموريتانية',
        isoCode: 'MR',
        region: 'المغرب العربي',
        description: 'دولة عربية تقع في شمال غرب أفريقيا'
      },
      {
        name: 'جمهورية الصومال',
        isoCode: 'SO',
        region: 'القرن الأفريقي',
        description: 'دولة عربية تقع في القرن الأفريقي'
      },
      {
        name: 'جمهورية جيبوتي',
        isoCode: 'DJ',
        region: 'القرن الأفريقي',
        description: 'دولة عربية تقع في القرن الأفريقي'
      },
      {
        name: 'جزر القمر',
        isoCode: 'KM',
        region: 'المحيط الهندي',
        description: 'دولة عربية تقع في المحيط الهندي'
      }
    ],
    skipDuplicates: true
  })

  // ==================== HERITAGE FIELDS ====================
  console.log('🏛️  Seeding heritage fields (UNESCO-aligned)...')
  
  const heritageFields = await prisma.heritageField.createMany({
    data: [
      {
        name: 'الألعاب الشعبية - الممارسات الاجتماعية والطقوس',
        category: 'الممارسات الاجتماعية والطقوس والمناسبات الاحتفالية',
        description: 'الألعاب التي تمارس في سياقات اجتماعية وطقسية'
      },
      {
        name: 'الألعاب الذهنية',
        category: 'المعارف والممارسات المتعلقة بالطبيعة والكون',
        description: 'الألعاب التي تعتمد على التفكير الاستراتيجي والحساب'
      },
      {
        name: 'الألعاب الحركية',
        category: 'الفنون الأدائية',
        description: 'الألعاب التي تعتمد على الحركة الجسدية والمهارات الحركية'
      },
      {
        name: 'ألعاب البنات',
        category: 'الممارسات الاجتماعية والطقوس',
        description: 'الألعاب التقليدية التي تمارسها الفتيات'
      },
      {
        name: 'الألعاب البحرية',
        category: 'المعارف والممارسات المتعلقة بالطبيعة والكون',
        description: 'الألعاب المرتبطة بحياة البحارة والغواصين'
      },
      {
        name: 'الألعاب الطريفة/الفكاهية',
        category: 'الفنون الأدائية',
        description: 'الألعاب التي تعتمد على الفكاهة والمرح'
      }
    ],
    skipDuplicates: true
  })

  // ==================== TAGS ====================
  console.log('🏷️  Seeding tags...')
  
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'تراث خليجي', category: 'جغرافي', description: 'ألعاب من دول الخليج العربي' },
      { name: 'تراث عراقي', category: 'جغرافي', description: 'ألعاب من العراق' },
      { name: 'ألعاب حركية', category: 'نوعي', description: 'ألعاب تعتمد على الحركة الجسدية' },
      { name: 'ألعاب ذهنية', category: 'نوعي', description: 'ألعاب تعتمد على التفكير والاستراتيجية' },
      { name: 'ألعاب طريفة', category: 'نوعي', description: 'ألعاب فكاهية ومسلية' },
      { name: 'ألعاب بحرية', category: 'نوعي', description: 'ألعاب مرتبطة بالبحر والغوص' },
      { name: 'ألعاب شعبية', category: 'تراثي', description: 'ألعاب تقليدية شعبية' },
      { name: 'ألعاب الأطفال', category: 'ديموغرافي', description: 'ألعاب مخصصة للأطفال' },
      { name: 'ألعاب الذكور', category: 'ديموغرافي', description: 'ألعاب يمارسها الذكور تقليدياً' },
      { name: 'ألعاب الإناث', category: 'ديموغرافي', description: 'ألعاب تمارسها الإناث تقليدياً' },
      { name: 'ألعاب مختلطة', category: 'ديموغرافي', description: 'ألعاب يمارسها الجنسان' },
      { name: 'ألعاب جماعية', category: 'نوعي', description: 'ألعاب تمارس في مجموعات' },
      { name: 'ألعاب ثنائية', category: 'نوعي', description: 'ألعاب بين لاعبين فقط' },
      { name: 'ألعاب الصيف', category: 'زمني', description: 'ألعاب تمارس في الصيف' },
      { name: 'ألعاب الشتاء', category: 'زمني', description: 'ألعاب تمارس في الشتاء' },
      { name: 'ألعاب النهار', category: 'زمني', description: 'ألعاب تمارس في النهار' },
      { name: 'ألعاب الليل', category: 'زمني', description: 'ألعاب تمارس في الليل' }
    ],
    skipDuplicates: true
  })

  // ==================== CONTRIBUTORS ====================
  console.log('👥 Checking contributors (keeping existing users)...')
  
  // Get or create admin contributor
  let adminContributor = await prisma.contributor.findFirst({ 
    where: { email: 'admin@traditionalgames.org' } 
  })
  
  if (!adminContributor) {
    adminContributor = await prisma.contributor.create({
      data: {
        name: 'مدير النظام',
        email: 'admin@traditionalgames.org',
        role: 'admin',
        institution: 'مشروع مسرد الألعاب التراثية',
        bio: 'مدير النظام والمسؤول عن إدارة الأرشيف الرقمي'
      }
    })
    console.log('✅ Created admin contributor')
  } else {
    console.log('✅ Admin contributor already exists')
  }

  // Get or create editor contributor
  let editorContributor = await prisma.contributor.findFirst({ 
    where: { email: 'researcher@traditionalgames.org' } 
  })
  
  if (!editorContributor) {
    editorContributor = await prisma.contributor.create({
      data: {
        name: 'باحث تراثي',
        email: 'researcher@traditionalgames.org',
        role: 'editor',
        institution: 'مركز التراث الشعبي',
        bio: 'باحث متخصص في توثيق الألعاب الشعبية العربية'
      }
    })
    console.log('✅ Created editor contributor')
  } else {
    console.log('✅ Editor contributor already exists')
  }

  // ==================== GAMES ====================
  console.log('🎮 Seeding games from JSX files...')
  
  // Get references for foreign keys
  const qatar = await prisma.country.findFirst({ where: { name: 'دولة قطر' } })
  const uae = await prisma.country.findFirst({ where: { name: 'الإمارات العربية المتحدة' } })
  const iraq = await prisma.country.findFirst({ where: { name: 'جمهورية العراق' } })
  const kuwait = await prisma.country.findFirst({ where: { name: 'دولة الكويت' } })
  const bahrain = await prisma.country.findFirst({ where: { name: 'مملكة البحرين' } })
  
  const heritageSocial = await prisma.heritageField.findFirst({ 
    where: { name: 'الألعاب الشعبية - الممارسات الاجتماعية والطقوس' } 
  })
  const heritageMental = await prisma.heritageField.findFirst({ 
    where: { name: 'الألعاب الذهنية' } 
  })
  const heritageMovement = await prisma.heritageField.findFirst({ 
    where: { name: 'الألعاب الحركية' } 
  })
  const heritageGirls = await prisma.heritageField.findFirst({ 
    where: { name: 'ألعاب البنات' } 
  })

  // Helper function to create slug from Arabic name
  function createSlug(name: string): string {
    return name
      .replace(/[^\u0600-\u06FF\s]/g, '') // Keep Arabic letters and spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()
  }

  // Game 1: الركض بالحاجبين المرفوعين (from JSX) - with all new fields
  const game1 = await prisma.game.create({
    data: {
      canonicalName: 'الركض بالحاجبين المرفوعين',
      englishName: 'Running with Raised Eyebrows',
      localNames: ['سباق المبهّتين', 'لعبة العيون الكبار'],
      slug: createSlug('الركض بالحاجبين المرفوعين'),
      countryId: qatar!.id,
      region: 'الفرجان القديمة (الدوحة، الوكرة، الخور) - الأحياء الحضرية والسكيك',
      geoCoordinates: { lat: 25.2854, lng: 51.5310 },
      heritageFieldId: heritageSocial!.id,
      gameType: 'فكاهة / حركية / سباق معوقات جسدية',
      ageGroup: '9 - 12 سنة (الطفولة المتوسطة)',
      ageGroupDetails: 'العمر الذي يمتلك فيه الطفل القدرة على "فصل الحواس" والتحكم المستقل في عضلات الوجه مع تقبل الفكاهة.',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'لعبة مقبولة اجتماعياً للجنسين؛ تُلعب في "الحوي" للفتيات وفي "السكيك" للأولاد.',
      playersCount: '3 - 10 لاعبين (سباق جماعي)',
      playersDetails: 'يبدأ من 3 أطفال، والعدد الكبير يزيد من صعوبة اللعبة بسبب "عدوى الضحك".',
      tools: ['لا يوجد (الجسد فقط - التركيز على عضلات الوجه والجبهة)'],
      environment: 'السكيك (الأزقة) أو الحوي (فناء المنزل)؛ بشرط أن تكون الأرضية مستوية.',
      timing: 'النهار (العصر)؛ لضمان وضوح الرؤية للحكم والمراقبين.',
      description: `تمرين في 'فصل الحواس' يكسر الفطرة البشرية التي تميل لتقطيب الجبين عند الركض. يركض الطفل بأقصى سرعة مع الحفاظ على وضعية 'الدهشة القصوى'، مما يخلق مشهداً كوميدياً يجمع بين جدية الجسد وذهول الوجه.`,
      rules: [
        'يصطف المتسابقون عند خط البداية.',
        'وضع الاستعداد: رفع الحواجب لأقصى حد وتثبيتها قبل الانطلاق.',
        'الركض بسرعة قصوى دون إنزال الحاجبين.',
        'المراقبة: من يخفض حاجبيه يُستبعد فوراً أو يتوقف لإعادة رفعهما.',
        'الفوز لمن يصل خط النهاية أولاً وحواجبه مرفوعة.'
      ],
      winLossSystem: 'الفوز: يعتمد على السرعة والتحكم العضلي (لقب صاحب العيون القوية).\nالخسارة: غالباً ما تحدث بسبب الضحك الذي يؤدي لارتخاء العضلات.',
      startEndMechanism: 'البدء: بالقرعة وتفتيش "جاهزية الوجوه".\nالانتهاء: بوصول أول متسابق أو استسلام الجميع من الضحك.',
      oralTradition: 'صيحات تشويش مثل: "نزلت! نزلت!"، "ارفع عينك!"، "شوف وراك!" (لإرغام اللاعب على فقدان التركيز).',
      socialContext: '1. ضبط النفس (Self-Control) والرزانة.\n2. الذكاء العاطفي وفصل الجهد البدني عن التعبير الوجهي.\n3. الترفيه الجماعي وكسر الجليد.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 2: الهالوسة (المنقلة)
  const game2 = await prisma.game.create({
    data: {
      canonicalName: 'الهالوسة (المنقلة)',
      englishName: 'Mancala (Halusa)',
      localNames: ['الأيلة', 'الحويلس', 'أم السبع', 'المنقلة'],
      slug: createSlug('الهالوسة المنقلة'),
      countryId: qatar!.id,
      region: 'الجزيرة العربية والشام وأفريقيا - مناطق ساحلية وبدوية',
      geoCoordinates: { lat: 25.2048, lng: 51.5400 },
      heritageFieldId: heritageMental!.id,
      gameType: 'ذهنية / استراتيجية / حسابية',
      ageGroup: '12 سنة فما فوق (الأطفال والبالغين)',
      ageGroupDetails: 'تتطلب قدرة على العد والحساب الذهني والتفكير الاستراتيجي، لذا يفضل أن يكون اللاعبون في سن المدرسة أو أكبر.',
      practitioners: 'الذكور (غالباً)',
      practitionersDetails: 'لعبة تقليدية يمارسها الرجال والغواصون في المجالس والساحات العامة، لكن يمكن للنساء ممارستها في المنازل.',
      playersCount: '2 لاعبين (ثنائية)',
      playersDetails: 'لعبة ثنائية بالكامل، كل لاعب يتحكم في صف من الحفر (6-7 حفر حسب المنطقة).',
      tools: ['حفر في الرمل (كون)', 'حصى (صبان) - 48 حصاة عادة'],
      environment: 'رمال الشاطئ والمجالس التقليدية والساحات المفتوحة',
      timing: 'نهاراً أو ليلاً - في أوقات الفراغ والاستراحة',
      description: 'لعبة حسابية استراتيجية عريقة تعتمد على نقل الحصى أو الصبان بين الحفر بنظام دقيق. ارتبطت قديماً بحياة الغواصين لقتل الوقت أثناء الرحلات البحرية الطويلة. تعتبر من أقدم الألعاب الذهنية في العالم.',
      rules: [
        'توزيع 48 حصاة بالتساوي في 12 حفرة (6 لكل لاعب).',
        'اللاعب الأول يختار حفرة من صفه ويأخذ كل الحصى منها.',
        'نقل الحصى عكس عقارب الساعة، حصاة واحدة في كل حفرة.',
        'إذا سقطت آخر حصاة في حفرة تحتوي على حصى، يأخذها اللاعب ويستمر.',
        'نظام "الأكل": إذا سقطت الحصاة في حفرة فارغة في صف الخصم، يأكل اللاعب الحصى من الحفرة المقابلة.',
        'الفوز لمن يجمع أكبر عدد من الحصى.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يجمع أكثر من 24 حصاة يفوز باللعبة.\nالخسارة: من يجمع أقل من 24 حصاة يخسر. في بعض المناطق، من ينفذ حصاه أولاً يخسر.',
      startEndMechanism: 'البدء: بالقرعة أو الاتفاق بين اللاعبين.\nالانتهاء: عندما ينفذ أحد اللاعبين من الحصى أو عندما يتضح الفائز.',
      oralTradition: 'أهازيج: "حولس حواليس" عند نقل الحصى، "كل واشبع" عند الأكل، "يا بحر يا بحر" عند اللعب على الشاطئ.',
      socialContext: '1. تطوير المهارات الحسابية والاستراتيجية.\n2. تقوية الذاكرة والتركيز.\n3. تعزيز الروابط الاجتماعية في المجالس.\n4. الحفاظ على التراث الثقافي البحري.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 3: التيلة
  const game3 = await prisma.game.create({
    data: {
      canonicalName: 'التيلة',
      englishName: 'Marbles (Tila)',
      localNames: ['الكرات الزجاجية', 'المصاقيل', 'البرجون', 'البلي'],
      slug: createSlug('التيلة'),
      countryId: uae!.id,
      region: 'الخليج والعراق ومعظم الدول العربية - المناطق الحضرية والريفية',
      geoCoordinates: { lat: 24.4539, lng: 54.3773 },
      heritageFieldId: heritageMovement!.id,
      gameType: 'حركية / دقة / تصويب',
      ageGroup: '7 - 15 سنة (الطفولة والمراهقة المبكرة)',
      ageGroupDetails: 'تتطلب تنسيقاً بين اليد والعين ودقة في التصويب، لذا تناسب الأطفال الذين طوروا المهارات الحركية الدقيقة.',
      practitioners: 'الذكور (غالباً)',
      practitionersDetails: 'لعبة تقليدية للأولاد في الأحياء الشعبية والساحات، لكن يمكن للبنات ممارستها في بعض المناطق.',
      playersCount: '2 - 6 لاعبين (جماعية)',
      playersDetails: 'يمكن لعبها ثنائياً أو في مجموعات، كل لاعب يحتفظ بمجموعة من التيل الخاصة به.',
      tools: ['كرات زجاجية ملونة (تيل)', 'حفر صغيرة في الرمل (كون)', 'خط البداية'],
      environment: 'الساحات الرملية والأزقة والأراضي الفضاء',
      timing: 'النهار (بعد الظهر) - يحتاج إضاءة جيدة للرؤية',
      description: 'لعبة تعتمد على دقة التصويب بكرات زجاجية ملونة لإدخالها في حفر مخصصة أو ضرب تيلة الخصم. تعتبر من أشهر ألعاب الأطفال في العالم العربي وتطور مهارات التصويب والدقة.',
      rules: [
        'تجهيز الحفر: حفر 3-5 حفر صغيرة في الرمل على مسافات متدرجة.',
        'خط البداية: يرسم خط على بعد 2-3 أمتار من الحفر.',
        'الرمي: كل لاعب يرمي تيلته من خط البداية محاولاً إدخالها في الحفر.',
        'صيد التيل: إذا ضربت تيلتك تيلة خصم، تأخذها.',
        'الفوز: من يدخل تيلته في جميع الحفر أولاً أو يجمع أكبر عدد من التيل.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يدخل تيلته في جميع الحفر أولاً أو يجمع أكبر عدد من التيل من الخصوم.\nالخسارة: من يفقد جميع تيله أو لا يتمكن من إكمال المسار.',
      startEndMechanism: 'البدء: بالقرعة أو "حجر ورقة مقص" لتحديد من يبدأ.\nالانتهاء: عندما يكمل أحد اللاعبين المسار أو عندما ينفذ الجميع من التيل.',
      oralTradition: 'صيحات: "تيل!" عند إصابة الهدف، "صيد!" عند أخذ تيلة الخصم، "كون!" عند إدخال التيلة في الحفرة.',
      socialContext: '1. تطوير مهارات التصويب والدقة.\n2. تعزيز المنافسة الشريفة.\n3. بناء الصداقات في الأحياء.\n4. تعلم الصبر والتركيز.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 4: الحالوسة (الشامية)
  const game4 = await prisma.game.create({
    data: {
      canonicalName: 'الحالوسة (الشامية)',
      englishName: 'Mancala (Shami Variant)',
      localNames: ['المنقلة', 'أعطي', 'الحالوسة'],
      slug: createSlug('الحالوسة الشامية'),
      countryId: iraq!.id,
      region: 'بلاد الشام والعراق - المناطق الحضرية والريفية',
      geoCoordinates: { lat: 33.3152, lng: 44.3661 },
      heritageFieldId: heritageMental!.id,
      gameType: 'ذهنية / استراتيجية / حسابية',
      ageGroup: '12 سنة فما فوق (المراهقة والبالغين)',
      ageGroupDetails: 'تتطلب نضجاً عقلياً وقدرة على التخطيط الاستراتيجي والتفكير المتقدم، لذا تناسب المراهقين والبالغين.',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'لعبة شعبية يمارسها الجميع في المجالس والمقاهي، لكنها أكثر شيوعاً بين الرجال في الأماكن العامة.',
      playersCount: '2 لاعبين (ثنائية)',
      playersDetails: 'لعبة ثنائية حصراً، كل لاعب يتحكم في صف من 7 حفر.',
      tools: ['لوح خشبي منحوت (14 حفرة)', 'حصى أو بذور (98 حبة عادة)'],
      environment: 'المجالس التقليدية والمقاهي الشعبية والبيوت',
      timing: 'ليلاً غالباً - في أوقات الاسترخاء والترفيه',
      description: 'لعبة استراتيجية حسابية عريقة تتكون من صفين من الحفر (7 حفر لكل لاعب). تعتبر من أقدم الألعاب الذهنية في المنطقة وتطور مهارات التفكير الاستراتيجي والعد الذهني.',
      rules: [
        'توزيع 98 حبة بالتساوي في 14 حفرة (7 لكل لاعب).',
        'اللاعب الأول يختار حفرة من صفه ويأخذ كل الحبات منها.',
        'نقل الحبات عكس عقارب الساعة، حبة واحدة في كل حفرة.',
        'إذا سقطت آخر حبة في حفرة تحتوي على حبات، يأخذها اللاعب ويستمر.',
        'نظام "الأكل": إذا سقطت الحبة في حفرة فارغة في صف الخصم، يأكل اللاعب الحبات من الحفرة المقابلة.',
        'الفوز لمن يجمع أكبر عدد من الحبات (أكثر من 49).'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يجمع أكثر من 49 حبة يفوز باللعبة.\nالخسارة: من يجمع أقل من 49 حبة يخسر. في بعض المناطق، من ينفذ حباته أولاً يخسر.',
      startEndMechanism: 'البدء: بالقرعة أو الاتفاق بين اللاعبين.\nالانتهاء: عندما ينفذ أحد اللاعبين من الحبات أو عندما يتضح الفائز بوضوح.',
      oralTradition: 'أهازيج: "حولس حواليس" عند نقل الحبات، "كل واشبع" عند الأكل، "يا منقلة يا منقلة" عند اللعب.',
      socialContext: '1. تطوير المهارات الحسابية والاستراتيجية.\n2. تقوية الذاكرة والتركيز.\n3. تعزيز الروابط الاجتماعية في المجالس.\n4. الحفاظ على التراث الثقافي الشامي.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 5: التوّاقيل
  const game5 = await prisma.game.create({
    data: {
      canonicalName: 'التوّاقيل',
      englishName: 'Stick and Wood Game (Tawageel)',
      localNames: ['الدعابل', 'الطمّـة', 'الطقاقيل'],
      slug: createSlug('التواقيل'),
      countryId: iraq!.id,
      region: 'بغداد والمحافظات الجنوبية - الأحياء الشعبية',
      geoCoordinates: { lat: 33.3152, lng: 44.3661 },
      heritageFieldId: heritageSocial!.id,
      gameType: 'شعبية / حركية / قوة',
      ageGroup: '8 - 14 سنة (الطفولة المتوسطة والمراهقة المبكرة)',
      ageGroupDetails: 'تتطلب قوة بدنية وتنسيقاً بين اليد والعين، لذا تناسب الأطفال الذين طوروا المهارات الحركية الكبيرة.',
      practitioners: 'الذكور (غالباً)',
      practitionersDetails: 'لعبة تقليدية للأولاد في الأحياء الشعبية، نادراً ما تمارسها البنات بسبب طبيعتها التنافسية القوية.',
      playersCount: 'فرق (4-8 لاعبين)',
      playersDetails: 'تُلعب في فرق من لاعبين أو أكثر، كل فريق يحاول ضرب التاق لأبعد مسافة.',
      tools: ['عصا صغيرة (30-40 سم)', 'قطعة خشبية صغيرة (تاق) - 5-7 سم'],
      environment: 'الساحات المفتوحة والأراضي الفضاء والأحياء الشعبية',
      timing: 'الربيع والصيف - في الأوقات المشمسة',
      description: 'لعبة تشبه البيسبول تعتمد على ضرب قطعة خشبية صغيرة بالعصا لإيصالها لأبعد مسافة. تعتبر من أشهر ألعاب الأولاد في العراق وتطور مهارات القوة والدقة.',
      rules: [
        'وضع التاق: يضع اللاعب التاق في حفرة صغيرة أو على حجر.',
        'الضرب بالعصا: يضرب اللاعب التاق بالعصا محاولاً إرساله لأبعد مسافة.',
        'احتساب المسافة: يقيس الفريق المسافة التي قطعها التاق.',
        'الفوز: الفريق الذي يضرب التاق لأبعد مسافة يفوز بالجولة.',
        'التبديل: يتناوب الفريقان في الضرب.'
      ],
      winLossSystem: 'الفوز: الفريق الذي يضرب التاق لأبعد مسافة في معظم الجولات.\nالخسارة: من يفشل في ضرب التاق أو يضربه لمسافة أقصر.',
      startEndMechanism: 'البدء: بالقرعة لتحديد من يبدأ.\nالانتهاء: بعد عدد محدد من الجولات أو عندما يتفق الفريقان على النهاية.',
      oralTradition: 'صيحات: "تاق!" عند الضرب، "يا بعيد!" عند الضرب لمسافة بعيدة، "يا قريب!" عند الضرب لمسافة قريبة.',
      socialContext: '1. تطوير مهارات القوة والدقة.\n2. تعزيز روح الفريق والمنافسة.\n3. بناء الصداقات في الأحياء.\n4. تعلم احترام القواعد والعدالة.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 6: الشَّبْحَة
  const game6 = await prisma.game.create({
    data: {
      canonicalName: 'الشَّبْحَة',
      englishName: 'Rubber Band Jumping (Shabha)',
      localNames: ['بنجو', 'نط الحبل', 'القفز على الحبل المطاطي'],
      slug: createSlug('الشبحة'),
      countryId: kuwait!.id,
      region: 'منطقة الخليج العربي - المناطق الحضرية',
      geoCoordinates: { lat: 29.3759, lng: 47.9774 },
      heritageFieldId: heritageGirls!.id,
      gameType: 'حركية / لياقة / إيقاعية',
      ageGroup: '6 - 12 سنة (الطفولة)',
      ageGroupDetails: 'تتطلب تنسيقاً حركياً وتوازناً، لذا تناسب الفتيات في سن المدرسة الابتدائية.',
      practitioners: 'إناث (غالباً)',
      practitionersDetails: 'لعبة تقليدية للبنات في الأفنية والمدارس، نادراً ما يمارسها الأولاد.',
      playersCount: '3 لاعبات (حد أدنى)',
      playersDetails: 'تحتاج لثلاث لاعبات على الأقل: اثنتان تمسكان الحبل وواحدة تقفز. يمكن أن يزيد العدد.',
      tools: ['حبل مطاطي طويل (3-4 أمتار)', 'مساحة مفتوحة'],
      environment: 'فناء المنزل/المدرسة والأماكن المغلقة الآمنة',
      timing: 'العصر - بعد المدرسة',
      description: 'لعبة حركية إيقاعية للبنات تعتمد على القفز داخل وخارج حبل مطاطي. تعتبر من أشهر ألعاب البنات في الخليج وتطور مهارات التوازن والتنسيق.',
      rules: [
        'تثبيت الحبل: تمسك لاعبتان الحبل المطاطي من الطرفين.',
        'القفز المتسلسل: تقفز اللاعبة داخل وخارج الحبل مع إيقاع معين.',
        'زيادة الارتفاع: يرفع الحبل تدريجياً من الكاحل إلى الركبة إلى الخصر.',
        'الفوز: من تقفز على أعلى مستوى دون لمس الحبل.',
        'الخسارة: من تلمس الحبل أو تفقد التوازن.'
      ],
      winLossSystem: 'الفوز: اللاعبة التي تقفز على أعلى مستوى (الخصر أو أعلى) دون لمس الحبل.\nالخسارة: من تلمس الحبل أو تفقد التوازن أو تسقط.',
      startEndMechanism: 'البدء: بالقرعة أو الاتفاق لتحديد من تبدأ.\nالانتهاء: عندما تفشل جميع اللاعبات أو عندما تصل إحداهن للمستوى الأعلى.',
      oralTradition: 'أهازيج: "شبحة شبحة" عند القفز، "يا عالي" عند رفع الحبل، "يا واطي" عند خفضه، أغاني إيقاعية مرافقة.',
      socialContext: '1. تطوير مهارات التوازن والتنسيق.\n2. تعزيز الصداقات بين البنات.\n3. تعلم الصبر والمثابرة.\n4. الحفاظ على التراث الثقافي للبنات.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 7: الكرابي (من مصر)
  const egypt = await prisma.country.findFirst({ where: { name: 'جمهورية مصر العربية' } })
  const game7 = await prisma.game.create({
    data: {
      canonicalName: 'الكرابي',
      englishName: 'Hopscotch (Krabi)',
      localNames: ['الكرابي', 'الحجلة', 'السبع حجلات'],
      slug: createSlug('الكرابي'),
      countryId: egypt!.id,
      region: 'وادي النيل - القاهرة والإسكندرية والمدن الكبرى',
      geoCoordinates: { lat: 30.0444, lng: 31.2357 },
      heritageFieldId: heritageMovement!.id,
      gameType: 'حركية / توازن / قفز',
      ageGroup: '6 - 12 سنة (الطفولة)',
      ageGroupDetails: 'تتطلب تنسيقاً حركياً وتوازناً، لذا تناسب الأطفال في سن المدرسة الابتدائية.',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'لعبة شعبية يمارسها الجنسان في الأفنية والشوارع، لكنها أكثر شيوعاً بين البنات.',
      playersCount: '1 - 4 لاعبين',
      playersDetails: 'يمكن لعبها فردياً أو في مجموعات صغيرة، كل لاعب ينتظر دوره.',
      tools: ['طباشير أو حجر للرسم', 'حجر صغير للرمي'],
      environment: 'الأفنية والشوارع والأرصفة - أرضية صلبة',
      timing: 'النهار - يحتاج إضاءة جيدة للرؤية',
      description: 'لعبة تقليدية تعتمد على القفز على مربعات مرسومة على الأرض بطريقة معينة. تعتبر من أشهر ألعاب الأطفال في مصر والعالم العربي.',
      rules: [
        'رسم المربعات: يرسم 7-9 مربعات على الأرض بشكل متسلسل.',
        'رمي الحجر: يرمي اللاعب حجراً صغيراً في المربع الأول.',
        'القفز: يقفز اللاعب على المربعات متجاوزاً المربع الذي يحتوي على الحجر.',
        'الرجوع: يعود اللاعب بنفس الطريقة ويأخذ الحجر.',
        'التقدم: يتقدم للمربع التالي في الجولة القادمة.',
        'الفوز: من يكمل جميع المربعات أولاً.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يكمل جميع المربعات (من 1 إلى 7 أو 9) أولاً.\nالخسارة: من يخطئ في القفز أو يرمي الحجر خارج المربع.',
      startEndMechanism: 'البدء: بالقرعة أو "حجر ورقة مقص" لتحديد من يبدأ.\nالانتهاء: عندما يكمل أحد اللاعبين جميع المربعات.',
      oralTradition: 'أهازيج: "كرابي كرابي" عند القفز، "يا حجر" عند الرمي، "يا خطأ" عند الخطأ.',
      socialContext: '1. تطوير مهارات التوازن والتنسيق.\n2. تعزيز الصداقات بين الأطفال.\n3. تعلم الصبر والمثابرة.\n4. الحفاظ على التراث الثقافي المصري.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 8: الطاقية (من المغرب)
  const morocco = await prisma.country.findFirst({ where: { name: 'المملكة المغربية' } })
  const game8 = await prisma.game.create({
    data: {
      canonicalName: 'الطاقية',
      englishName: 'Cap Game (Taqiya)',
      localNames: ['الطاقية', 'لعبة القبعات'],
      slug: createSlug('الطاقية'),
      countryId: morocco!.id,
      region: 'المغرب العربي - المدن والريف',
      geoCoordinates: { lat: 33.9716, lng: -6.8498 },
      heritageFieldId: heritageSocial!.id,
      gameType: 'ذهنية / تخمين / اجتماعية',
      ageGroup: '8 - 16 سنة',
      ageGroupDetails: 'تتطلب قدرة على التخمين والذاكرة، لذا تناسب الأطفال والمراهقين.',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'لعبة شعبية يمارسها الجميع في المجالس والأفنية.',
      playersCount: '3 - 8 لاعبين',
      playersDetails: 'تحتاج لثلاثة لاعبين على الأقل: واحد يخفي والآخرون يخمنون.',
      tools: ['طاقية أو قبعة', 'حجر صغير أو عملة معدنية'],
      environment: 'الأفنية والمجالس والأماكن المغلقة',
      timing: 'أي وقت - في أوقات الفراغ',
      description: 'لعبة تخمين تقليدية تعتمد على إخفاء حجر تحت إحدى الطاقيات وتخمين مكانه. تعتبر من أشهر ألعاب الأطفال في المغرب.',
      rules: [
        'الإخفاء: يخفي اللاعب حجراً تحت إحدى الطاقيات.',
        'الخلط: يحرك الطاقيات بسرعة لخلطها.',
        'التخمين: يحاول اللاعبون تخمين مكان الحجر.',
        'الفوز: من يخمن بشكل صحيح يحصل على دور الإخفاء.',
        'الخسارة: من يخطئ ينتظر دوره التالي.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يخمن مكان الحجر بشكل صحيح.\nالخسارة: من يخطئ في التخمين.',
      startEndMechanism: 'البدء: بالقرعة لتحديد من يبدأ بالإخفاء.\nالانتهاء: عندما يتفق اللاعبون على النهاية أو عندما يملون.',
      oralTradition: 'أهازيج: "يا طاقية" عند الإخفاء، "يا حجر" عند التخمين، "يا صح" عند التخمين الصحيح.',
      socialContext: '1. تطوير مهارات التخمين والذاكرة.\n2. تعزيز التفاعل الاجتماعي.\n3. تعلم الصبر والتركيز.\n4. الحفاظ على التراث الثقافي المغربي.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 9: الحجلة (من سوريا)
  const syria = await prisma.country.findFirst({ where: { name: 'الجمهورية العربية السورية' } })
  const game9 = await prisma.game.create({
    data: {
      canonicalName: 'الحجلة',
      englishName: 'Hopscotch (Hajla)',
      localNames: ['الحجلة', 'السبع حجلات', 'الكرابي'],
      slug: createSlug('الحجلة'),
      countryId: syria!.id,
      region: 'بلاد الشام - دمشق وحلب والمدن الكبرى',
      geoCoordinates: { lat: 33.5138, lng: 36.2765 },
      heritageFieldId: heritageMovement!.id,
      gameType: 'حركية / توازن / قفز',
      ageGroup: '6 - 12 سنة (الطفولة)',
      ageGroupDetails: 'تتطلب تنسيقاً حركياً وتوازناً، لذا تناسب الأطفال في سن المدرسة الابتدائية.',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'لعبة شعبية يمارسها الجنسان في الأفنية والشوارع.',
      playersCount: '1 - 4 لاعبين',
      playersDetails: 'يمكن لعبها فردياً أو في مجموعات صغيرة.',
      tools: ['طباشير أو حجر للرسم', 'حجر صغير للرمي'],
      environment: 'الأفنية والشوارع والأرصفة',
      timing: 'النهار - يحتاج إضاءة جيدة',
      description: 'لعبة تقليدية تعتمد على القفز على مربعات مرسومة على الأرض. تعتبر من أشهر ألعاب الأطفال في سوريا.',
      rules: [
        'رسم المربعات: يرسم 7 مربعات على الأرض.',
        'رمي الحجر: يرمي اللاعب حجراً في المربع الأول.',
        'القفز: يقفز اللاعب على المربعات.',
        'الرجوع: يعود اللاعب بنفس الطريقة.',
        'الفوز: من يكمل جميع المربعات أولاً.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يكمل جميع المربعات أولاً.\nالخسارة: من يخطئ في القفز.',
      startEndMechanism: 'البدء: بالقرعة.\nالانتهاء: عندما يكمل أحد اللاعبين جميع المربعات.',
      oralTradition: 'أهازيج: "حجلة حجلة" عند القفز، "يا حجر" عند الرمي.',
      socialContext: '1. تطوير مهارات التوازن.\n2. تعزيز الصداقات.\n3. تعلم الصبر.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // Game 10: الدعابل (من السعودية)
  const saudi = await prisma.country.findFirst({ where: { name: 'المملكة العربية السعودية' } })
  const game10 = await prisma.game.create({
    data: {
      canonicalName: 'الدعابل',
      englishName: 'Stones Throwing Game (Daabil)',
      localNames: ['الدعابل', 'الطمّـة', 'الحجارة'],
      slug: createSlug('الدعابل'),
      countryId: saudi!.id,
      region: 'الجزيرة العربية - المناطق الوسطى والشرقية',
      geoCoordinates: { lat: 24.7136, lng: 46.6753 },
      heritageFieldId: heritageMovement!.id,
      gameType: 'حركية / دقة / تصويب',
      ageGroup: '8 - 16 سنة',
      ageGroupDetails: 'تتطلب دقة في التصويب وتنسيقاً بين اليد والعين.',
      practitioners: 'الذكور (غالباً)',
      practitionersDetails: 'لعبة تقليدية للأولاد في الأحياء الشعبية.',
      playersCount: '2 - 6 لاعبين',
      playersDetails: 'تُلعب في مجموعات صغيرة، كل لاعب يحاول ضرب الهدف.',
      tools: ['حجارة صغيرة', 'هدف (حجر كبير أو علامة)'],
      environment: 'الساحات المفتوحة والأراضي الفضاء',
      timing: 'النهار - يحتاج إضاءة جيدة',
      description: 'لعبة تقليدية تعتمد على رمي الحجارة الصغيرة لضرب هدف معين. تعتبر من أشهر ألعاب الأولاد في السعودية.',
      rules: [
        'وضع الهدف: يضع اللاعبون هدفاً (حجر كبير أو علامة).',
        'الرمي: يرمي كل لاعب حجارة صغيرة محاولاً ضرب الهدف.',
        'الفوز: من يضرب الهدف أولاً أو أكثر عدداً.',
        'الخسارة: من يفشل في ضرب الهدف.'
      ],
      winLossSystem: 'الفوز: اللاعب الذي يضرب الهدف أولاً أو أكثر عدداً.\nالخسارة: من يفشل في ضرب الهدف.',
      startEndMechanism: 'البدء: بالقرعة.\nالانتهاء: عندما يضرب أحد اللاعبين الهدف أو بعد عدد محدد من المحاولات.',
      oralTradition: 'صيحات: "دعبل!" عند الرمي، "يا هدف!" عند الضرب.',
      socialContext: '1. تطوير مهارات التصويب.\n2. تعزيز المنافسة.\n3. بناء الصداقات.',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId: editorContributor.id,
      reviewerId: adminContributor.id
    }
  })

  // ==================== TAGS ASSIGNMENT ====================
  console.log('🔗 Assigning tags to games...')
  
  // Get tag IDs
  const tagKhaleeji = await prisma.tag.findFirst({ where: { name: 'تراث خليجي' } })
  const tagIraqi = await prisma.tag.findFirst({ where: { name: 'تراث عراقي' } })
  const tagMovement = await prisma.tag.findFirst({ where: { name: 'ألعاب حركية' } })
  const tagMental = await prisma.tag.findFirst({ where: { name: 'ألعاب ذهنية' } })
  const tagFunny = await prisma.tag.findFirst({ where: { name: 'ألعاب طريفة' } })
  const tagMarine = await prisma.tag.findFirst({ where: { name: 'ألعاب بحرية' } })
  const tagPopular = await prisma.tag.findFirst({ where: { name: 'ألعاب شعبية' } })
  const tagChildren = await prisma.tag.findFirst({ where: { name: 'ألعاب الأطفال' } })
  const tagMales = await prisma.tag.findFirst({ where: { name: 'ألعاب الذكور' } })
  const tagFemales = await prisma.tag.findFirst({ where: { name: 'ألعاب الإناث' } })
  const tagMixed = await prisma.tag.findFirst({ where: { name: 'ألعاب مختلطة' } })
  const tagGroup = await prisma.tag.findFirst({ where: { name: 'ألعاب جماعية' } })
  const tagPair = await prisma.tag.findFirst({ where: { name: 'ألعاب ثنائية' } })
  const tagDay = await prisma.tag.findFirst({ where: { name: 'ألعاب النهار' } })
  const tagNight = await prisma.tag.findFirst({ where: { name: 'ألعاب الليل' } })

  // Assign tags to games
  await prisma.gameTag.createMany({
    data: [
      // Game 1: الركض بالحاجبين المرفوعين
      { gameId: game1.id, tagId: tagKhaleeji!.id },
      { gameId: game1.id, tagId: tagMovement!.id },
      { gameId: game1.id, tagId: tagFunny!.id },
      { gameId: game1.id, tagId: tagMixed!.id },
      { gameId: game1.id, tagId: tagGroup!.id },
      { gameId: game1.id, tagId: tagDay!.id },
      { gameId: game1.id, tagId: tagChildren!.id },
      
      // Game 2: الهالوسة
      { gameId: game2.id, tagId: tagKhaleeji!.id },
      { gameId: game2.id, tagId: tagMental!.id },
      { gameId: game2.id, tagId: tagMarine!.id },
      { gameId: game2.id, tagId: tagPair!.id },
      { gameId: game2.id, tagId: tagMales!.id },
      { gameId: game2.id, tagId: tagDay!.id },
      { gameId: game2.id, tagId: tagNight!.id },
      
      // Game 3: التيلة
      { gameId: game3.id, tagId: tagKhaleeji!.id },
      { gameId: game3.id, tagId: tagMovement!.id },
      { gameId: game3.id, tagId: tagMales!.id },
      { gameId: game3.id, tagId: tagGroup!.id },
      { gameId: game3.id, tagId: tagDay!.id },
      { gameId: game3.id, tagId: tagChildren!.id },
      
      // Game 4: الحالوسة
      { gameId: game4.id, tagId: tagIraqi!.id },
      { gameId: game4.id, tagId: tagMental!.id },
      { gameId: game4.id, tagId: tagPair!.id },
      { gameId: game4.id, tagId: tagNight!.id },
      
      // Game 5: التوّاقيل
      { gameId: game5.id, tagId: tagIraqi!.id },
      { gameId: game5.id, tagId: tagMovement!.id },
      { gameId: game5.id, tagId: tagPopular!.id },
      { gameId: game5.id, tagId: tagMales!.id },
      { gameId: game5.id, tagId: tagGroup!.id },
      { gameId: game5.id, tagId: tagChildren!.id },
      
      // Game 6: الشَّبْحَة
      { gameId: game6.id, tagId: tagKhaleeji!.id },
      { gameId: game6.id, tagId: tagMovement!.id },
      { gameId: game6.id, tagId: tagFemales!.id },
      { gameId: game6.id, tagId: tagGroup!.id },
      { gameId: game6.id, tagId: tagDay!.id },
      { gameId: game6.id, tagId: tagChildren!.id },
      
      // Game 7: الكرابي
      { gameId: game7.id, tagId: tagMovement!.id },
      { gameId: game7.id, tagId: tagMixed!.id },
      { gameId: game7.id, tagId: tagGroup!.id },
      { gameId: game7.id, tagId: tagDay!.id },
      { gameId: game7.id, tagId: tagChildren!.id },
      
      // Game 8: الطاقية
      { gameId: game8.id, tagId: tagMental!.id },
      { gameId: game8.id, tagId: tagMixed!.id },
      { gameId: game8.id, tagId: tagGroup!.id },
      { gameId: game8.id, tagId: tagChildren!.id },
      
      // Game 9: الحجلة
      { gameId: game9.id, tagId: tagMovement!.id },
      { gameId: game9.id, tagId: tagMixed!.id },
      { gameId: game9.id, tagId: tagGroup!.id },
      { gameId: game9.id, tagId: tagDay!.id },
      { gameId: game9.id, tagId: tagChildren!.id },
      
      // Game 10: الدعابل
      { gameId: game10.id, tagId: tagKhaleeji!.id },
      { gameId: game10.id, tagId: tagMovement!.id },
      { gameId: game10.id, tagId: tagMales!.id },
      { gameId: game10.id, tagId: tagGroup!.id },
      { gameId: game10.id, tagId: tagDay!.id },
      { gameId: game10.id, tagId: tagChildren!.id }
    ],
    skipDuplicates: true
  })

  // ==================== MEDIA ====================
  console.log('🖼️  Seeding media...')
  
  await prisma.media.createMany({
    data: [
      {
        gameId: game1.id,
        url: 'https://d12eu00glpdtk2.cloudfront.net/public/images/local/photo5915934180699648891.jpg',
        caption: 'صورة توضيحية للعبة الركض بالحاجبين المرفوعين',
        source: 'أرشيف كتارا',
        type: 'image'
      },
      {
        gameId: game2.id,
        url: 'https://images.unsplash.com/photo-1611195955636-f3830fbac00c?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة المنقلة التقليدية',
        type: 'image'
      },
      {
        gameId: game3.id,
        url: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=800',
        caption: 'كرات زجاجية (تيل)',
        type: 'image'
      },
      {
        gameId: game4.id,
        url: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=800',
        caption: 'لوح لعبة الحالوسة',
        type: 'image'
      },
      {
        gameId: game5.id,
        url: 'https://images.unsplash.com/photo-1533240763637-2350e932b704?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة التواقيل في ساحة مفتوحة',
        type: 'image'
      },
      {
        gameId: game6.id,
        url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
        caption: 'بنات يلعبن الشَّبْحَة',
        type: 'image'
      },
      {
        gameId: game7.id,
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة الكرابي على الأرض',
        type: 'image'
      },
      {
        gameId: game8.id,
        url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة الطاقية التقليدية',
        type: 'image'
      },
      {
        gameId: game9.id,
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة الحجلة في سوريا',
        type: 'image'
      },
      {
        gameId: game10.id,
        url: 'https://images.unsplash.com/photo-1533240763637-2350e932b704?auto=format&fit=crop&q=80&w=800',
        caption: 'لعبة الدعابل في السعودية',
        type: 'image'
      }
    ],
    skipDuplicates: true
  })

  // ==================== REFERENCES ====================
  console.log('📚 Seeding references...')
  
  await prisma.reference.createMany({
    data: [
      {
        gameId: game1.id,
        citation: 'سلسلة الألعاب الشعبية القطرية - كتارا.',
        sourceType: 'كتاب',
        author: 'مركز كتارا للتراث',
        year: 2018
      },
      {
        gameId: game2.id,
        citation: 'الألعاب الشعبية في قطر.',
        sourceType: 'كتاب',
        author: 'وزارة الثقافة القطرية',
        year: 2015
      },
      {
        gameId: game3.id,
        citation: 'كتاب الألعاب الشعبية في الإمارات.',
        sourceType: 'كتاب',
        author: 'نادي تراث الإمارات',
        year: 2019
      },
      {
        gameId: game4.id,
        citation: 'التراث الشعبي في بلاد الشام.',
        sourceType: 'كتاب',
        author: 'دار الشروق',
        year: 2012
      },
      {
        gameId: game5.id,
        citation: 'موسوعة الفلكلور العراقي.',
        sourceType: 'كتاب',
        author: 'وزارة الثقافة العراقية',
        year: 2010
      },
      {
        gameId: game6.id,
        citation: 'الألعاب الشعبية الكويتية.',
        sourceType: 'كتاب',
        author: 'المجلس الوطني للثقافة الكويتي',
        year: 2017
      },
      {
        gameId: game7.id,
        citation: 'الألعاب الشعبية المصرية - دراسة ميدانية.',
        sourceType: 'كتاب',
        author: 'مركز توثيق التراث الشعبي',
        year: 2016
      },
      {
        gameId: game8.id,
        citation: 'التراث الشعبي المغربي - الألعاب التقليدية.',
        sourceType: 'كتاب',
        author: 'وزارة الثقافة المغربية',
        year: 2018
      },
      {
        gameId: game9.id,
        citation: 'الألعاب الشعبية السورية - توثيق ميداني.',
        sourceType: 'كتاب',
        author: 'اتحاد الكتاب العرب',
        year: 2015
      },
      {
        gameId: game10.id,
        citation: 'الألعاب الشعبية السعودية - رحلة في التراث.',
        sourceType: 'كتاب',
        author: 'هيئة التراث السعودية',
        year: 2019
      }
    ],
    skipDuplicates: true
  })

  // ==================== REVIEW LOGS ====================
  console.log('📝 Seeding review logs...')
  
  await prisma.reviewLog.createMany({
    data: [
      {
        gameId: game1.id,
        reviewerId: adminContributor.id,
        action: 'created',
        notes: 'تم إنشاء اللعبة بناءً على توثيق ميداني'
      },
      {
        gameId: game1.id,
        reviewerId: adminContributor.id,
        action: 'approved',
        notes: 'اللعبة موثقة جيداً ومصادرها معتمدة'
      },
      {
        gameId: game1.id,
        reviewerId: adminContributor.id,
        action: 'published',
        notes: 'تم نشر اللعبة للجمهور'
      }
    ],
    skipDuplicates: true
  })

  // ==================== GAME CONCEPTS ====================
  console.log('🔗 Seeding game concepts...')
  
  // Create a concept for similar games (e.g., variations of the same game)
  const concept1 = await prisma.gameConcept.create({
    data: {
      name: 'ألعاب المنقلة والحفر',
      description: 'مجموعة من الألعاب التقليدية التي تعتمد على الحفر في الأرض ونقل الحصى أو البذور',
      createdById: adminContributor.id
    }
  })

  const concept2 = await prisma.gameConcept.create({
    data: {
      name: 'ألعاب الكرات والرمي',
      description: 'ألعاب تعتمد على رمي الكرات أو الأحجار نحو أهداف محددة',
      createdById: adminContributor.id
    }
  })

  // ==================== GAME SIMILARITIES ====================
  console.log('🔍 Seeding game similarities...')
  
  // Example similarities between games
  // Note: gameAId should be < gameBId alphabetically for uniqueness
  const similarity1 = await prisma.gameSimilarity.create({
    data: {
      gameAId: game1.id < game2.id ? game1.id : game2.id,
      gameBId: game1.id < game2.id ? game2.id : game1.id,
      overallScore: 0.85,
      structuralScore: 0.90,
      semanticScore: 0.80,
      heritageScore: 0.85,
      aiScore: 0.83,
      algorithm: 'rule-based-v1',
      isAiAssisted: true,
      status: 'accepted',
      curatorId: adminContributor.id,
      conceptId: concept1.id,
      curatorNotes: 'ألعاب متشابهة في الآلية والأدوات المستخدمة',
      reviewedAt: new Date(),
      explanation: {
        reasons: [
          'نفس نوع الأدوات (حصى، حفر)',
          'آلية لعب متشابهة',
          'نفس الفئة العمرية المستهدفة'
        ],
        differences: [
          'اختلاف في عدد اللاعبين',
          'اختلاف في المنطقة الجغرافية'
        ]
      }
    }
  })

  const similarity2 = await prisma.gameSimilarity.create({
    data: {
      gameAId: game3.id < game4.id ? game3.id : game4.id,
      gameBId: game3.id < game4.id ? game4.id : game3.id,
      overallScore: 0.72,
      structuralScore: 0.75,
      semanticScore: 0.70,
      heritageScore: 0.72,
      aiScore: 0.71,
      algorithm: 'rule-based-v1',
      isAiAssisted: true,
      status: 'pending',
      curatorNotes: null,
      reviewedAt: null,
      explanation: {
        reasons: [
          'ألعاب حركية',
          'تعتمد على السرعة والمهارة',
          'تُلعب في الهواء الطلق'
        ],
        differences: [
          'اختلاف في الأدوات المستخدمة',
          'اختلاف في عدد اللاعبين'
        ]
      }
    }
  })

  const similarity3 = await prisma.gameSimilarity.create({
    data: {
      gameAId: game5.id < game6.id ? game5.id : game6.id,
      gameBId: game5.id < game6.id ? game6.id : game5.id,
      overallScore: 0.65,
      structuralScore: 0.68,
      semanticScore: 0.62,
      heritageScore: 0.65,
      aiScore: 0.64,
      algorithm: 'rule-based-v1',
      isAiAssisted: false,
      status: 'rejected',
      curatorId: adminContributor.id,
      curatorNotes: 'الألعاب مختلفة في الجوهر رغم بعض التشابهات السطحية',
      reviewedAt: new Date(),
      explanation: {
        reasons: [
          'نفس المنطقة الجغرافية',
          'نفس الفئة العمرية'
        ],
        differences: [
          'آلية اللعب مختلفة تماماً',
          'الأهداف التعليمية مختلفة',
          'الأدوات المستخدمة مختلفة'
        ]
      }
    }
  })

  const similarity4 = await prisma.gameSimilarity.create({
    data: {
      gameAId: game7.id < game8.id ? game7.id : game8.id,
      gameBId: game7.id < game8.id ? game8.id : game7.id,
      overallScore: 0.78,
      structuralScore: 0.80,
      semanticScore: 0.76,
      heritageScore: 0.78,
      aiScore: 0.77,
      algorithm: 'rule-based-v1',
      isAiAssisted: true,
      status: 'postponed',
      curatorNotes: 'يحتاج المزيد من البحث والتوثيق للتأكد من العلاقة',
      reviewedAt: null,
      explanation: {
        reasons: [
          'تشابه في الوصف',
          'نفس نوع اللعبة'
        ],
        differences: [
          'معلومات غير كافية عن إحدى اللعبتين',
          'يحتاج توثيق ميداني إضافي'
        ]
      }
    }
  })

  // Link some games to concepts
  await prisma.game.update({
    where: { id: game1.id },
    data: { conceptId: concept1.id }
  })

  await prisma.game.update({
    where: { id: game2.id },
    data: { conceptId: concept1.id }
  })

  // ==================== GAMES UNDER REVIEW ====================
  console.log('📝 Creating games under review...')

  // Game 11: الغميضة (Hide and Seek) - Under Review
  const game11 = await prisma.game.create({
    data: {
      canonicalName: 'الغميضة',
      englishName: 'Hide and Seek',
      localNames: ['الطماية', 'الخبيصة', 'الاستخباية'],
      slug: createSlug('الغميضة'),
      countryId: qatar!.id,
      region: 'جميع مناطق قطر',
      heritageFieldId: heritageSocial!.id,
      gameType: 'حركية',
      ageGroup: '5 - 15 سنة',
      ageGroupDetails: 'لعبة مناسبة لجميع الأعمار من الطفولة المبكرة إلى المراهقة',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'تُلعب من قبل الجنسين في مجموعات منفصلة أو مختلطة حسب العمر',
      playersCount: '4 - 15 لاعب',
      playersDetails: 'كلما زاد عدد اللاعبين زادت المتعة والتحدي',
      tools: ['لا يوجد (الجسد فقط)'],
      environment: 'السكيك (الأزقة) أو الحوي (فناء المنزل) أو الحدائق',
      timing: 'النهار أو الليل',
      description: 'لعبة تقليدية شهيرة تعتمد على الاختباء والبحث. يقوم أحد اللاعبين بالعد بينما يختبئ الآخرون، ثم يبحث عنهم. تنمي هذه اللعبة مهارات الملاحظة والتخطيط والصبر.',
      rules: [
        'يتم اختيار لاعب واحد ليكون "الباحث" عن طريق القرعة',
        'يغمض الباحث عينيه ويعد حتى رقم متفق عليه (عادة 20 أو 50)',
        'يختبئ باقي اللاعبين في أماكن مختلفة خلال فترة العد',
        'بعد انتهاء العد، يبدأ الباحث في البحث عن المختبئين',
        'عندما يجد الباحث أحد اللاعبين، يجب عليه أن يصيح باسمه',
        'أول لاعب يتم العثور عليه يصبح الباحث في الجولة التالية'
      ],
      winLossSystem: 'الفوز: آخر لاعب يتم العثور عليه هو الفائز.\nالخسارة: أول لاعب يتم العثور عليه يصبح الباحث في الجولة القادمة.',
      startEndMechanism: 'البدء: بالقرعة لاختيار الباحث الأول.\nالانتهاء: عندما يتم العثور على جميع اللاعبين أو عند الاتفاق على إنهاء اللعبة.',
      oralTradition: 'صيحات: "واحد اثنين ثلاثة..." أثناء العد، "طلعت!" عند بدء البحث، "لقيتك يا فلان!" عند العثور على أحد.',
      socialContext: '1. تطوير مهارات الملاحظة والانتباه.\n2. تعزيز القدرة على التخطيط والتفكير الاستراتيجي.\n3. بناء الصداقات والتواصل الاجتماعي.\n4. تنمية الصبر والانضباط الذاتي.',
      reviewStatus: 'under_review',
      contributorId: editorContributor.id
    }
  })

  // Add media for game 11
  await prisma.media.create({
    data: {
      gameId: game11.id,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
      caption: 'أطفال يلعبون الغميضة في أحد الأزقة القديمة',
      source: 'Unsplash'
    }
  })

  // Add reference for game 11
  await prisma.reference.create({
    data: {
      gameId: game11.id,
      citation: 'الألعاب الشعبية في قطر، وزارة الثقافة والرياضة، 2020',
      sourceType: 'كتاب',
      author: 'إدارة التراث',
      year: 2020,
      url: null
    }
  })

  // Game 12: الصقلة (Marbles) - Under Review
  const game12 = await prisma.game.create({
    data: {
      canonicalName: 'الصقلة',
      englishName: 'Marbles',
      localNames: ['الكلل', 'الدحل', 'البلي'],
      slug: createSlug('الصقلة'),
      countryId: kuwait!.id,
      region: 'جميع مناطق الكويت',
      heritageFieldId: heritageSocial!.id,
      gameType: 'ذهنية / حركية',
      ageGroup: '7 - 14 سنة',
      ageGroupDetails: 'لعبة تتطلب مهارة يدوية ودقة في التصويب',
      practitioners: 'ذكور',
      practitionersDetails: 'تُلعب بشكل رئيسي من قبل الأولاد في الأحياء والساحات',
      playersCount: '2 - 6 لاعبين',
      playersDetails: 'يمكن اللعب فردي أو جماعي',
      tools: ['كرات زجاجية صغيرة (صقلة)', 'حفرة صغيرة في الأرض'],
      environment: 'الساحات الترابية أو الأزقة',
      timing: 'النهار (بعد الظهر)',
      description: 'لعبة تقليدية تعتمد على رمي الكرات الزجاجية الصغيرة نحو حفرة في الأرض أو نحو كرات اللاعبين الآخرين. تتطلب مهارة ودقة في التصويب وحساب المسافات.',
      rules: [
        'يتم حفر حفرة صغيرة في الأرض (قطرها حوالي 10 سم)',
        'يقف كل لاعب على مسافة متساوية من الحفرة (حوالي 2-3 أمتار)',
        'يرمي كل لاعب صقلته محاولاً إدخالها في الحفرة',
        'من يدخل صقلته في الحفرة يفوز بصقلة اللاعب الأقرب إليه',
        'يمكن أيضاً محاولة ضرب صقلة اللاعب الآخر مباشرة',
        'اللعبة تستمر حتى ينتهي عدد الصقلات المتفق عليه'
      ],
      winLossSystem: 'الفوز: من يجمع أكبر عدد من الصقلات.\nالخسارة: من يخسر جميع صقلاته.',
      startEndMechanism: 'البدء: بالقرعة لتحديد ترتيب الرمي.\nالانتهاء: عندما يخسر أحد اللاعبين جميع صقلاته أو عند الاتفاق على إنهاء اللعبة.',
      oralTradition: 'صيحات: "صقلة!" عند الرمي، "طاحت!" عند الإصابة، "خسرت!" عند خسارة الصقلة.',
      socialContext: '1. تطوير مهارات التصويب والتنسيق بين اليد والعين.\n2. تعلم الحساب والتقدير.\n3. تعزيز روح المنافسة الشريفة.\n4. بناء الصداقات بين الأطفال.',
      reviewStatus: 'under_review',
      contributorId: editorContributor.id
    }
  })

  // Add media for game 12
  await prisma.media.create({
    data: {
      gameId: game12.id,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1611329532992-0b7d066d3c4a?auto=format&fit=crop&q=80&w=800',
      caption: 'كرات زجاجية ملونة (صقلة) تستخدم في اللعبة',
      source: 'Unsplash'
    }
  })

  // Add reference for game 12
  await prisma.reference.create({
    data: {
      gameId: game12.id,
      citation: 'الألعاب الشعبية الكويتية، المجلس الوطني للثقافة والفنون والآداب، 2018',
      sourceType: 'كتاب',
      author: 'د. خالد العدواني',
      year: 2018,
      url: null
    }
  })

  // Game 13: طاق طاق طاقية (Ring Around the Rosie) - Under Review
  const game13 = await prisma.game.create({
    data: {
      canonicalName: 'طاق طاق طاقية',
      englishName: 'Ring Game',
      localNames: ['الطاقية', 'لعبة الحلقة'],
      slug: createSlug('طاق طاق طاقية'),
      countryId: bahrain!.id,
      region: 'جميع مناطق البحرين',
      heritageFieldId: heritageSocial!.id,
      gameType: 'حركية / غنائية',
      ageGroup: '4 - 10 سنوات',
      ageGroupDetails: 'لعبة مناسبة للأطفال الصغار',
      practitioners: 'مختلط (ذكور وإناث)',
      practitionersDetails: 'تُلعب من قبل الأطفال في المدارس والبيوت',
      playersCount: '5 - 15 لاعب',
      playersDetails: 'كلما زاد العدد كانت اللعبة أكثر متعة',
      tools: ['طاقية أو منديل أو أي قطعة قماش صغيرة'],
      environment: 'الحوي (فناء المنزل) أو ساحة المدرسة',
      timing: 'النهار',
      description: 'لعبة جماعية غنائية حركية يجلس فيها الأطفال في دائرة ويدور أحدهم من الخارج حاملاً طاقية، ثم يضعها خلف أحد الجالسين دون أن يشعر، وعندما يكتشف الطفل الطاقية خلفه يجري خلف الواضع محاولاً الإمساك به.',
      rules: [
        'يجلس الأطفال في دائرة ووجوههم للداخل',
        'يتم اختيار طفل واحد ليحمل الطاقية ويدور حول الدائرة',
        'يغني الأطفال أغنية "طاق طاق طاقية" أثناء الدوران',
        'يضع الطفل الدائر الطاقية خلف أحد الجالسين بهدوء',
        'عندما يكتشف الطفل الطاقية خلفه، يجري خلف الواضع',
        'إذا أمسك به قبل أن يجلس في مكانه، يصبح الممسوك هو الدائر',
        'إذا جلس الواضع في المكان الفارغ، يصبح المكتشف هو الدائر'
      ],
      winLossSystem: 'لا يوجد فائز أو خاسر محدد، اللعبة تستمر للمتعة والترفيه.',
      startEndMechanism: 'البدء: بالقرعة لاختيار الدائر الأول.\nالانتهاء: عند اتفاق الأطفال على إنهاء اللعبة.',
      oralTradition: 'الأغنية: "طاق طاق طاقية، رن رن يا جرس، يا ويلي من الناقوس، اللي ما يلتفت أضربه بالناقوس"',
      socialContext: '1. تنمية الانتباه واليقظة.\n2. تطوير المهارات الحركية.\n3. تعزيز التواصل الاجتماعي والغناء الجماعي.\n4. خلق جو من المرح والسعادة.',
      reviewStatus: 'under_review',
      contributorId: editorContributor.id
    }
  })

  // Add media for game 13
  await prisma.media.create({
    data: {
      gameId: game13.id,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
      caption: 'أطفال يلعبون طاق طاق طاقية في دائرة',
      source: 'Unsplash'
    }
  })

  // Add reference for game 13
  await prisma.reference.create({
    data: {
      gameId: game13.id,
      citation: 'الألعاب الشعبية في البحرين، هيئة البحرين للثقافة والآثار، 2019',
      sourceType: 'كتاب',
      author: 'منى الشيخ',
      year: 2019,
      url: null
    }
  })

  // Assign tags to new games
  await prisma.gameTag.createMany({
    data: [
      // Game 11: الغميضة
      { gameId: game11.id, tagId: tagKhaleeji!.id },
      { gameId: game11.id, tagId: tagMovement!.id },
      { gameId: game11.id, tagId: tagMixed!.id },
      { gameId: game11.id, tagId: tagGroup!.id },
      { gameId: game11.id, tagId: tagChildren!.id },
      
      // Game 12: الصقلة
      { gameId: game12.id, tagId: tagKhaleeji!.id },
      { gameId: game12.id, tagId: tagMental!.id },
      { gameId: game12.id, tagId: tagMales!.id },
      { gameId: game12.id, tagId: tagDay!.id },
      { gameId: game12.id, tagId: tagChildren!.id },
      
      // Game 13: طاق طاق طاقية
      { gameId: game13.id, tagId: tagKhaleeji!.id },
      { gameId: game13.id, tagId: tagMovement!.id },
      { gameId: game13.id, tagId: tagMixed!.id },
      { gameId: game13.id, tagId: tagGroup!.id },
      { gameId: game13.id, tagId: tagChildren!.id },
    ],
    skipDuplicates: true
  })

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Countries: ${countries.count}`)
  console.log(`   - Heritage Fields: ${heritageFields.count}`)
  console.log(`   - Tags: ${tags.count}`)
  console.log(`   - Contributors: (kept existing users)`)
  console.log(`   - Games: 13 (10 published + 3 under review)`)
  console.log(`   - Media: 13`)
  console.log(`   - References: 13`)
  console.log(`   - Review Logs: 3`)
  console.log(`   - Game Concepts: 2`)
  console.log(`   - Game Similarities: 4 (1 accepted, 1 pending, 1 rejected, 1 postponed)`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })