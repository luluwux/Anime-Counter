/**
 * HTML/XML özel karakterlerini kaçış karakterlerine (escape) dönüştürür.
 * SVG içerisine kullanıcı verisi enjekte edilirken XSS saldırılarını önler.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>'"]/g, (tag) => {
    const chars: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    };
    return chars[tag] || tag;
  });
}

/**
 * Gelen rengin yalnızca güvenli hexadecimal veya güvenli CSS renk ismi olduğunu doğrular.
 * Aksi takdirde varsayılan rengi döndürür. SVG özellik enjeksiyonunu engeller.
 */
export function validateColor(color: string | undefined, defaultColor: string): string {
  if (!color) return defaultColor;
  
  const cleanColor = color.trim().replace('#', '');
  
  // 3, 4, 6 veya 8 haneli hexadecimal renk kontrolü (örn: fff, ff0000, ff0000ff)
  const isHex = /^[0-9A-Fa-f]{3,4}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(cleanColor);
  
  // Basit güvenli CSS renk isimleri (sadece a-z harfleri, örn: red, blue, darkgray)
  const isSafeName = /^[a-zA-Z]+$/.test(cleanColor);
  
  if (isHex) {
    return `#${cleanColor}`;
  }
  
  if (isSafeName) {
    return cleanColor;
  }
  
  return defaultColor;
}
