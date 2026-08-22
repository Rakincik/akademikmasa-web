/**
 * MURO LMS Connect REST API Client
 * Kurum: Akademik Masa (online.akademikmasa.com)
 */

const MURO_API_URL = process.env.MURO_API_URL || "https://online.akademikmasa.com/api/v1";
const MURO_API_KEY = process.env.MURO_API_KEY || "muro_live_3b06fbf8fd9fe828f60c896eb7c89251";

export interface MuroPackage {
  id: string;
  code: string;
  name: string;
  description?: string;
  price?: number;
  durationDays?: number;
  courseTitles?: string[];
  [key: string]: any;
}

export interface MuroGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  educationType?: string;
  memberCount?: number;
  courseTitles?: string[];
  [key: string]: any;
}

export interface EnrollStudentParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  packageCode: string;
  orderId?: string;
  sendWelcomeSms?: boolean;
}

export interface EnrollStudentResponse {
  success: boolean;
  message?: string;
  magic_login_url?: string;
  student_id?: string;
  [key: string]: any;
}

export interface LiveStatusResponse {
  isLiveNow: boolean;
  sessionTitle?: string | null;
  courseTitle?: string | null;
  instructorName?: string | null;
  startedAt?: string | null;
  viewerCount?: number;
  joinUrl?: string | null;
  [key: string]: any;
}

/**
 * 1. FONKSİYON: MURO'daki tüm aktif paketleri ve fiyatları çeker.
 */
export async function getMuroPackages(): Promise<MuroPackage[]> {
  try {
    const res = await fetch(`${MURO_API_URL}/connect/packages`, {
      headers: {
        "X-Muro-Key": MURO_API_KEY,
        "Accept": "application/json"
      },
      next: { revalidate: 60 } // Next.js: Her 60 saniyede bir ISR önbellek yenileme
    });

    if (!res.ok) {
      console.error(`MURO paket listesi çekilemedi (HTTP ${res.status}):`, await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("MURO paket listesi çekilirken ağ hatası:", err);
    return [];
  }
}

/**
 * 2. FONKSİYON: MURO'daki tüm canlı ders gruplarını çeker.
 */
export async function getMuroGroups(): Promise<MuroGroup[]> {
  try {
    const res = await fetch(`${MURO_API_URL}/connect/groups`, {
      headers: {
        "X-Muro-Key": MURO_API_KEY,
        "Accept": "application/json"
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error(`MURO grup listesi çekilemedi (HTTP ${res.status}):`, await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("MURO grup listesi çekilirken ağ hatası:", err);
    return [];
  }
}

/**
 * 3. FONKSİYON: Öğrenciyi açar, pakete/gruba ekler, SMS gönderir ve Magic Login linki döner.
 */
export async function enrollMuroStudent(
  data: EnrollStudentParams
): Promise<EnrollStudentResponse> {
  try {
    // Telefon numarasını temizle (Sadece rakamlar, son 10 hane veya 0'lı format)
    const rawPhone = (data.phone || "").replace(/\D/g, "");
    const formattedPhone = rawPhone.length === 10 ? `0${rawPhone}` : rawPhone;

    const payload = {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email: data.email.trim(),
      phone: formattedPhone || undefined,
      package_code: data.packageCode.trim(),
      order_id: data.orderId,
      send_welcome_sms: data.sendWelcomeSms ?? true
    };

    const res = await fetch(`${MURO_API_URL}/connect/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Muro-Key": MURO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();
    return responseData;
  } catch (err: any) {
    console.error("MURO öğrenci kaydı API hatası:", err);
    return {
      success: false,
      message: err.message || "MURO LMS sunucu bağlantı hatası"
    };
  }
}

/**
 * 4. FONKSİYON: Ücretsiz deneme formlarından 7 günlük demo hesabı oluşturur.
 */
export async function createDemoLeadMuroStudent(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  packageCode?: string;
}): Promise<EnrollStudentResponse> {
  try {
    const rawPhone = (data.phone || "").replace(/\D/g, "");
    const formattedPhone = rawPhone.length === 10 ? `0${rawPhone}` : rawPhone;

    const res = await fetch(`${MURO_API_URL}/connect/demo-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Muro-Key": MURO_API_KEY
      },
      body: JSON.stringify({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim(),
        phone: formattedPhone || undefined,
        package_code: data.packageCode
      })
    });

    return await res.json();
  } catch (err: any) {
    console.error("MURO Demo Lead API hatası:", err);
    return {
      success: false,
      message: err.message || "MURO LMS sunucu bağlantı hatası"
    };
  }
}

/**
 * 5. FONKSİYON: İade veya iptal durumunda paketi öğrenciden kaldırır.
 */
export async function unenrollMuroStudent(data: {
  email: string;
  packageCode: string;
  reason?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${MURO_API_URL}/connect/unenroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Muro-Key": MURO_API_KEY
      },
      body: JSON.stringify({
        email: data.email.trim(),
        package_code: data.packageCode.trim(),
        reason: data.reason || "Kullanıcı talebi / Sipariş iptali"
      })
    });

    return await res.json();
  } catch (err: any) {
    console.error("MURO Unenroll API hatası:", err);
    return {
      success: false,
      message: err.message || "MURO LMS sunucu bağlantı hatası"
    };
  }
}

/**
 * 6. FONKSİYON: Canlı yayın durumu sorgulama (Canlı yayın bandı için).
 */
export async function getMuroLiveStatus(): Promise<LiveStatusResponse> {
  try {
    const res = await fetch(`${MURO_API_URL}/connect/live-status`, {
      headers: {
        "X-Muro-Key": MURO_API_KEY
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      return { isLiveNow: false };
    }
    const data = await res.json();
    return {
      isLiveNow: Boolean(data.is_live_now || data.isLiveNow),
      sessionTitle: data.session_title || data.sessionTitle || null,
      courseTitle: data.course_title || data.courseTitle || null,
      instructorName: data.instructor_name || data.instructorName || null,
      startedAt: data.started_at || data.startedAt || null,
      viewerCount: data.viewer_count ?? data.viewerCount ?? 0,
      joinUrl: data.join_url || data.joinUrl || null
    };
  } catch {
    return { isLiveNow: false };
  }
}
