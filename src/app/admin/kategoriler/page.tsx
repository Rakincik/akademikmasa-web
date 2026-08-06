import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import KategorilerClient from "./KategorilerClient";

export default async function KategorilerPage() {
  async function addCategory(formData: FormData) {
    "use server";
    try {
      const name = (formData.get("name") as string)?.trim();
      const parentId = (formData.get("parentId") as string) || null;
      const showInMenu = formData.get("showInMenu") === "on";
      const orderVal = parseInt((formData.get("order") as string) || "0", 10);

      if (!name) return;

      const slug = name
        .toLocaleLowerCase("tr-TR")
        .trim()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ name }, { slug }]
        }
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            name,
            slug,
            parentId: parentId || null,
            showInMenu,
            order: isNaN(orderVal) ? 0 : orderVal,
          },
        });
      }

      revalidatePath("/admin/kategoriler");
      revalidatePath("/");
    } catch (error) {
      console.error("Kategori eklenirken hata oluştu:", error);
    }
  }

  async function updateCategory(formData: FormData) {
    "use server";
    try {
      const id = formData.get("id") as string;
      const name = (formData.get("name") as string)?.trim();
      const parentId = (formData.get("parentId") as string) || null;
      const showInMenu = formData.get("showInMenu") === "on";
      const orderVal = parseInt((formData.get("order") as string) || "0", 10);

      if (!id || !name) return;

      const slug = name
        .toLocaleLowerCase("tr-TR")
        .trim()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          parentId: parentId || null,
          showInMenu,
          order: isNaN(orderVal) ? 0 : orderVal,
        },
      });

      revalidatePath("/admin/kategoriler");
      revalidatePath("/");
    } catch (error) {
      console.error("Kategori güncellenirken hata oluştu:", error);
    }
  }

  async function toggleShowInMenu(formData: FormData) {
    "use server";
    try {
      const id = formData.get("id") as string;
      const currentStatus = formData.get("currentStatus") === "true";
      if (!id) return;

      await prisma.category.update({
        where: { id },
        data: { showInMenu: !currentStatus },
      });

      revalidatePath("/admin/kategoriler");
      revalidatePath("/");
    } catch (error) {
      console.error("Menü görünürlüğü değiştirilirken hata oluştu:", error);
    }
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    try {
      const id = formData.get("id") as string;
      if (!id) return;

      await prisma.category.delete({ where: { id } });
      revalidatePath("/admin/kategoriler");
      revalidatePath("/");
    } catch (error) {
      console.error("Kategori silinirken hata oluştu:", error);
    }
  }

  // Fetch parent categories for dropdown selection
  const mainCategoriesList = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  // Fetch full category hierarchy
  const allCategories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      subcategories: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: {
          _count: { select: { products: true } },
        },
      },
      _count: { select: { products: true } },
    },
  });

  const rootCategories = allCategories.filter((c) => !c.parentId);

  return (
    <KategorilerClient
      rootCategories={rootCategories}
      mainCategoriesList={mainCategoriesList}
      addCategoryAction={addCategory}
      updateCategoryAction={updateCategory}
      toggleShowInMenuAction={toggleShowInMenu}
      deleteCategoryAction={deleteCategory}
    />
  );
}



