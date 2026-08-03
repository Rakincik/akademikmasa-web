"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, GripVertical } from "lucide-react";
import ProductModal from "@/components/admin/ProductModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { deleteProduct, updateProductOrder } from "./actions";

export default function KurslarClient({ products, instructors, categories }: { products: any[], instructors: any[], categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Drag & Drop States
  const [productList, setProductList] = useState(products);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync initial props
  useEffect(() => {
    setProductList(products);
  }, [products]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
    } catch (e) {
      console.error(e);
    }
    setProductToDelete(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, position: number) => {
    dragItem.current = position;
    // Küçük bir görsel ayar (opsiyonel)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, position: number) => {
    e.preventDefault();
    dragOverItem.current = position;
    
    // Görsel olarak anında yer değiştirme
    const listCopy = [...productList];
    const draggedItemContent = listCopy[dragItem.current as number];
    listCopy.splice(dragItem.current as number, 1);
    listCopy.splice(dragOverItem.current as number, 0, draggedItemContent);
    
    dragItem.current = dragOverItem.current;
    setProductList(listCopy);
  };

  const handleDragEnd = async () => {
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Veritabanına kaydet
    const orderedIds = productList.map(p => p.id);
    await updateProductOrder(orderedIds);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault(); // Drop işlemine izin vermek için gerekli
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eğitimler ve Ürünler</h1>
          <p className="text-slate-500">Sistemdeki tüm eğitim paketlerini sürükleyip bırakarak (Grip ikonundan) sıralayabilirsiniz.</p>
        </div>
        
        <button onClick={handleAddNew} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span>Yeni Eğitim Ekle</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Eğitim Adı</th>
                <th className="px-6 py-4">Fiyat</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Oluşturulma</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 relative">
              {productList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Henüz kayıtlı eğitim bulunmuyor.
                  </td>
                </tr>
              ) : (
                productList.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                  >
                    <td className="px-4 py-4 text-slate-400 group-hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-5 h-5" />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-400 text-xs">Yok</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[200px]" title={product.title}>{product.title}</span>
                          {product.badge && <span className="text-xs text-brand-600">{product.badge}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {product.salePrice ? (
                          <>
                            <span className="font-bold text-slate-900">{product.salePrice} ₺</span>
                            <span className="text-xs text-slate-400 line-through">{product.price} ₺</span>
                          </>
                        ) : (
                          <span className="font-bold text-slate-900">{product.price} ₺</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${product.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onPointerDown={(e) => { e.stopPropagation(); handleEdit(product); }} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onPointerDown={(e) => { e.stopPropagation(); handleDelete(product.id); }} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingProduct}
        instructors={instructors}
        categories={categories}
        products={productList}
      />
      
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Eğitimi Sil"
        message="Bu eğitimi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}
