/**
 * Cloudflare KV veritabanına ulaşılamaması veya hata oluşması durumunda
 * uygulamanın çalışmaya devam edebilmesi için bellek içi yedek hafıza.
 */
const memoryFallback = new Map<string, number>();

/**
 * Belirtilen kullanıcının sayaç değerini alır ve (renderOnly false ise) 1 artırır.
 * KV bağlantısı veya kotası hataya düşerse in-memory fallback mekanizmasına geçer.
 * 
 * @param kv Cloudflare KV Namespace nesnesi
 * @param username Temizlenmiş kullanıcı adı
 * @param renderOnly Sadece görüntülenecek mi (artırılmayacak mı)?
 */
export async function getAndIncrement(
  kv: KVNamespace | undefined,
  username: string,
  renderOnly: boolean
): Promise<number> {
  const key = `counter:${username}`;

  // KV binding'i eksikse (örn: lokal testlerde KV tanımlanmamışsa) in-memory çalış
  if (!kv) {
    const current = memoryFallback.get(key) || 0;
    if (renderOnly) {
      return current;
    }
    const next = current + 1;
    memoryFallback.set(key, next);
    return next;
  }

  try {
    const val = await kv.get(key);
    let count = val ? parseInt(val, 10) : 0;
    if (isNaN(count)) {
      count = 0;
    }

    if (renderOnly) {
      return count;
    }

    const nextCount = count + 1;
    // KV'ye asenkron olarak yeni değeri yaz
    await kv.put(key, nextCount.toString());
    
    // Bellek içi yedeği de güncelle
    memoryFallback.set(key, nextCount);
    
    return nextCount;
  } catch (err) {
    console.error(`⚠️ KV Hatası (Anahtar: ${key}):`, err);
    
    // KV hatası durumunda in-memory yedek hafızadan devam et (Hata Toleransı)
    const current = memoryFallback.get(key) || 0;
    if (renderOnly) {
      return current;
    }
    const next = current + 1;
    memoryFallback.set(key, next);
    return next;
  }
}
