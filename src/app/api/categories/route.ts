import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        showInMenu: true,
      },
      orderBy: [
        { order: "asc" },
        { name: "asc" },
      ],
      include: {
        subcategories: {
          where: {
            showInMenu: true,
          },
          orderBy: [
            { order: "asc" },
            { name: "asc" },
          ],
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Kategoriler çekilemedi" }, { status: 500 });
  }
}
