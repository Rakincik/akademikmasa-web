import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getMuroPackages } from '@/lib/muro';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    // Admin check if needed (or allow authenticated admin)
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const muroGroups: Array<{ id: string; name: string; code: string; type?: string }> = [];

    // 1. Fetch packages from MURO Connect API using X-Muro-Key
    try {
      const packages = await getMuroPackages();
      if (Array.isArray(packages)) {
        packages.forEach((pkg: any) => {
          muroGroups.push({
            id: pkg.id?.toString() || pkg.code || pkg.name,
            name: pkg.name || pkg.title || pkg.code || pkg.id,
            code: pkg.code || pkg.identifier || pkg.id?.toString() || pkg.name,
            type: 'Paket'
          });
        });
      }
    } catch (err: any) {
      console.warn('MURO Connect packages fetch error:', err.message);
    }

    // 2. Also pull all previously saved / distinct lmsCourseIds from our own Database
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
