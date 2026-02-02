#!/usr/bin/env node
/**
 * Verify Enhancements Script
 * سكريبت التحقق من التحسينات
 * 
 * Usage: node scripts/verify-enhancements.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 التحقق من التحسينات...\n');

const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

// ==================== FILE CHECKS ====================

console.log('📂 التحقق من الملفات...\n');

const requiredFiles = [
  // Database migrations
  'prisma/migrations/001_add_performance_indexes.sql',
  'prisma/migrations/README.md',
  'scripts/run-migrations.js',
  
  // Utilities
  'lib/utils/cache.ts',
  'lib/utils/rate-limit.ts',
  'lib/utils/security.ts',
  'lib/utils/accessibility.ts',
  'lib/utils/offline.ts',
  
  // Service Worker
  'public/service-worker.js',
  'public/manifest.json',
  'app/offline/page.tsx',
  
  // Documentation
  'docs/IMMEDIATE_RECOMMENDATIONS.md',
  'docs/SETUP_GUIDE.md',
  'RECOMMENDATIONS_APPLIED.md',
  'تعليمات_التحسينات.md',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ ${file}`);
  } else {
    checks.failed.push(`❌ ${file} - مفقود`);
  }
});

// ==================== ENVIRONMENT CHECKS ====================

console.log('\n🔐 التحقق من متغيرات البيئة...\n');

const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
];

const optionalEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

// Try to load .env file
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    requiredEnvVars.forEach(varName => {
      if (envContent.includes(`${varName}=`)) {
        checks.passed.push(`✅ ${varName} - موجود`);
      } else {
        checks.failed.push(`❌ ${varName} - مفقود (مطلوب)`);
      }
    });
    
    optionalEnvVars.forEach(varName => {
      if (envContent.includes(`${varName}=`)) {
        checks.passed.push(`✅ ${varName} - موجود (اختياري)`);
      } else {
        checks.warnings.push(`⚠️  ${varName} - مفقود (اختياري)`);
      }
    });
  } else {
    checks.failed.push('❌ ملف .env مفقود');
    checks.warnings.push('⚠️  انسخ .env.template إلى .env وعدّل القيم');
  }
} catch (error) {
  checks.failed.push(`❌ خطأ في قراءة ملف .env: ${error.message}`);
}

// ==================== PACKAGE.JSON CHECKS ====================

console.log('\n📦 التحقق من package.json...\n');

try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredScripts = [
    'db:migrate:run',
    'test:enhancements',
    'cache:clear',
  ];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      checks.passed.push(`✅ Script: ${script}`);
    } else {
      checks.failed.push(`❌ Script: ${script} - مفقود`);
    }
  });
  
  // Check for optional dependencies
  const optionalDeps = [
    '@upstash/ratelimit',
    '@upstash/redis',
  ];
  
  optionalDeps.forEach(dep => {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    
    if (allDeps[dep]) {
      checks.passed.push(`✅ Dependency: ${dep} (اختياري)`);
    } else {
      checks.warnings.push(`⚠️  Dependency: ${dep} - غير مثبت (اختياري)`);
    }
  });
} catch (error) {
  checks.failed.push(`❌ خطأ في قراءة package.json: ${error.message}`);
}

// ==================== CODE CHECKS ====================

console.log('\n💻 التحقق من الكود...\n');

// Check if cache.ts has unstable_cache import
try {
  const cachePath = path.join(__dirname, '..', 'lib', 'utils', 'cache.ts');
  const cacheContent = fs.readFileSync(cachePath, 'utf8');
  
  if (cacheContent.includes('unstable_cache')) {
    checks.passed.push('✅ نظام التخزين المؤقت - unstable_cache موجود');
  } else {
    checks.failed.push('❌ نظام التخزين المؤقت - unstable_cache مفقود');
  }
  
  if (cacheContent.includes('CacheTags')) {
    checks.passed.push('✅ نظام التخزين المؤقت - CacheTags موجود');
  } else {
    checks.failed.push('❌ نظام التخزين المؤقت - CacheTags مفقود');
  }
} catch (error) {
  checks.failed.push(`❌ خطأ في فحص cache.ts: ${error.message}`);
}

// Check if security.ts has SecretsManager
try {
  const securityPath = path.join(__dirname, '..', 'lib', 'utils', 'security.ts');
  const securityContent = fs.readFileSync(securityPath, 'utf8');
  
  if (securityContent.includes('SecretsManager')) {
    checks.passed.push('✅ الأمان - SecretsManager موجود');
  } else {
    checks.failed.push('❌ الأمان - SecretsManager مفقود');
  }
  
  if (securityContent.includes('CsrfTokenManager')) {
    checks.passed.push('✅ الأمان - CsrfTokenManager موجود');
  } else {
    checks.failed.push('❌ الأمان - CsrfTokenManager مفقود');
  }
  
  if (securityContent.includes('generate2FASecret')) {
    checks.passed.push('✅ الأمان - 2FA موجود');
  } else {
    checks.failed.push('❌ الأمان - 2FA مفقود');
  }
} catch (error) {
  checks.failed.push(`❌ خطأ في فحص security.ts: ${error.message}`);
}

// Check middleware.ts for rate limiting
try {
  const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  if (middlewareContent.includes('checkRateLimit')) {
    checks.passed.push('✅ Middleware - Rate Limiting موجود');
  } else {
    checks.warnings.push('⚠️  Middleware - Rate Limiting مفقود');
  }
  
  if (middlewareContent.includes('X-Content-Type-Options')) {
    checks.passed.push('✅ Middleware - Security Headers موجودة');
  } else {
    checks.warnings.push('⚠️  Middleware - Security Headers مفقودة');
  }
} catch (error) {
  checks.warnings.push(`⚠️  خطأ في فحص middleware.ts: ${error.message}`);
}

// ==================== RESULTS ====================

console.log('\n' + '='.repeat(60));
console.log('📊 نتائج التحقق\n');

console.log(`✅ نجح: ${checks.passed.length}`);
console.log(`❌ فشل: ${checks.failed.length}`);
console.log(`⚠️  تحذيرات: ${checks.warnings.length}\n`);

if (checks.failed.length > 0) {
  console.log('❌ الفشل:\n');
  checks.failed.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (checks.warnings.length > 0) {
  console.log('⚠️  التحذيرات:\n');
  checks.warnings.forEach(item => console.log(`   ${item}`));
  console.log('');
}

console.log('='.repeat(60) + '\n');

// ==================== RECOMMENDATIONS ====================

if (checks.failed.length > 0) {
  console.log('📝 التوصيات:\n');
  
  if (checks.failed.some(f => f.includes('.env'))) {
    console.log('   1. انسخ .env.template إلى .env:');
    console.log('      cp .env.template .env\n');
  }
  
  if (checks.failed.some(f => f.includes('Script'))) {
    console.log('   2. تأكد من تحديث package.json بالسكريبتات الجديدة\n');
  }
  
  console.log('   3. راجع docs/IMMEDIATE_RECOMMENDATIONS.md للتفاصيل الكاملة\n');
}

if (checks.warnings.length > 0) {
  console.log('💡 اقتراحات:\n');
  
  if (checks.warnings.some(w => w.includes('UPSTASH'))) {
    console.log('   • لتفعيل Rate Limiting الموزع:');
    console.log('     npm install @upstash/ratelimit @upstash/redis\n');
  }
  
  if (checks.warnings.some(w => w.includes('CLOUDINARY'))) {
    console.log('   • لتفعيل رفع الصور:');
    console.log('     أضف إعدادات Cloudinary في .env\n');
  }
}

// ==================== NEXT STEPS ====================

console.log('🚀 الخطوات التالية:\n');
console.log('   1. تطبيق الفهارس:');
console.log('      node scripts/run-migrations.js\n');
console.log('   2. اختبار التحسينات:');
console.log('      npm run test:enhancements\n');
console.log('   3. إعادة بناء المشروع:');
console.log('      npm run build\n');

// Exit with appropriate code
if (checks.failed.length > 0) {
  console.log('❌ التحقق فشل - يرجى إصلاح المشاكل أعلاه\n');
  process.exit(1);
} else {
  console.log('✅ التحقق نجح - جميع التحسينات مطبقة بشكل صحيح!\n');
  process.exit(0);
}
