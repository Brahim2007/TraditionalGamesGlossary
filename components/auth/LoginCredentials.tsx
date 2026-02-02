'use client'

// Login Credentials Component
// مكون بيانات الاختبار القابلة للنقر

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// Demo credentials data
const demoCredentials = [
  {
    role: 'مدير النظام',
    email: 'admin@example.com',
    password: 'password123',
    color: 'from-brand-deepest to-brand-deep',
    bgColor: 'bg-brand-deepest/5',
    borderColor: 'border-brand-deepest/20',
  },
  {
    role: 'مُراجع',
    email: 'reviewer@example.com',
    password: 'password123',
    color: 'from-accent to-accent-light',
    bgColor: 'bg-accent/5',
    borderColor: 'border-accent/20',
  },
  {
    role: 'محرر',
    email: 'editor@example.com',
    password: 'password123',
    color: 'from-brand-deep to-brand',
    bgColor: 'bg-brand-deep/5',
    borderColor: 'border-brand-deep/20',
  },
  {
    role: 'مستعرض',
    email: 'viewer@example.com',
    password: 'password123',
    color: 'from-gray-600 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
]

export function LoginCredentials() {
  const [selectedCredential, setSelectedCredential] = useState<{
    email: string
    password: string
  } | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCredentialClick = (email: string, password: string) => {
    setSelectedCredential({ email, password })
    
    // Dispatch custom event to fill form
    const event = new CustomEvent('credential-fill', {
      detail: { email, password }
    })
    window.dispatchEvent(event)
    
    // Also directly fill the form fields as fallback
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement
      const passwordInput = document.getElementById('password') as HTMLInputElement
      
      if (emailInput) {
        emailInput.value = email
        emailInput.dispatchEvent(new Event('input', { bubbles: true }))
        emailInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
      
      if (passwordInput) {
        passwordInput.value = password
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }, 50)
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('login-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleCopy = async (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mt-6 pt-4 border-t border-accent/20">
      <h4 className="text-sm font-bold text-brand-deepest mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-gradient-to-b from-brand-deepest to-accent rounded-full"></span>
        بيانات اختبارية (للتنمية فقط)
      </h4>
      <div className="space-y-2.5 text-xs">
        {demoCredentials.map((cred, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleCredentialClick(cred.email, cred.password)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md group cursor-pointer"
            style={{
              background: `linear-gradient(to left, ${cred.bgColor}, transparent)`,
              borderColor: cred.borderColor.replace('/20', '/30'),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cred.borderColor.replace('/20', '/50')
              e.currentTarget.style.background = `linear-gradient(to left, ${cred.bgColor.replace('/5', '/10')}, transparent)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = cred.borderColor
              e.currentTarget.style.background = `linear-gradient(to left, ${cred.bgColor}, transparent)`
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${cred.color} ring-2 ring-offset-2 ring-offset-white ring-opacity-30`}></div>
              <span className="font-bold text-brand-deepest text-sm">{cred.role}:</span>
            </div>
            <div className="text-left flex items-center gap-2">
              <div>
                <div 
                  className="text-brand-deep font-medium hover:text-brand-deepest transition-colors flex items-center gap-1.5"
                  onClick={(e) => handleCopy(cred.email, index * 2, e)}
                >
                  {cred.email}
                  {copiedIndex === index * 2 ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div 
                  className="text-accent-dark font-semibold hover:text-accent transition-colors flex items-center gap-1.5"
                  onClick={(e) => handleCopy(cred.password, index * 2 + 1, e)}
                >
                  {cred.password}
                  {copiedIndex === index * 2 + 1 ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-brand-light mt-4 text-center leading-relaxed">
        💡 انقر على أي بطاقة لملء الحقول تلقائياً
        <br />
        <span className="text-gray-400">ملاحظة: هذه بيانات اختبارية للتنمية فقط. في الإنتاج، سيتم إنشاء حسابات حقيقية.</span>
      </p>
    </div>
  )
}
