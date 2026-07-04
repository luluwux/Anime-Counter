import { describe, it, expect } from 'vitest';
import { escapeHtml, validateColor } from './utils/sanitize.js';
import app from './index.js';

describe('Güvenlik Yardımcı Araçları (Sanitize)', () => {
  it('HTML/XML karakterlerini kaçış karakterlerine dönüştürmelidir', () => {
    const payload = '<div>hello & "world"\'</div>';
    const escaped = escapeHtml(payload);
    expect(escaped).toBe('&lt;div&gt;hello &amp; &quot;world&quot;&#39;&lt;/div&gt;');
  });

  it('Geçerli hex renk kodlarını doğrulamalıdır', () => {
    expect(validateColor('fff', '#000')).toBe('#fff');
    expect(validateColor('#ff0000', '#000')).toBe('#ff0000');
    expect(validateColor('12345678', '#000')).toBe('#12345678');
  });

  it('Geçerli CSS renk isimlerini doğrulamalıdır', () => {
    expect(validateColor('red', '#000')).toBe('red');
    expect(validateColor('blue', '#000')).toBe('blue');
    expect(validateColor('DarkGray', '#000')).toBe('DarkGray');
  });

  it('Geçersiz ve enjekte edilmeye çalışılan renkleri engellemelidir', () => {
    const maliciousColor = 'red" onclick="alert(1)';
    const fallback = '#21262d';
    expect(validateColor(maliciousColor, fallback)).toBe(fallback);
    expect(validateColor('rgb(255,0,0)', fallback)).toBe(fallback);
  });
});

describe('Hono Sunucu Rotaları', () => {
  it('GET / rotası HTML oluşturucu arayüzünü dönmelidir (İngilizce)', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('Anime Counter');
    expect(html).toContain('Username');
    expect(html).toContain('Embed Codes');
    expect(html).not.toContain('Kullanıcı Adı'); // Türkçe metinler temizlenmiş olmalı
  });

  it('/themes rotası desteklenen temaları listelemelidir', async () => {
    const res = await app.request('/themes');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.type).toBe('success');
    expect(json.flat_support).toBe(true);
    expect(json.image_themes).toContain('naruto');
  });

  it('/@username rotası düzgün bir flat SVG dönmelidir', async () => {
    const res = await app.request('/@testuser');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    const svg = await res.text();
    expect(svg).toContain('<svg');
    expect(svg).toContain('<rect');
    expect(svg).toContain('1'); // İlk ziyarette sayaç 1 olmalı
  });

  it('SVG parametrelerine XSS enjeksiyonu engellenmelidir', async () => {
    const maliciousPayload = '</text><script>alert(1)</script>';
    const encodedPayload = encodeURIComponent(maliciousPayload);
    const res = await app.request(`/@testxss?icon=${encodedPayload}`);
    expect(res.status).toBe(200);
    
    const svg = await res.text();
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;/text&gt;&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('GET /@username?num=1337 veritabanını atlayıp statik sayıyı göstermelidir', async () => {
    const res = await app.request('/@testnum?num=1337');
    expect(res.status).toBe(200);
    const svg = await res.text();
    expect(svg).toContain('1.3K'); // 1337 formatted in compact mode (1.3K)
  });

  it('GET /@username?scale=2 rotası SVG genişlik ve yüksekliğini ikiye katlamalıdır', async () => {
    const resNormal = await app.request('/@testscale?scale=1');
    const svgNormal = await resNormal.text();
    // Default flat width: ~80, height: 28
    
    const resScaled = await app.request('/@testscale?scale=2');
    const svgScaled = await resScaled.text();
    
    // Check scaled width and height properties in svg element
    expect(svgScaled).toContain('width="160"');
    expect(svgScaled).toContain('height="56"');
  });
});
