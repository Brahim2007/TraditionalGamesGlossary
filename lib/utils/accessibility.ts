/**
 * Accessibility Utilities
 * أدوات إمكانية الوصول
 * 
 * This module provides utilities for improving accessibility (a11y)
 * يوفر هذا الوحدة أدوات لتحسين إمكانية الوصول
 */

// ==================== ARIA LABELS ====================

/**
 * ARIA label constants for common UI elements
 * ثوابت تسميات ARIA لعناصر واجهة المستخدم الشائعة
 */
export const AriaLabels = {
  // Navigation
  mainNav: 'التنقل الرئيسي',
  breadcrumb: 'مسار التنقل',
  pagination: 'التنقل بين الصفحات',
  skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  
  // Search
  searchForm: 'نموذج البحث',
  searchInput: 'مربع البحث',
  searchButton: 'زر البحث',
  searchResults: 'نتائج البحث',
  clearSearch: 'مسح البحث',
  
  // Forms
  requiredField: 'حقل مطلوب',
  optionalField: 'حقل اختياري',
  formError: 'خطأ في النموذج',
  formSuccess: 'تم إرسال النموذج بنجاح',
  
  // Buttons
  submit: 'إرسال',
  cancel: 'إلغاء',
  save: 'حفظ',
  delete: 'حذف',
  edit: 'تعديل',
  close: 'إغلاق',
  menu: 'القائمة',
  
  // Game-specific
  gameCard: 'بطاقة لعبة',
  gameDetails: 'تفاصيل اللعبة',
  gameImage: 'صورة اللعبة',
  gameGallery: 'معرض صور اللعبة',
  addGame: 'إضافة لعبة جديدة',
  editGame: 'تعديل اللعبة',
  deleteGame: 'حذف اللعبة',
  
  // Dashboard
  dashboard: 'لوحة التحكم',
  statistics: 'الإحصائيات',
  recentGames: 'الألعاب الحديثة',
  pendingReviews: 'المراجعات المعلقة',
  
  // Filters
  filterPanel: 'لوحة التصفية',
  filterByCountry: 'التصفية حسب الدولة',
  filterByType: 'التصفية حسب النوع',
  filterByStatus: 'التصفية حسب الحالة',
  clearFilters: 'مسح جميع التصفيات',
  
  // Modals
  modal: 'نافذة منبثقة',
  closeModal: 'إغلاق النافذة المنبثقة',
  
  // Loading
  loading: 'جاري التحميل',
  loadingMore: 'جاري تحميل المزيد',
  
  // Alerts
  successAlert: 'تنبيه نجاح',
  errorAlert: 'تنبيه خطأ',
  warningAlert: 'تنبيه تحذير',
  infoAlert: 'تنبيه معلومات',
};

/**
 * Generate ARIA label for game card
 * إنشاء تسمية ARIA لبطاقة اللعبة
 */
export function getGameCardAriaLabel(gameName: string, country: string): string {
  return `لعبة ${gameName} من ${country}`;
}

/**
 * Generate ARIA label for page navigation
 * إنشاء تسمية ARIA للتنقل بين الصفحات
 */
export function getPageAriaLabel(currentPage: number, totalPages: number): string {
  return `الصفحة ${currentPage} من ${totalPages}`;
}

/**
 * Generate ARIA label for filter count
 * إنشاء تسمية ARIA لعدد التصفيات
 */
export function getFilterCountAriaLabel(count: number): string {
  return `${count} ${count === 1 ? 'تصفية نشطة' : 'تصفيات نشطة'}`;
}

/**
 * Generate ARIA label for result count
 * إنشاء تسمية ARIA لعدد النتائج
 */
export function getResultCountAriaLabel(count: number, total: number): string {
  return `عرض ${count} من ${total} نتيجة`;
}

// ==================== ARIA ATTRIBUTES ====================

/**
 * ARIA attributes for interactive elements
 * سمات ARIA للعناصر التفاعلية
 */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-owns'?: string;
  role?: string;
}

/**
 * Get ARIA attributes for button
 * الحصول على سمات ARIA للزر
 */
export function getButtonAriaAttributes(
  label: string,
  options?: {
    pressed?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    controls?: string;
  }
): AriaAttributes {
  return {
    'aria-label': label,
    'aria-pressed': options?.pressed,
    'aria-expanded': options?.expanded,
    'aria-disabled': options?.disabled,
    'aria-controls': options?.controls,
  };
}

/**
 * Get ARIA attributes for input field
 * الحصول على سمات ARIA لحقل الإدخال
 */
export function getInputAriaAttributes(
  label: string,
  options?: {
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
  }
): AriaAttributes {
  return {
    'aria-label': label,
    'aria-required': options?.required,
    'aria-invalid': options?.invalid,
    'aria-describedby': options?.describedBy,
  };
}

/**
 * Get ARIA attributes for modal
 * الحصول على سمات ARIA للنافذة المنبثقة
 */
export function getModalAriaAttributes(
  title: string,
  describedBy?: string
): AriaAttributes {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `${title}-title`,
    'aria-describedby': describedBy,
  } as AriaAttributes;
}

/**
 * Get ARIA attributes for alert
 * الحصول على سمات ARIA للتنبيه
 */
export function getAlertAriaAttributes(
  type: 'success' | 'error' | 'warning' | 'info',
  live: 'polite' | 'assertive' = 'polite'
): AriaAttributes {
  const labels = {
    success: AriaLabels.successAlert,
    error: AriaLabels.errorAlert,
    warning: AriaLabels.warningAlert,
    info: AriaLabels.infoAlert,
  };
  
  return {
    role: 'alert',
    'aria-live': live,
    'aria-label': labels[type],
  };
}

// ==================== KEYBOARD NAVIGATION ====================

/**
 * Keyboard navigation keys
 * مفاتيح التنقل بلوحة المفاتيح
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * Check if key is navigation key
 * التحقق إذا كان المفتاح مفتاح تنقل
 */
export function isNavigationKey(key: string): boolean {
  return Object.values(KeyboardKeys).includes(key);
}

/**
 * Handle keyboard navigation for list
 * معالجة التنقل بلوحة المفاتيح للقائمة
 */
export function handleListKeyboardNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  itemCount: number,
  onSelect: (index: number) => void
): void {
  switch (event.key) {
    case KeyboardKeys.ARROW_UP:
      event.preventDefault();
      if (currentIndex > 0) {
        onSelect(currentIndex - 1);
      }
      break;
    
    case KeyboardKeys.ARROW_DOWN:
      event.preventDefault();
      if (currentIndex < itemCount - 1) {
        onSelect(currentIndex + 1);
      }
      break;
    
    case KeyboardKeys.HOME:
      event.preventDefault();
      onSelect(0);
      break;
    
    case KeyboardKeys.END:
      event.preventDefault();
      onSelect(itemCount - 1);
      break;
    
    case KeyboardKeys.ENTER:
    case KeyboardKeys.SPACE:
      event.preventDefault();
      // Trigger selection
      break;
  }
}

// ==================== FOCUS MANAGEMENT ====================

/**
 * Trap focus within element
 * حصر التركيز داخل عنصر
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== KeyboardKeys.TAB) return;
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstFocusable?.focus();
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Restore focus to previous element
 * استعادة التركيز إلى العنصر السابق
 */
export function createFocusManager() {
  let previousFocus: HTMLElement | null = null;
  
  return {
    save: () => {
      previousFocus = document.activeElement as HTMLElement;
    },
    restore: () => {
      previousFocus?.focus();
      previousFocus = null;
    },
  };
}

// ==================== SCREEN READER UTILITIES ====================

/**
 * Announce message to screen readers
 * الإعلان عن رسالة لقارئات الشاشة
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Create visually hidden element for screen readers
 * إنشاء عنصر مخفي بصرياً لقارئات الشاشة
 */
export function createScreenReaderOnly(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

// ==================== COLOR CONTRAST ====================

/**
 * Check if color contrast meets WCAG AA standards
 * التحقق إذا كانت تباين الألوان يلبي معايير WCAG AA
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const minRatio = largeText ? 3 : 4.5; // WCAG AA standards
  
  return ratio >= minRatio;
}

/**
 * Calculate contrast ratio between two colors
 * حساب نسبة التباين بين لونين
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of color
 * الحصول على السطوع النسبي للون
 */
function getRelativeLuminance(color: string): number {
  // Simplified calculation - in production, use a proper color library
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 * تحويل اللون من hex إلى RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// ==================== ACCESSIBILITY CHECKER ====================

/**
 * Check accessibility of element
 * التحقق من إمكانية الوصول للعنصر
 */
export function checkElementAccessibility(element: HTMLElement): {
  passed: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Check for alt text on images
  if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
    issues.push('Image missing alt text');
  }
  
  // Check for labels on inputs
  if (element.tagName === 'INPUT' && !element.getAttribute('aria-label') && !element.getAttribute('id')) {
    issues.push('Input missing label or aria-label');
  }
  
  // Check for button text
  if (element.tagName === 'BUTTON' && !element.textContent?.trim() && !element.getAttribute('aria-label')) {
    issues.push('Button missing text or aria-label');
  }
  
  // Check for heading hierarchy
  if (/^H[1-6]$/.test(element.tagName)) {
    const level = parseInt(element.tagName[1]);
    const prevHeading = element.previousElementSibling;
    if (prevHeading && /^H[1-6]$/.test(prevHeading.tagName)) {
      const prevLevel = parseInt(prevHeading.tagName[1]);
      if (level > prevLevel + 1) {
        warnings.push('Heading hierarchy skipped');
      }
    }
  }
  
  // Check for interactive elements without keyboard access
  if (element.onclick && !element.getAttribute('tabindex') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
    warnings.push('Interactive element not keyboard accessible');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

// ==================== EXPORT TYPES ====================

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReaderAnnouncements: boolean;
  enableFocusManagement: boolean;
  highContrastMode: boolean;
}

export type AriaRole = 
  | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner'
  | 'button' | 'checkbox' | 'dialog' | 'form' | 'grid' | 'gridcell'
  | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem'
  | 'main' | 'menu' | 'menubar' | 'menuitem' | 'navigation'
  | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row'
  | 'search' | 'status' | 'tab' | 'tablist' | 'tabpanel'
  | 'textbox' | 'toolbar' | 'tooltip' | 'tree' | 'treeitem';
