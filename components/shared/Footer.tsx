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
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-500">من إعداد:</span>
              <a
                href="https://www.linkedin.com/in/kertiou-brahim-37654940/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Kertiou Brahim
              </a>
            </div>
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
