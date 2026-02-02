#!/usr/bin/env node
/**
 * Database Migration Runner
 * تشغيل ترحيلات قاعدة البيانات
 * 
 * Usage: node scripts/run-migrations.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Split SQL into statements while handling functions and procedures
 * تقسيم SQL إلى أوامر مع معالجة الدوال والإجراءات
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inFunction = false;
  let dollarQuoteTag = null;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments
    if (trimmedLine.startsWith('--')) {
      continue;
    }
    
    // Check for dollar-quoted strings ($$)
    const dollarMatches = line.match(/\$\$/g);
    if (dollarMatches) {
      for (const match of dollarMatches) {
        if (!inFunction) {
          inFunction = true;
          dollarQuoteTag = match;
        } else if (match === dollarQuoteTag) {
          inFunction = false;
          dollarQuoteTag = null;
        }
      }
    }
    
    current += line + '\n';
    
    // If we're not in a function and line ends with semicolon, it's a complete statement
    if (!inFunction && trimmedLine.endsWith(';')) {
      const statement = current.trim();
      if (statement.length > 0) {
        statements.push(statement);
      }
      current = '';
    }
  }
  
  // Add any remaining statement
  if (current.trim().length > 0) {
    statements.push(current.trim());
  }
  
  return statements;
}

async function runMigrations() {
  console.log('🚀 بدء تطبيق الترحيلات...\n');
  
  const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
  
  // قراءة جميع ملفات SQL في مجلد الترحيلات
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (files.length === 0) {
    console.log('⚠️  لم يتم العثور على ملفات ترحيل');
    return;
  }
  
  console.log(`📋 تم العثور على ${files.length} ملف(ات) ترحيل:\n`);
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log('');
  
  // تطبيق كل ترحيل
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`⏳ تطبيق: ${file}...`);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // تقسيم SQL إلى أوامر منفصلة (مع معالجة الدوال)
      const statements = splitSqlStatements(sql);
      
      let successCount = 0;
      let skipCount = 0;
      
      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement + ';');
          successCount++;
        } catch (error) {
          // تجاهل أخطاء "الفهرس موجود بالفعل"
          if (error.message.includes('already exists')) {
            skipCount++;
          } else {
            throw error;
          }
        }
      }
      
      console.log(`   ✅ نجح: ${successCount} أمر`);
      if (skipCount > 0) {
        console.log(`   ⏭️  تم تخطي: ${skipCount} أمر (موجود بالفعل)`);
      }
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ فشل: ${error.message}\n`);
      throw error;
    }
  }
  
  // عرض الإحصائيات
  console.log('📊 عرض الإحصائيات...\n');
  
  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_games,
        COUNT(*) FILTER (WHERE "reviewStatus" = 'published') as published_games,
        COUNT(*) FILTER (WHERE "reviewStatus" = 'draft') as draft_games
      FROM "Game"
    `;
    
    if (stats && stats.length > 0) {
      const { total_games, published_games, draft_games } = stats[0];
      console.log(`   📚 إجمالي الألعاب: ${total_games}`);
      console.log(`   ✅ منشور: ${published_games}`);
      console.log(`   📝 مسودة: ${draft_games}`);
    }
  } catch (error) {
    console.log('   ⚠️  تعذر عرض الإحصائيات');
  }
  
  console.log('\n🎉 اكتملت جميع الترحيلات بنجاح!');
}

// تشغيل الترحيلات
runMigrations()
  .catch((error) => {
    console.error('\n❌ خطأ في تطبيق الترحيلات:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
