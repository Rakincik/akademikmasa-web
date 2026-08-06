import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind sınıflarını güvenli bir şekilde birleştirir ve çakışmaları çözer.
 * `clsx` ile koşullu sınıfları, `tailwind-merge` ile stil çakışmalarını yönetir.
 *
 * @param inputs - Birleştirilecek sınıf değerleri dizisi
 * @returns Optimize edilmiş sınıf dizesi
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sayısal bir değeri belirtilen para birimi formatında biçimlendirir.
 * Varsayılan olarak Türk Lirası (TRY) ve standart notasyon kullanır.
 *
 * @param price - Biçimlendirilecek fiyat değeri
 * @param options - Para birimi ve notasyon seçenekleri
 * @returns Biçimlendirilmiş fiyat dizesi (Örn: ₺1.250,00)
 */
export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "TRY"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "TRY", notation = "standard" } = options

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(Number(price))
}

export function mapProduct(p: any) {
  return {
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    coverImage: p.images && p.images.length > 0 ? p.images[0] : '/placeholder-book.jpg', // Fallback image
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    inStock: p.stock > 0
  }
}

export function slugify(text: string) {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    'İ': 'i', 'ı': 'i',
    'ö': 'o', 'Ö': 'o'
  };

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars (except space and hyphen)
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Trim hyphens from start and end
}
