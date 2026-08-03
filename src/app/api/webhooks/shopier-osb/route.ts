import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resPayload = formData.get('res')?.toString();
    const hashPayload = formData.get('hash')?.toString();

    if (!resPayload || !hashPayload) {
      console.error('Shopier OSB: Eksik parametre');
      return new Response('Missing parameters', { status: 400 });
    }

    const username = process.env.SHOPIER_OSB_USERNAME || '';
    const key = process.env.SHOPIER_OSB_PASSWORD || '';

    const expectedHash = crypto
      .createHmac('sha256', key)
      .update(resPayload + username)
      .digest('hex');

    if (expectedHash !== hashPayload) {
      console.error('Shopier OSB: Imza hatali');
      return new Response('Invalid signature', { status: 401 });
    }

    const decodedRes = Buffer.from(resPayload, 'base64').toString('utf-8');
    const data = JSON.parse(decodedRes);
    
    console.log('Shopier OSB payload:', data);

    const userEmail = data.email;
    
    if (!userEmail) {
      console.error('Shopier OSB: Email bulunamadi');
      return new Response('Email missing', { status: 400 });
    }

    // Email adresine göre kullanıcının en son oluşturulan PENDING siparişini bul
    const orders = await prisma.order.findMany({
      where: { 
        user: { email: userEmail },
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (orders.length === 0) {
      console.warn(`Shopier OSB: ${userEmail} için bekleyen sipariş bulunamadı.`);
      // Shopier'in tekrar tekrar denememesi için 200 dönüyoruz
      return new Response('Order not found but accepted', { status: 200 });
    }

    const order = orders[0];

    // Siparişi COMPLETED yap, kupon kullanımını ve cirosunu artır
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' }
    });

    if (order.couponId) {
      await prisma.coupon.update({
        where: { id: order.couponId },
        data: {
          usedCount: { increment: 1 },
          totalRevenue: { increment: order.totalAmount }
        }
      });
      console.log(`OSB Kupon (${order.couponId}) kullanım sayısı ve cirosu artırıldı. Sipariş tutarı: ${order.totalAmount}`);
    }

    console.log(`OSB ile sipariş başarıyla onaylandı ve COMPLETED oldu. Order ID: ${order.id}`);

    // LMS sırasına ekle
    const hasLmsCourse = order.items.some((item: any) => item.product?.lmsCourseId);
    if (hasLmsCourse) {
      const existingJob = await prisma.lmsQueue.findUnique({ where: { orderId: order.id } });
      if (!existingJob) {
        await prisma.lmsQueue.create({
          data: { orderId: order.id, status: 'PENDING' }
        });
        console.log(`LmsQueue kaydı oluşturuldu (Order ID: ${order.id})`);
      }
      
      // Arka planda LMS kuyruğunu eritmek için worker'ı tetikle
      try {
        const workerPath = ['src', 'workers', 'lms-queue-worker.js'].join('/');
        const child = spawn('node', [workerPath, '--once'], {
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
      } catch (spawnErr) {
        console.error('LMS Worker spawn error:', spawnErr);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Shopier OSB Error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
