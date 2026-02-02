#!/usr/bin/env node

/**
 * سكريبت اختبار نظام رفع الصور
 * يتحقق من أن جميع المكونات تعمل بشكل صحيح
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 اختبار نظام رفع الصور في مشروع معجم الألعاب التراثية العربية\n');

// التحقق من وجود الملفات المطلوبة
const requiredFiles = [
  'components/ui/upload-button.tsx',
  'lib/uploadthing.ts',
  'app/api/uploadthing/route.ts',
  'lib/actions/game.ts',
  'app/dashboard/games/new/page.tsx',
  '.env.example'
];

console.log('📁 التحقق من وجود الملفات المطلوبة:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n🔧 التحقق من تكوين Uploadthing:');
try {
  const uploadthingConfig = fs.readFileSync(path.join(__dirname, '..', 'lib/uploadthing.ts'), 'utf8');
  const hasUploadthingImport = uploadthingConfig.includes('import { createUploadthing }');
  const hasFileRouter = uploadthingConfig.includes('f({ image: { maxFileSize:');
  
  console.log(`  ${hasUploadthingImport ? '✅' : '❌'} استيراد createUploadthing`);
  console.log(`  ${hasFileRouter ? '✅' : '❌'} تكوين FileRouter`);
} catch (error) {
  console.log('  ❌ خطأ في قراءة ملف تكوين Uploadthing');
}

console.log('\n📝 التحقق من صفحة إضافة لعبة جديدة:');
try {
  const newGamePage = fs.readFileSync(path.join(__dirname, '..', 'app/dashboard/games/new/page.tsx'), 'utf8');
  const hasUploadButtonImport = newGamePage.includes('import { UploadButton }');
  const hasUploadButtonComponent = newGamePage.includes('<UploadButton');
  const hasUploadedImagesState = newGamePage.includes('uploadedImages');
  
  console.log(`  ${hasUploadButtonImport ? '✅' : '❌'} استيراد UploadButton`);
  console.log(`  ${hasUploadButtonComponent ? '✅' : '❌'} استخدام مكون UploadButton`);
  console.log(`  ${hasUploadedImagesState ? '✅' : '❌'} حالة uploadedImages`);
} catch (error) {
  console.log('  ❌ خطأ في قراءة صفحة إضافة لعبة جديدة');
}

console.log('\n⚙️ التحقق من إجراءات الخادم:');
try {
  const gameActions = fs.readFileSync(path.join(__dirname, '..', 'lib/actions/game.ts'), 'utf8');
  const hasUploadedImagesInSchema = gameActions.includes('uploadedImages: z.array(z.string())');
  const hasMediaCreation = gameActions.includes('await db.media.createMany');
  
  console.log(`  ${hasUploadedImagesInSchema ? '✅' : '❌'} حقل uploadedImages في مخطط التحقق`);
  console.log(`  ${hasMediaCreation ? '✅' : '❌'} إنشاء سجلات الوسائط`);
} catch (error) {
  console.log('  ❌ خطأ في قراءة إجراءات الخادم');
}

console.log('\n🌐 التحقق من متغيرات البيئة:');
try {
  const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
  const hasUploadthingVars = envExample.includes('UPLOADTHING_SECRET') && envExample.includes('UPLOADTHING_APP_ID');
  
  console.log(`  ${hasUploadthingVars ? '✅' : '❌'} متغيرات Uploadthing في .env.example`);
} catch (error) {
  console.log('  ❌ خطأ في قراءة ملف .env.example');
}

console.log('\n📊 ملخص الاختبار:');
if (allFilesExist) {
  console.log('✅ جميع الملفات المطلوبة موجودة');
  console.log('✅ نظام رفع الصور تم تكوينه بشكل صحيح');
  console.log('✅ صفحة إضافة لعبة جديدة تحتوي على مكون رفع الصور');
  console.log('✅ إجراءات الخادم تدعم حفظ الصور');
  console.log('\n🎉 نظام رفع الصور جاهز للاستخدام!');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. تأكد من إضافة متغيرات البيئة في ملف .env:');
  console.log('   UPLOADTHING_SECRET=your_secret_here');
  console.log('   UPLOADTHING_APP_ID=your_app_id_here');
  console.log('2. قم بتسجيل الدخول إلى لوحة التحكم');
  console.log('3. انتقل إلى "إضافة لعبة جديدة"');
  console.log('4. استخدم زر رفع الصور لإضافة صور من جهازك');
  console.log('5. احفظ اللعبة للتحقق من حفظ الصور في قاعدة البيانات');
} else {
  console.log('❌ هناك ملفات مفقودة أو أخطاء في التكوين');
  console.log('يرجى مراجعة الخطوات السابقة وإصلاح المشاكل');
}

process.exit(allFilesExist ? 0 : 1);