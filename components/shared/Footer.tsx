'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutGrid, Twitter, Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-brand-deepest py-16 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold text-white">المسرد التوثيقي</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              المسرد التوثيقي للألعاب التراثية العربية - أول منصة رقمية شاملة تهدف إلى جمع وتوثيق الألعاب الشعبية العربية
              وفق معايير التراث غير المادي.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold text-white">روابط سريعة</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-accent"
                >
                  معرض الألعاب
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-accent"
                >
                  عن المشروع
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openSuggestGameModal')
                    window.dispatchEvent(event)
                  }}
                  className="transition-colors hover:text-accent cursor-pointer text-right"
                >
                  اقترح لعبة تراثية
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-bold text-white">التصنيفات</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/gallery?type=movement"
                  className="transition-colors hover:text-accent"
                >
                  ألعاب حركية
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery?type=mental"
                  className="transition-colors hover:text-accent"
                >
                  ألعاب ذهنية
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery?region=khaleeji"
                  className="transition-colors hover:text-accent"
                >
                  تراث خليجي
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery?type=funny"
                  className="transition-colors hover:text-accent"
                >
                  ألعاب طريفة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-white">تواصل معنا</h4>
            <p className="mb-4 text-sm text-gray-400">
              نرحب بمساهماتكم في توثيق الألعاب التراثية من مختلف الدول العربية.
            </p>
            <a
              href="mailto:info@traditionalgames.org"
              className="text-sm font-medium text-accent hover:underline"
            >
              info@traditionalgames.org
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 space-y-4">
          {/* Research Info */}
          <div className="text-center text-sm text-gray-400 leading-relaxed">
            <p className="mb-2">
              يُمثّل هذا المشروع الجانب التطبيقي لبحثٍ مرشّح لنيل{' '}
              <span className="text-accent font-semibold mx-1">
                جائزة الشارقة الدولية للتراث الثقافي – دورة 2026
              </span>
            </p>
            <p className="mb-3">
              فرع أفضل البحوث والدراسات في التراث الثقافي.
            </p>

          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-800">
            <p>
              © {new Date().getFullYear()} المسرد التوثيقي للألعاب التراثية العربية.
              جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
