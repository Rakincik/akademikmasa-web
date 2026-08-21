import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    // Admin check if needed (or allow authenticated admin)
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const MURO_API_URL = process.env.MURO_API_URL || 'https://akm-api.muro.click';
    const adminEmail = process.env.MURO_ADMIN_EMAIL;
    const adminPassword = process.env.MURO_ADMIN_PASSWORD;
    let token = process.env.MURO_ADMIN_TOKEN || '';

    let muroGroups: Array<{ id: string; name: string; code: string; type?: string }> = [];

    // 1. If we have admin credentials and no static token, attempt login
    if (!token && adminEmail && adminPassword) {
      try {
        const loginRes = await fetch(`${MURO_API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail, password: adminPassword })
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          token = loginData.accessToken || loginData.token || '';
        }
      } catch (err: any) {
        console.warn('MURO LMS login attempt failed:', err.message);
      }
    }

    // 2. If token is available, fetch packages and groups from MURO
    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      try {
        const [packagesRes, groupsRes] = await Promise.allSettled([
          fetch(`${MURO_API_URL}/api/v1/packages`, { headers }),
          fetch(`${MURO_API_URL}/api/v1/groups`, { headers })
        ]);

        if (packagesRes.status === 'fulfilled' && packagesRes.value.ok) {
          const packages = await packagesRes.value.json();
          if (Array.isArray(packages)) {
            packages.forEach((pkg: any) => {
              muroGroups.push({
                id: pkg.id?.toString() || pkg.identifier || pkg.code || pkg.name,
                name: pkg.name || pkg.title || pkg.identifier || pkg.id,
                code: pkg.identifier || pkg.code || pkg.id?.toString() || pkg.name,
                type: 'Paket'
              });
            });
          }
        }

        if (groupsRes.status === 'fulfilled' && groupsRes.value.ok) {
          const groups = await groupsRes.value.json();
          if (Array.isArray(groups)) {
            groups.forEach((grp: any) => {
              muroGroups.push({
                id: grp.id?.toString() || grp.code || grp.name,
                name: grp.name || grp.title || grp.code || grp.id,
                code: grp.code || grp.identifier || grp.id?.toString() || grp.name,
                type: 'Grup'
              });
            });
          }
        }
      } catch (fetchErr: any) {
        console.warn('Failed to fetch from MURO API:', fetchErr.message);
      }
    }

    // 3. Also pull all previously saved / distinct lmsCourseIds from our own Database
    try {
      const products = await prisma.product.findMany({
        select: { lmsCourseId: true, lmsCourseIds: true, title: true }
      });

      const existingCodes = new Set(muroGroups.map(g => g.code));

      for (const p of products) {
        const allCodes = [...(p.lmsCourseIds || [])];
        if (p.lmsCourseId && !allCodes.includes(p.lmsCourseId)) {
          allCodes.push(p.lmsCourseId);
        }

        for (const code of allCodes) {
          if (code && !existingCodes.has(code)) {
            existingCodes.add(code);
            muroGroups.push({
              id: code,
              name: code,
              code: code,
              type: 'Kayıtlı'
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn('Could not read existing LMS codes from DB:', dbErr);
    }

    return NextResponse.json({
      success: true,
      groups: muroGroups
    });
  } catch (error: any) {
    console.error('MURO Groups API Error:', error);
    return NextResponse.json({ success: false, groups: [], error: error.message }, { status: 500 });
  }
}
